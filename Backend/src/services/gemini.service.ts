import { GoogleGenerativeAI } from '@google/generative-ai';
import Feedback, { IFeedback } from '../models/Feedback';

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-8b',
].filter(Boolean) as string[];

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

const extractJson = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json|```/gi, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('AI did not return a valid JSON object.');
    }
    return JSON.parse(match[0]);
  }
};

const buildFallbackAnalysis = (feedback: IFeedback) => {
  const text = `${feedback.title} ${feedback.description}`.toLowerCase();

  const isBug = /bug|error|issue|crash|broken|fails?|failure|not working|problem/.test(text);
  const isAuth = /login|signin|sign in|signup|sign up|authentication|password|token/.test(text);
  const isPerformance = /slow|lag|delay|performance|freeze|loading|latency/.test(text);
  const isUI = /ui|ux|design|layout|button|page|screen|display|view/.test(text);
  const isSecurity = /security|vulnerab|xss|csrf|csrf|injection|attack/.test(text);

  const ai_category = isAuth
    ? 'Authentication'
    : isSecurity
      ? 'Security'
      : isPerformance
        ? 'Performance'
        : isUI
          ? 'UI/UX'
          : isBug
            ? 'Bug'
            : feedback.category;

  const ai_sentiment: IFeedback['ai_sentiment'] = isBug || isSecurity || isPerformance ? 'Negative' : 'Neutral';
  const ai_priority = isSecurity ? 10 : isAuth ? 9 : isPerformance ? 8 : isBug ? 7 : 5;

  const summarySource = feedback.description.trim().replace(/\s+/g, ' ');
  const ai_summary = summarySource.length > 140
    ? `${summarySource.slice(0, 137)}...`
    : summarySource;

  const ai_tags = [
    ai_category.toLowerCase().replace(/\s+/g, '-'),
    feedback.category.toLowerCase().replace(/\s+/g, '-'),
  ];

  return {
    ai_category,
    ai_sentiment,
    ai_priority,
    ai_summary,
    ai_tags,
  };
};

const generateAnalysisText = async (prompt: string) => {
  let lastError: unknown;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      lastError = error;
      console.warn(`Gemini model failed: ${modelName}`);
    }
  }

  throw lastError || new Error('All Gemini model candidates failed.');
};

export const processFeedbackWithAI = async (feedback: IFeedback) => {
  try {
    const prompt = getAnalysisPrompt(feedback);
    const text = await generateAnalysisText(prompt);
    const aiAnalysis = extractJson(text);

    feedback.ai_category = aiAnalysis.ai_category || 'N/A';
    feedback.ai_sentiment = aiAnalysis.ai_sentiment || 'Neutral';
    feedback.ai_priority = aiAnalysis.ai_priority || 5;
    feedback.ai_summary = aiAnalysis.ai_summary || 'No summary generated.';
    feedback.ai_tags = aiAnalysis.ai_tags || [];
    feedback.ai_processed = true;

    return await feedback.save();
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const fallback = buildFallbackAnalysis(feedback);
    feedback.ai_category = fallback.ai_category;
    feedback.ai_sentiment = fallback.ai_sentiment;
    feedback.ai_priority = fallback.ai_priority;
    feedback.ai_summary = fallback.ai_summary;
    feedback.ai_tags = fallback.ai_tags;
    feedback.ai_processed = true;

    return await feedback.save();
  }
};