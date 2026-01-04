
import { GoogleGenAI, Type } from "@google/genai";
import { IntelligenceReport, SecurityAudit } from "../types";

export const performSecurityAudit = async (techConcept: string): Promise<SecurityAudit> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following technology for cybersecurity vulnerabilities: "${techConcept}".
    Identify potential risks, describe them, and suggest mitigations.
    Provide scores for encryption strength and overall integrity (0-100).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
          encryptionStrength: { type: Type.INTEGER },
          integrityScore: { type: Type.INTEGER },
          vulnerabilities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                description: { type: Type.STRING },
                mitigation: { type: Type.STRING }
              }
            }
          }
        },
        required: ["riskLevel", "encryptionStrength", "integrityScore", "vulnerabilities"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const synthesizeIntelligence = async (prompt: string, format: string): Promise<Partial<IntelligenceReport>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Write a high-quality cybersecurity intelligence report based on: "${prompt}". 
    Format: ${format}. Include a catchy title, detailed content, and relevant tags.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          category: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "content", "category", "tags"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
