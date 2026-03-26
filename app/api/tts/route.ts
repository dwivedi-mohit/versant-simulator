import { NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// Using a generic professional voice ID (e.g., '21m00Tcm4TlvDq8ikWAM' Rachel or similar, or default).
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah (professional)

export async function POST(req: Request) {
    try {
        const { text, voice_id } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const targetVoiceId = voice_id || VOICE_ID;

        if (!ELEVENLABS_API_KEY) {
            return NextResponse.json({ error: 'ElevenLabs API Key not configured' }, { status: 500 });
        }

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_turbo_v2_5',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('ElevenLabs Error:', errorData);
            return NextResponse.json({ error: 'Failed to generate audio' }, { status: response.status });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'inline; filename="tts.mp3"',
            },
        });

    } catch (error: any) {
        console.error('TTS API error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
