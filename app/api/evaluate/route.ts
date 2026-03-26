import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    let section = '';
    let userAnswer = '';
    let correctAnswer = '';
    let questionText = '';

try {
    const body = await req.json();
    section = body.section;
    userAnswer = body.userAnswer;
    correctAnswer = body.correctAnswer;
    questionText = body.questionText;

    if (!userAnswer) {
        return NextResponse.json({ score: 0, feedback: 'No answer provided.' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ score: 0, feedback: 'OpenAI API key missing in server.' }, { status: 500 });
    }

    let systemPrompt = '';

    switch (section) {
        case 'A':
        case 'D':
            systemPrompt = `Compare the user's answer to the correct answer: "${correctAnswer}".
Score 1 if it is an exact or near-exact match (ignore capitalization, punctuation, and minor spelling typos). Give 0 only if entirely wrong. Return ONLY a JSON object: {"score": number, "feedback": "string"}`;
            break;
        case 'B':
            systemPrompt = `The user was asked to build a single sentence out of parts. Correct sentence: "${correctAnswer}".
User answer: "${userAnswer}".
Score 1 if grammatically correct and conveys the exact same intended meaning (ignore minor typos). Give 0 otherwise. Return ONLY a JSON object: {"score": number, "feedback": "string"}`;
            break;
        case 'C':
            systemPrompt = `The user listened to a conversation and answered a question. Correct concept: "${correctAnswer}".
User answer: "${userAnswer}".
Score 1 if the user's answer correctly addresses the concept, even if phrased differently. Give 0 otherwise. Return ONLY a JSON object: {"score": number, "feedback": "message"}`;
            break;
        case 'E':
            systemPrompt = `User was asked to complete the sentence: "${questionText}".
Correct word: "${correctAnswer}". User provided: "${userAnswer}".
Score 1 if the word is appropriate and corrects the sentence. Typos are acceptable. Give 0 otherwise. Return ONLY a JSON object: {"score": number, "feedback": "message"}`;
            break;
        case 'F':
            systemPrompt = `Evaluate the user's summary of the following passage out of 6 points total (3 points for Core Content, 2 points for Grammar, 1 point for Fluency/Length).
Passage: "${correctAnswer}". 
User summary: "${userAnswer}".
Return ONLY a JSON object exactly like this: {"score": number, "feedback": "short detailed breakdown"}`;
            break;
        default:
            return NextResponse.json({ score: 0, feedback: 'Invalid section' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userAnswer }
        ],
        response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"score": 0, "feedback": "Failed"}');

    // Ensure type safety so React doesn't concatenate strings
    if (typeof result.score === 'string') {
        result.score = parseInt(result.score, 10) || 0;
    }

    return NextResponse.json(result);

} catch (error: any) {
    console.error('Evaluation API error (Falling back to local matched grading):', error.message);

    // --- OFFLINE/QUOTA FALLBACK LOGIC ---
    // If the user's OpenAI API key runs out of credits (429), grade locally so the app keeps functioning!
    const ua = (userAnswer || '').toLowerCase().replace(/[.,!?]/g, '').trim();
    const ca = (correctAnswer || '').toLowerCase().replace(/[.,!?]/g, '').trim();
    let fallbackScore = 0;
    let fallbackFeedback = "Offline Fallback Evaluation: Incorrect.";

    if (section === 'A' || section === 'D' || section === 'E' || section === 'B') {
        if (ua === ca) {
            fallbackScore = 1;
            fallbackFeedback = "Offline Fallback Evaluation: Perfect match!";
        } else if (ca.includes(ua) && ua.length > 3) {
            fallbackScore = 1;
            fallbackFeedback = "Offline Fallback Evaluation: Acceptable match.";
        } else {
            fallbackFeedback = `Offline Fallback Evaluation: Expected "${ca}" but received "${ua}".`;
        }
    } else if (section === 'C') {
        if (ua.length > 2) {
            fallbackScore = 1;
            fallbackFeedback = "Offline Fallback Evaluation: Answer recorded (Assumed correct in offline mode).";
        }
    } else if (section === 'F') {
        if (ua.length > 20) {
            fallbackScore = 6;
            fallbackFeedback = "Offline Fallback Evaluation: Length sufficient (Assumed max points in offline mode).";
        }
    }

    return NextResponse.json({ score: fallbackScore, feedback: fallbackFeedback, error: error.message }, { status: 200 });
}
}
