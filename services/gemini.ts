
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateAICaption(videoDescription: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a social media trend expert. Create a short, punchy, Gen-Z style caption (with 2 emojis) for a video described as: "${videoDescription}". Keep it under 60 characters. Do not include hashtags.`,
    });
    return response.text?.trim() || "Vibing to this! ✨";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "This is pure fire! 🔥";
  }
}
