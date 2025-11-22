import { GoogleGenAI } from "@google/genai";
import { KPI } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzePerformance = async (kpis: KPI[]): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Unable to generate insights: API Key missing.";

  try {
    const dataString = JSON.stringify(kpis.map(k => ({
      name: k.name,
      actual: k.actual,
      target: k.target,
      unit: k.unit,
      performance: `${((k.actual / k.target) * 100).toFixed(1)}%`
    })));

    const prompt = `
      You are a senior executive business analyst. Review the following KPI data for our dashboard.
      
      Data:
      ${dataString}
      
      Provide a brief, high-level executive summary (max 150 words). 
      Highlight top performers and areas requiring immediate attention. 
      Use a professional, encouraging, yet direct tone.
      Format with clear bullet points for readability using Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "An error occurred while analyzing the data. Please try again later.";
  }
};

export const generateSampleKPIs = async (industry: string): Promise<KPI[]> => {
    // This is a stub to demonstrate where generation logic would go if we wanted auto-population.
    // For this app, we will stick to the analysis feature as the primary AI integration.
    return []; 
}