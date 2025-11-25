import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIParseResult } from "../types";

// Initialize Gemini Client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const WORKOUT_PARSER_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    exercises: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The standardized name of the exercise (e.g., 'Bench Press')" },
          sets: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                reps: { type: Type.NUMBER, description: "Number of repetitions" },
                weight: { type: Type.NUMBER, description: "Weight used" },
                unit: { type: Type.STRING, description: "Unit of weight (kg or lbs)" }
              },
              required: ["reps", "weight", "unit"]
            }
          }
        },
        required: ["name", "sets"]
      }
    }
  },
  required: ["exercises"]
};

export const parseWorkoutCommand = async (command: string): Promise<AIParseResult | null> => {
  try {
    const modelId = "gemini-2.5-flash-lite"; // Fast model for low latency command parsing

    const prompt = `
      You are a fitness logging assistant. Parse the following natural language workout command into a structured JSON format.
      
      User Command: "${command}"
      
      Rules:
      1. Identify exercise names, sets, reps, and weights.
      2. If sets are implied (e.g. "100kg for 5 reps"), assume 1 set unless specified otherwise.
      3. Normalize exercise names to standard gym terminology.
      4. Default to 'kg' if unit is not specified, unless context implies otherwise.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: WORKOUT_PARSER_SCHEMA,
        temperature: 0.1 // Low temperature for deterministic parsing
      }
    });

    const text = response.text;
    if (!text) return null;

    const parsed = JSON.parse(text) as AIParseResult;
    return parsed;
  } catch (error) {
    console.error("Error parsing workout command with Gemini:", error);
    return null;
  }
};