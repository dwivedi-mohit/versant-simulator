import { useState } from 'react';

export function useSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);

    const playTTS = async (text: string, voiceId?: string) => {
        setIsSpeaking(true);
        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, voice_id: voiceId })
            });

            if (!res.ok) throw new Error('TTS failed');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);

            return new Promise<void>((resolve) => {
                audio.onended = () => {
                    setIsSpeaking(false);
                    resolve();
                };
                audio.play().catch(e => {
                    console.error("Audio play blocked", e);
                    setIsSpeaking(false);
                    resolve();
                });
            });
        } catch (err) {
            console.error(err);
            setIsSpeaking(false);
        }
    };

    const transcribe = async (blob: Blob): Promise<string> => {
        setIsTranscribing(true);
        try {
            const formData = new FormData();
            formData.append('file', blob, 'audio.webm');

            const res = await fetch('/api/stt', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('STT failed');

            const data = await res.json();
            setIsTranscribing(false);
            return data.text;
        } catch (err) {
            console.error(err);
            setIsTranscribing(false);
            return '';
        }
    };

    return { playTTS, transcribe, isSpeaking, isTranscribing };
}
