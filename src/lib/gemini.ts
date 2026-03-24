import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getMentorHelp(code: string, error: string, context: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are CodeBuddy, a friendly AI coding mentor. 
      The user is working on: ${context}.
      Their current code is: \`\`\`${code}\`\`\`
      They encountered this error: ${error}.
      
      Provide a friendly, encouraging, and clear explanation of what went wrong. 
      Don't just give the answer; guide them to understand the concept. 
      Use emojis and a helpful tone.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops! I'm having a bit of trouble connecting to my brain. Try checking your syntax or logic again!";
  }
}

export async function getLessonExplanation(topic: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the coding concept of "${topic}" in a way that is easy for a beginner to understand. 
      Use a real-world analogy and keep it concise.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I couldn't generate an explanation right now. Let's try again in a bit!";
  }
}
