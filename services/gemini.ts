import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeMeeting = async (minutes: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Please summarize these meeting minutes concisely into key action items and decisions: ${minutes}`,
    config: {
        systemInstruction: "You are an expert corporate secretary. Focus on decisions and clear next steps.",
        temperature: 0.5
    }
  });

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
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return { insights: ["No data available"] };
    }
};