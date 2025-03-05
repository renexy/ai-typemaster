/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_AI_KEY);

interface GenerateTextOptions {
  difficulty: 'easy' | 'medium' | 'hard';
}

export const generateTypingText = async ({ difficulty }: GenerateTextOptions): Promise<string> => {
  const prompt = getPromptForDifficulty(difficulty);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt) as any;
    const text = result.response?.candidates[0].content.parts[0].text;

    if (!text || text.length < 1) throw new Error('err');
    return text;
  } catch (error) {
    console.error('Error generating text:', error);
    return getBackupText(difficulty);
  }
};

const getPromptForDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  const basePrompt = "Generate a typing test paragraph that is maximum 330 characters long, ";
  
  switch (difficulty) {
    case 'easy':
      return `${basePrompt} easy to type with simple words, common punctuation, and around 15-20 words. Use basic vocabulary and short sentences. DO NOT REPLY WITH ANYTHING ELSE OTHER THAN THE TEST PARAGAPH`;
    case 'medium':
      return `${basePrompt} moderately challenging with mixed vocabulary, standard punctuation, and around 25-30 words. Include some compound sentences. DO NOT REPLY WITH ANYTHING ELSE OTHER THAN THE TEST PARAGAPH`;
    case 'hard':
      return `${basePrompt} challenging with complex vocabulary, varied punctuation, and around 35-40 words. Include compound-complex sentences and sophisticated vocabulary. DO NOT REPLY WITH ANYTHING ELSE OTHER THAN THE TEST PARAGAPH`;
  }
};

const getBackupText = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  switch (difficulty) {
    case 'easy':
      return "The quick brown fox jumps over the lazy dog. It was a sunny day in the park.";
    case 'medium':
      return "The magnificent sunset painted the sky in brilliant hues of orange and purple, while birds soared gracefully overhead.";
    case 'hard':
      return "In the midst of winter's embrace, the crystalline snowflakes descended gracefully, transforming the landscape into a pristine wonderland that sparkled beneath the moon's ethereal glow.";
  }
}; 