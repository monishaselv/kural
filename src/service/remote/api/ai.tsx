import { GoogleGenerativeAI, Part } from '@google/generative-ai';
// import { GEMINI_KEY } from 'react-native-dotenv';
import { GEMINI_KEY } from '@env';


const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const SYSTEM_PROMPT = `You are a knowledgeable assistant for a Thirukkural learning app.
You help users understand the meaning, context, and real-life relevance of Thirukkural verses.

You can:
- Explain any Kural in simple modern language (Tamil or English)
- Find Kurals related to a topic or theme
- Share the Adhikaram (chapter) context
- Relate Kurals to real life situations

Always be respectful of the ancient wisdom. When citing a Kural, mention its number and Adhikaram.
If the user asks in Tamil, respond in Tamil. Otherwise respond in English.`;

export async function askKuralAI(userMessage: string | (string | Part)[], chatHistory = []) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  // Gemini uses 'model' instead of 'assistant' for role
  const formattedHistory = chatHistory.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  console.log(formattedHistory);
  console.log('sjhfghg....00');

  const chat = model.startChat({ history: formattedHistory });
  console.log('sjhfghg....01');

  const result = await chat.sendMessage(userMessage);
  console.log('sjhfghg....02');
  return result.response.text();
}