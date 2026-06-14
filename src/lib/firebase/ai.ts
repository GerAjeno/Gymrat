import { app } from "./config";
import { getVertexAI, getGenerativeModel, Schema } from "firebase/vertexai";

// Inicializamos el servicio de Vertex AI en Firebase
const vertexAI = getVertexAI(app);

// Esquemático de salida para la rutina de entrenamiento completa
// Esto obliga al modelo de IA a devolver un JSON exacto con esta estructura
const routineSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string", description: "Nombre del ejercicio en español, ej. 'Press de Banca'" },
      sets: { type: "integer", description: "Número de series" },
      reps: { type: "string", description: "Rango de repeticiones, ej. '8-12' o 'Al fallo'" },
      rest: { type: "string", description: "Tiempo de descanso en segundos, ej. '90'" },
      tips: { type: "string", description: "Breve tip de técnica en español" }
    },
    required: ["name", "sets", "reps", "rest", "tips"]
  }
} as Schema;

// Modelo especializado para generar el "esqueleto" de la rutina
// Utiliza gemini-2.5-flash-lite porque es el más rápido y económico para estructurar datos
export const workoutModel = getGenerativeModel(vertexAI, {
  model: "gemini-2.5-flash-lite",
  systemInstruction: "Eres un entrenador personal de élite. Crea rutinas de gimnasio devueltas en estricto formato JSON usando el esquema provisto.",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: routineSchema,
    temperature: 0.7, // Nivel de creatividad: 0.7 permite variedad sin perder coherencia
  }
});

// Esquemático de salida para los detalles técnicos de un ejercicio
const exerciseDetailSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string", description: "Guía paso a paso detallada sobre cómo ejecutar el ejercicio" },
    difficulty: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"] },
    muscleGroups: { 
      type: "array", 
      items: { type: "string" },
      description: "Lista de músculos trabajados (ej. 'Pecho', 'Tríceps')"
    },
    equipment: {
      type: "array",
      items: { type: "string" },
      description: "Equipo necesario (ej. 'Banco plano', 'Mancuernas')"
    }
  },
  required: ["name", "description", "difficulty", "muscleGroups", "equipment"]
} as Schema;

// Modelo especializado para generar la información técnica "Profunda" de un ejercicio
// Esta consulta solo se hace una vez por ejercicio y se cachea en Firestore
export const exerciseDetailModel = getGenerativeModel(vertexAI, {
  model: "gemini-2.5-flash-lite",
  systemInstruction: "Eres un experto en biomecánica deportiva. Describe ejercicios con precisión técnica, indicando músculos y equipo necesario. Devuelve estricto JSON.",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: exerciseDetailSchema,
    temperature: 0.2, // Temperatura muy baja (0.2) para que las respuestas sean técnicas y deterministas
  }
});
