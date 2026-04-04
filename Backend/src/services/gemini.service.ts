import { GoogleGenerativeAI } from '@google/generative-ai';
import Feedback, { IFeedback } from '../models/Feedback';

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const getAnalysisPrompt = (feedback: IFeedback) => `
You are a product manager assistant. Analyze the following user feedback and provide a structured JSON response.

Feedback Title: ${feedback.title}
Feedback Description: ${feedback.description}
Feedback Category: ${feedback.category}

Please provide a JSON object with the following keys:
- "ai_category": A more specific category (e.g., "UI/UX", "Performance", "Security", "Authentication").
- "ai_sentiment": The overall sentiment ("Positive", "Negative", "Neutral").
- "ai_priority": A numerical priority from 1 (lowest) to 10 (highest).
- "ai_summary": A one-sentence summary of the feedback.
- "ai_tags": An array of 3-5 relevant tags (e.g., ["mobile", "bug", "checkout", "ui"]).

Respond with ONLY the raw JSON object. Do not include any other text or formatting.
`;

export const processFeedbackWithAI = async (feedback: IFeedback) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = getAnalysisPrompt(feedback);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to ensure it's valid JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return a valid JSON object.');
    }
    const aiAnalysis = JSON.parse(jsonMatch[0]);

    feedback.ai_category = aiAnalysis.ai_category || 'N/A';
    feedback.ai_sentiment = aiAnalysis.ai_sentiment || 'Neutral';
    feedback.ai_priority = aiAnalysis.ai_priority || 5;
    feedback.ai_summary = aiAnalysis.ai_summary || 'No summary generated.';
    feedback.ai_tags = aiAnalysis.ai_tags || [];
    feedback.ai_processed = true;

    return await feedback.save();
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    feedback.ai_processed = true; // Mark as processed to avoid re-trying indefinitely
    feedback.ai_summary = 'AI analysis failed.';
    return await feedback.save();
  }
};