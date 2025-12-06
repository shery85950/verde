import { GoogleGenAI } from "@google/genai";
import { SUMMARY_CONTEXT } from "../constants";

export const queryVerdeBot = async (question: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please check your environment configuration.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        ${SUMMARY_CONTEXT}
        
        User Question: ${question}
        
        Answer concisely in simple terms suitable for a non-expert. Focus on the mechanics of Verde and RepOps.
      `,
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};