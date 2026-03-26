import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.WHISPER_STT_API_KEY || process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
        }

        const transcription = await openai.audio.transcriptions.create({
            file: file,
            model: 'whisper-1',
        });

        return NextResponse.json({ text: transcription.text });

    } catch (error: any) {
        console.error('STT API error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
