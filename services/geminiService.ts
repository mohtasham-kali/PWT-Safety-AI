import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Severity, ComplianceResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for Authoring Agent
const authoringSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    permit_type: {
      type: Type.STRING,
      enum: ["Hot Work", "Confined Space", "Electrical", "Lifting", "Working at Height", "Other"],
      description: "The category of the permit based on the work description."
    },
    summary: { type: Type.STRING, description: "A concise 1-sentence summary of the job." },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Sequential steps to perform the job."
    },
    hazards: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Potential hazards identified from the description."
    },
    required_controls: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Safety controls required to mitigate hazards."
    },
    recommended_ppe: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Personal Protective Equipment required."
    },
    pre_checks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Pre-work checks to confirm safety."
    },
    suggested_severity: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High"],
      description: "The risk severity level of the job."
    }
  },
  required: ["permit_type", "summary", "steps", "hazards", "required_controls", "recommended_ppe", "pre_checks", "suggested_severity"]
};

// Schema for Compliance Agent
const complianceSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    is_consistent: { type: Type.BOOLEAN, description: "Whether the permit details are consistent with safety standards." },
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
        },
        required: ["issue", "severity"]
      }
    },
    auto_fix_suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    approval_recommendation: {
      type: Type.STRING,
      enum: ["Approve", "Require changes", "Reject"]
    }
  },
  required: ["is_consistent", "issues", "auto_fix_suggestions", "approval_recommendation"]
};

export const generatePermitDetails = async (description: string, location: string) => {
  try {
    const prompt = `
      You are an expert Safety Officer Agent. 
      Analyze the following job description and location to create a structured Permit to Work.
      
      Job Location: ${location}
      Job Description: ${description}
      
      Extract all necessary safety details. Be strict and comprehensive.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: authoringSchema,
        temperature: 0.1, // Low temperature for deterministic output
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Authoring Agent Error:", error);
    throw error;
  }
};

export const checkCompliance = async (permitJson: any) => {
  try {
    const prompt = `
      You are a Safety Compliance Auditor Agent. 
      Review the following generated permit for inconsistencies, missing controls, or dangerous conflicts.
      
      Permit JSON:
      ${JSON.stringify(permitJson, null, 2)}
      
      Check against general OSHA/ISO safety standards.
      If it involves "Hot Work", ensure fire watch and gas testing are present.
      If it involves "Confined Space", ensure air monitoring and rescue plans are present.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: complianceSchema,
        temperature: 0.1,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as {
        is_consistent: boolean;
        issues: { issue: string; severity: string }[];
        auto_fix_suggestions: string[];
        approval_recommendation: 'Approve' | 'Require changes' | 'Reject';
    };
  } catch (error) {
    console.error("Compliance Agent Error:", error);
    throw error;
  }
};
