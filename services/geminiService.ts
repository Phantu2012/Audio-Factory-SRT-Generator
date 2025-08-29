
import { GoogleGenAI, Type } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      mimeType: file.type,
      data,
    },
  };
};

type SubtitleEntry = {
  index: number;
  startTime: string;
  endTime: string;
  text: string;
};

const formatTimeToMilliseconds = (time: string): number => {
    if (typeof time !== 'string') return NaN;
    const parts = time.split(/[:,]/);
    if (parts.length !== 4) return NaN;

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    const milliseconds = parseInt(parts[3], 10);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
        return NaN;
    }

    return (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
};

const formatMillisecondsToTime = (totalMilliseconds: number): string => {
    if (isNaN(totalMilliseconds) || totalMilliseconds < 0) {
        // This should not be reached if repairSubtitles works, but as a fallback.
        const date = new Date(0);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
        const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
        return `${hours}:${minutes}:${seconds},${milliseconds}`;
    }
    const date = new Date(totalMilliseconds);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds},${milliseconds}`;
};

const repairSubtitles = (jsonData: SubtitleEntry[]): SubtitleEntry[] => {
    if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) return [];

    const repairedData: SubtitleEntry[] = JSON.parse(JSON.stringify(jsonData));

    for (let i = 0; i < repairedData.length; i++) {
        const entry = repairedData[i];
        
        let startTimeMs = formatTimeToMilliseconds(entry.startTime);
        let endTimeMs = formatTimeToMilliseconds(entry.endTime);
        
        // Fix start time
        if (isNaN(startTimeMs)) {
            const prevEntry = i > 0 ? repairedData[i - 1] : null;
            // The previous end time should already be repaired and valid.
            const prevEndTimeMs = prevEntry ? formatTimeToMilliseconds(prevEntry.endTime) : 0;
            startTimeMs = isNaN(prevEndTimeMs) ? 0 : prevEndTimeMs + 1; // Add 1ms to prevent overlap
        }

        // Fix end time if it's invalid or before start time
        if (isNaN(endTimeMs) || endTimeMs <= startTimeMs) {
            const nextEntry = i < repairedData.length - 1 ? repairedData[i + 1] : null;
            let fixed = false;
            if (nextEntry) {
                // Use original next entry's start time for anchor, which is still in repairedData at this point
                const nextStartTimeMs = formatTimeToMilliseconds(nextEntry.startTime);
                if (!isNaN(nextStartTimeMs) && nextStartTimeMs > startTimeMs) {
                    endTimeMs = nextStartTimeMs - 1; // End 1ms before next one
                    fixed = true;
                }
            }
            
            // If still not fixed, estimate from text length
            if (!fixed) {
                const charsPerSecond = 15; 
                const estimatedDurationMs = (entry.text.length / charsPerSecond) * 1000;
                endTimeMs = startTimeMs + Math.max(1000, estimatedDurationMs); // Min 1 second duration
            }
        }
        
        entry.startTime = formatMillisecondsToTime(startTimeMs);
        entry.endTime = formatMillisecondsToTime(endTimeMs);
    }
    
    return repairedData;
};


const splitLongSubtitles = (jsonData: SubtitleEntry[], maxChars: number): SubtitleEntry[] => {
    const processedEntries: SubtitleEntry[] = [];
    let currentIndex = 1;

    for (const entry of jsonData) {
        if (entry.text.length <= maxChars) {
            processedEntries.push({ ...entry, index: currentIndex++ });
            continue;
        }

        const startTimeMs = formatTimeToMilliseconds(entry.startTime);
        const endTimeMs = formatTimeToMilliseconds(entry.endTime);
        const totalDuration = endTimeMs - startTimeMs;
        
        if (isNaN(totalDuration) || totalDuration <= 0) {
            // Cannot determine duration, so don't split. Push the original entry.
            processedEntries.push({ ...entry, index: currentIndex++ });
            continue;
        }

        const words = entry.text.split(' ');
        const totalLength = entry.text.length;
        
        let currentLine = '';
        let lineStartTime = startTimeMs;

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const potentialLine = currentLine ? `${currentLine} ${word}` : word;

            if (potentialLine.length > maxChars && currentLine.length > 0) {
                const lineDuration = Math.round((currentLine.length / totalLength) * totalDuration);
                const lineEndTime = lineStartTime + lineDuration;
                
                processedEntries.push({
                    index: currentIndex++,
                    startTime: formatMillisecondsToTime(lineStartTime),
                    endTime: formatMillisecondsToTime(lineEndTime),
                    text: currentLine,
                });

                lineStartTime = lineEndTime;
                currentLine = word;
            } else {
                currentLine = potentialLine;
            }
        }
        
        // Add the last line
        if (currentLine) {
             processedEntries.push({
                index: currentIndex++,
                startTime: formatMillisecondsToTime(lineStartTime),
                endTime: entry.endTime, // Last chunk gets the original end time
                text: currentLine,
            });
        }
    }
    return processedEntries;
};


const jsonToSrt = (jsonData: SubtitleEntry[]): string => {
  return jsonData
    .map(entry => {
      const text = entry.text.trim();
      const startTime = entry.startTime.trim();
      const endTime = entry.endTime.trim();
      
      if (!text || !startTime || !endTime || !entry.index) return '';

      return `${entry.index}\n${startTime} --> ${endTime}\n${text}`;
    })
    .filter(Boolean)
    .join('\n\n');
};

const getPrompt = (language: 'en' | 'vi', scriptContent: string) => {
    const englishInstructions = `
You are an expert audio-to-text alignment tool. Your task is to generate a JSON array of subtitle objects based on the provided audio and the full text script.

**CRITICAL RULES:**
1.  **OUTPUT MUST BE VALID JSON:** Your entire output must be a single, valid JSON array of objects. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
2.  **EXACT SCRIPT MATCH:** The combined 'text' from all JSON objects must EXACTLY MATCH the provided script. Do not add, remove, or change any words or punctuation.
3.  **ACCURATE TIMESTAMPS:** Each object must have an accurate 'startTime' and 'endTime' in "HH:MM:SS,mmm" format.
4.  **SEQUENTIAL INDEX:** Each object must have a sequential 'index', starting from 1.
5.  **NATURAL PHRASING:** Group words into natural, coherent phrases. Do not create subtitles for single words unless necessary.
`;

    const vietnameseInstructions = `
Bạn là một công cụ chuyên gia về căn chỉnh âm thanh sang văn bản. Nhiệm vụ của bạn là tạo ra một mảng JSON chứa các đối tượng phụ đề dựa trên âm thanh được cung cấp và kịch bản văn bản đầy đủ.

**QUY TẮC TỐI QUAN TRỌNG:**
1.  **ĐẦU RA PHẢI LÀ JSON HỢP LỆ:** Toàn bộ đầu ra của bạn phải là một mảng JSON hợp lệ chứa các đối tượng. Không bao gồm bất kỳ văn bản, giải thích hoặc định dạng markdown nào khác như \`\`\`json.
2.  **TRÙNG KHỚP KỊCH BẢN TUYỆT ĐỐI:** Toàn bộ nội dung 'text' từ tất cả các đối tượng JSON cộng lại PHẢI TRÙNG KHỚP CHÍNH XÁC với kịch bản đã cung cấp. Không thêm, bớt hoặc thay đổi bất kỳ từ ngữ hay dấu câu nào.
3.  **DẤU THỜI GIAN CHÍNH XÁC:** Mỗi đối tượng phải có 'startTime' và 'endTime' chính xác ở định dạng "HH:MM:SS,mmm".
4.  **CHỈ SỐ TUẦN TỰ:** Mỗi đối tượng phải có một 'index' tuần tự, bắt đầu từ 1.
5.  **NGẮT CÂU TỰ NHIÊN:** Nhóm các từ thành các cụm từ tự nhiên, mạch lạc. Không tạo phụ đề cho từng từ riêng lẻ trừ khi cần thiết.
`;

    const instructions = language === 'vi' ? vietnameseInstructions : englishInstructions;
    const scriptHeader = language === 'vi' ? '--- KỊCH BẢN BẮT ĐẦU ---' : '--- SCRIPT START ---';
    const scriptFooter = language === 'vi' ? '--- KỊCH BẢN KẾT THÚC ---' : '--- SCRIPT END ---';
    const scriptPromptHeader = language === 'vi' ? 'Đây là kịch bản bạn phải sử dụng cho phụ đề:' : 'Here is the script you must use for the subtitles:';

    return {
        text: `
${instructions}

${scriptPromptHeader}
${scriptHeader}
${scriptContent}
${scriptFooter}
`
    };
};

export const generateSrtFromAudioAndScript = async (
    audioFile: File, 
    scriptContent: string, 
    maxCharsPerLine: number, 
    apiKey: string,
    language: 'en' | 'vi'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });

  try {
    const audioPart = await fileToGenerativePart(audioFile);
    
    const textPart = getPrompt(language, scriptContent);

    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          index: { type: Type.INTEGER },
          startTime: { type: Type.STRING },
          endTime: { type: Type.STRING },
          text: { type: Type.STRING },
        },
        required: ["index", "startTime", "endTime", "text"],
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [audioPart, textPart] },
      config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
      }
    });

    let initialJsonData: SubtitleEntry[];
    try {
        const cleanedText = response.text.trim().replace(/^```json\s*|```\s*$/g, '');
        initialJsonData = JSON.parse(cleanedText);
    } catch (parseError) {
        console.error("Failed to parse JSON response:", response.text);
        throw new Error('The API returned an invalid JSON format. The alignment might have failed.');
    }

    if (!Array.isArray(initialJsonData) || initialJsonData.length === 0) {
        throw new Error('The API did not return any subtitle data. Check your file inputs.');
    }
    
    // Repair potentially broken timestamps from the model
    const repairedJsonData = repairSubtitles(initialJsonData);

    // Post-process to enforce character limits
    const finalJsonData = splitLongSubtitles(repairedJsonData, maxCharsPerLine);
    
    return jsonToSrt(finalJsonData);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error('Invalid API Key. Please check your key and try again.');
        }
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while communicating with the Gemini API.');
  }
};
