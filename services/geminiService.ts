
import { GoogleGenAI } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        // This case should ideally not happen with readAsDataURL
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

export const generateSrtFromAudioAndScript = async (audioFile: File, scriptContent: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please provide your API key to proceed.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const audioPart = await fileToGenerativePart(audioFile);
    
    const textPart = {
      text: `
You are an expert audio-to-text alignment tool. Your task is to generate a subtitle file in SRT format based on the provided audio and a full text script.

Follow these instructions precisely:
1.  Analyze the audio to determine the exact start and end times for each line of the script.
2.  The text in the generated SRT file MUST EXACTLY MATCH the provided script. Do not add, remove, or change any words or punctuation.
3.  Format the output strictly as an SRT file. Do not include any extra explanations, comments, or text before or after the SRT content.

Here is the script you must use for the subtitles:
--- SCRIPT START ---
${scriptContent}
--- SCRIPT END ---
`
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [audioPart, textPart] },
    });

    const srtContent = response.text;
    if (!srtContent || !srtContent.includes('-->')) {
        throw new Error('The API did not return a valid SRT file. The alignment might have failed. Check your API key and file inputs.');
    }
    
    return srtContent.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while communicating with the Gemini API.');
  }
};
