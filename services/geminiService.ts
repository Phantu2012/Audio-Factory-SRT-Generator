
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


const getPrompt = (language: 'en' | 'vi', maxCharsPerLine: number, scriptContent: string) => {
    const englishInstructions = `
You are an expert audio-to-text alignment tool. Your task is to generate a JSON array of subtitle objects based on the provided audio and the full text script.

**CRITICAL RULES:**

1.  **OUTPUT MUST BE VALID JSON:** Your entire output must be a single, valid JSON array of objects. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
2.  **CHARACTER LIMIT - NON-NEGOTIABLE:** The 'text' property for each JSON object MUST NOT exceed ${maxCharsPerLine} characters. This is the most important rule. If a sentence is too long, you MUST split it into multiple JSON objects, each with its own correct timestamp and index.
3.  **EXACT SCRIPT MATCH:** The combined 'text' from all JSON objects must EXACTLY MATCH the provided script. Do not add, remove, or change any words or punctuation.
4.  **ACCURATE TIMESTAMPS:** Each object must have an accurate 'startTime' and 'endTime' in "HH:MM:SS,mmm" format.
5.  **SEQUENTIAL INDEX:** Each object must have a sequential 'index', starting from 1.

**Final Check:** Before you output the result, review every single JSON object you have created to confirm that the 'text' field does not violate the ${maxCharsPerLine} character limit.
`;

    const vietnameseInstructions = `
Bạn là một công cụ chuyên gia về căn chỉnh âm thanh sang văn bản. Nhiệm vụ của bạn là tạo ra một mảng JSON chứa các đối tượng phụ đề dựa trên âm thanh được cung cấp và kịch bản văn bản đầy đủ.

**QUY TẮC TỐI QUAN TRỌNG:**

1.  **ĐẦU RA PHẢI LÀ JSON HỢP LỆ:** Toàn bộ đầu ra của bạn phải là một mảng JSON hợp lệ chứa các đối tượng. Không bao gồm bất kỳ văn bản, giải thích hoặc định dạng markdown nào khác như \`\`\`json.
2.  **GIỚI HẠN KÝ TỰ - BẮT BUỘC TUÂN THỦ:** Thuộc tính 'text' cho mỗi đối tượng JSON KHÔNG ĐƯỢC vượt quá ${maxCharsPerLine} ký tự. Đây là quy tắc quan trọng nhất. Nếu một câu quá dài, bạn PHẢI chia nó thành nhiều đối tượng JSON, mỗi đối tượng có dấu thời gian và chỉ số chính xác riêng.
3.  **TRÙNG KHỚP KỊCH BẢN TUYỆT ĐỐI:** Toàn bộ nội dung 'text' từ tất cả các đối tượng JSON cộng lại PHẢI TRÙNG KHỚP CHÍNH XÁC với kịch bản đã cung cấp. Không thêm, bớt hoặc thay đổi bất kỳ từ ngữ hay dấu câu nào.
4.  **DẤU THỜI GIAN CHÍNH XÁC:** Mỗi đối tượng phải có 'startTime' và 'endTime' chính xác ở định dạng "HH:MM:SS,mmm".
5.  **CHỈ SỐ TUẦN TỰ:** Mỗi đối tượng phải có một 'index' tuần tự, bắt đầu từ 1.

**Kiểm tra cuối cùng:** Trước khi bạn xuất kết quả, hãy xem lại từng đối tượng JSON bạn đã tạo để xác nhận rằng trường 'text' không vi phạm giới hạn ${maxCharsPerLine} ký tự.
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
    
    const textPart = getPrompt(language, maxCharsPerLine, scriptContent);

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

    let jsonData: SubtitleEntry[];
    try {
        const cleanedText = response.text.trim().replace(/^```json\s*|```\s*$/g, '');
        jsonData = JSON.parse(cleanedText);
    } catch (parseError) {
        console.error("Failed to parse JSON response:", response.text);
        throw new Error('The API returned an invalid JSON format. The alignment might have failed.');
    }

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        throw new Error('The API did not return any subtitle data. Check your file inputs.');
    }
    
    return jsonToSrt(jsonData);

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
