import { useState, useRef, useCallback } from 'react';

export function useAudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const tempBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(tempBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setAudioBlob(null); // Reset blob for new recording
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        } else if (!mediaRecorderRef.current && isRecording) {
            // Mic failed or denied, force an empty blob to unstick the test engine
            setAudioBlob(new Blob());
            setIsRecording(false);
        }
    }, [isRecording]);

    return { isRecording, startRecording, stopRecording, audioBlob, setAudioBlob };
}
