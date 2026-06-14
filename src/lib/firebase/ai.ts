import { app } from "./config";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// Initialize the AI Logic service with Gemini Developer API backend
export const ai = getAI(app, { backend: new GoogleAIBackend() });

const routineSchema = {
  type: "array",
  description: "Lista de ejercicios de la rutina de gimnasio",
  items: {
    type: "object",
    properties: {
      name: { type: "string", description: "Nombre del ejercicio" },
      sets: { type: "integer", description: "Número de series" },
      reps: { type: "string", description: "Número de repeticiones (ej. '10-12' o 'al fallo')" },
      rest: { type: "string", description: "Descanso (ej. '60 seg')" },
      tips: { type: "string", description: "Consejo breve de técnica" },
    },
    required: ["name", "sets", "reps", "rest", "tips"],
  },
};

// Export a pre-configured model for JSON output (Workout Routine)
export const workoutModel = getGenerativeModel(ai, {
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    responseMimeType: "application/json",
    // @ts-ignore
    responseSchema: routineSchema,
    temperature: 0.7,
  }
});

const exerciseDetailSchema = {
  type: "object",
  properties: {
    description: { type: "string", description: "Instrucciones paso a paso de cómo hacer el ejercicio" },
    muscles: { type: "array", items: { type: "string" }, description: "Lista de músculos principales trabajados" },
  },
  required: ["description", "muscles"],
};

export const exerciseDetailModel = getGenerativeModel(ai, {
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    responseMimeType: "application/json",
    // @ts-ignore
    responseSchema: exerciseDetailSchema,
    temperature: 0.4,
  }
});
