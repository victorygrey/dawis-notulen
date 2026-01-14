
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize with named parameter and direct process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeMeeting = async (minutes: string) => {
  // Use ai.models.generateContent directly; assuming API_KEY is available as per guidelines
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Please summarize these meeting minutes concisely into key action items and decisions: ${minutes}`,
    config: {
        systemInstruction: "You are an expert corporate secretary. Focus on decisions and clear next steps.",
        temperature: 0.5
    }
  });

  // response.text is a property, not a method
  return response.text || "Failed to generate summary.";
};

export const analyzeKPIPerformance = async (data: any) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this KPI data and provide 3 actionable insights to improve performance: ${JSON.stringify(data)}`,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  insights: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                  }
              }
          }
      }
    });
    
    try {
        // Accessing response.text directly as a property
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return { insights: ["No data available"] };
    }
}
