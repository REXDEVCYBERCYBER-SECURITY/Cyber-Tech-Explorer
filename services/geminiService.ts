
import { GoogleGenAI, Type } from "@google/genai";
import { IntelligenceReport, SecurityAudit } from "../types";

export interface CyberThreat {
  title: string;
  summary: string;
  severity: 'Critical' | 'High' | 'Medium';
  sources: { uri: string; title: string }[];
}

export const fetchLatestThreats = async (): Promise<CyberThreat[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Identify the 5 most critical and recent cybersecurity threats, active data breaches, or major vulnerabilities reported in the last 48 hours. Provide a title, a short tactical summary, and categorize their severity.",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "";
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  const sources = groundingChunks
    .filter(chunk => chunk.web)
    .map(chunk => ({
      uri: chunk.web?.uri || "",
      title: chunk.web?.title || "Source Intel"
    }));

  const threatBlocks = text.split(/\n\d\.\s+/).filter(b => b.trim().length > 0);
  
  return threatBlocks.slice(0, 5).map((block, idx) => {
    const lines = block.trim().split('\n');
    return {
      title: lines[0].replace(/[*#]/g, '').trim() || "Detected Anomaly",
      summary: block.substring(block.indexOf('\n') + 1).trim(),
      severity: block.toLowerCase().includes('critical') ? 'Critical' : 
                block.toLowerCase().includes('high') ? 'High' : 'Medium',
      sources: sources.slice(idx * 2, (idx * 2) + 2)
    };
  });
};

export const generateInventionVisual = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `A hyper-realistic cyberpunk quantum invention, technical schematics style mixed with high-tech photography, neon lighting, dark background, detailed machinery: ${prompt}`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data received from manifestation engine.");
};

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
