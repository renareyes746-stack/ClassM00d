import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlan } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a structured lesson plan based on a topic and subject.
 */
export const generateLessonPlanAI = async (
  subject: string,
  topic: string,
  duration: string
): Promise<LessonPlan | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Genera una planeación de clase detallada para la materia de "${subject}" nivel preparatoria (México) sobre el tema "${topic}" con una duración de "${duration}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            objective: { type: Type.STRING },
            activities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            resources: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            duration: { type: Type.STRING },
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as LessonPlan;
    }
    return null;
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    return null;
  }
};

/**
 * Generates feedback for a student based on their grades and attendance.
 */
export const generateStudentFeedbackAI = async (
  studentName: string,
  average: number,
  attendance: number
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Escribe un breve comentario de retroalimentación (máximo 40 palabras) motivacional para el estudiante ${studentName}.
      Tiene un promedio de ${average} y una asistencia del ${attendance}%.
      El tono debe ser amable, profesional y alentador, como un docente de preparatoria en México.`,
    });
    return response.text || "Sigue esforzándote.";
  } catch (error) {
    console.error("Error generating feedback:", error);
    return "Error generando retroalimentación.";
  }
};

/**
 * Suggests a quiz question based on a topic.
 */
export const generateQuizQuestionAI = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Genera una pregunta de examen de opción múltiple difícil sobre "${topic}" para nivel preparatoria. Incluye la respuesta correcta al final.`,
    });
    return response.text || "";
  } catch (error) {
    return "";
  }
};