import { GoogleGenAI } from "@google/genai";

// Helper to safely get API key in various environments (Vite, CRA, etc.)
const getApiKey = () => {
  try {
    // Check for Vite environment
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
    // Check for Node/CRA environment
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Could not read environment variables");
  }
  return '';
};

const apiKey = getApiKey();
// Fallback for demo purposes if key is missing to prevent crash
const isConfigured = !!apiKey;

let ai: GoogleGenAI | null = null;
if (isConfigured) {
  ai = new GoogleGenAI({ apiKey });
}

export const getCoachAdvice = async (
  currentLevel: string, 
  famePerHour: number, 
  userQuery?: string
): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API not configured (Missing API Key)");
    return "Тренер отошел. (API Key не найден)";
  }

  try {
    const prompt = `
      Ты суровый, но справедливый тренер в бойцовской академии зверей (Furry Fighters).
      Игрок сейчас имеет ранг "${currentLevel}" и зарабатывает ${famePerHour} славы в час.
      
      ${userQuery ? `Боец спрашивает: "${userQuery}"` : "Дай короткий тактический совет или мотивацию для тренировки."}
      
      Отвечай ТОЛЬКО на русском языке. Используй эмодзи, подходящие для спортзала и боев.
      Ответ должен быть коротким и емким (не более 30 слов).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Держи защиту выше и продолжай бить!";
  } catch (error) {
    console.error("Coach AI Error:", error);
    return "Сосредоточься на тренировке. (Ошибка соединения)";
  }
};