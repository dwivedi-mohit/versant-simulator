'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, Auth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}

export default function LoginPage() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const [isTestMode, setIsTestMode] = useState(false);

    useEffect(() => {
        if (auth) {
            const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
                if (user) router.push('/');
            });
            return () => unsubscribe();
        } else {
            setIsTestMode(true);
            const mockUser = localStorage.getItem('mock_versant_user');
            if (mockUser) router.push('/');
        }
    }, [router]);

    const setupRecaptcha = () => {
        // Only run recaptcha to Firebase if real Auth exists
        if (!auth) return;
        
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth as Auth, 'recaptcha-container', {
                size: 'invisible',
            });
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (!phoneNumber || phoneNumber.length < 5) {
            setError('Please enter a valid phone number including country code (e.g. +1234567890)');
            setLoading(false);
            return;
        }

        if (!auth) {
            // MOCK FLOW IF KEYS ARE MISSING
            setTimeout(() => {
                setLoading(false);
                setConfirmationResult({ mock: true });
                alert("TESTING MODE: Because your Firebase Keys are not configured, we bypassed real SMS. To login, use OTP code: 123456");
            }, 800);
            return;
        }

        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
            
            const confirmation = await signInWithPhoneNumber(auth as Auth, formattedPhone, appVerifier);
            setConfirmationResult(confirmation);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to send OTP. Please check your number format.');
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) return;
        
        setError('');
        setLoading(true);
        
        if (!auth) {
            // MOCK OTP VERIFICATION
            setTimeout(() => {
                if (otp === '123456') {
                    localStorage.setItem('mock_versant_user', JSON.stringify({ phone: phoneNumber }));
                    router.push('/');
                } else {
                    setError('Invalid test OTP. Please type 123456');
                    setLoading(false);
                }
            }, 800);
            return;
        }
        
        try {
            await confirmationResult.confirm(otp);
            router.push('/');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Invalid OTP code entered.');
        }
        setLoading(false);
    };

    return (
        <main className="main-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '1rem' }}>
            <Card style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', borderRadius: '16px', position: 'relative' }}>
                
                {isTestMode && (
                    <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: '#fff', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        TEST MODE (NO KEYS)
                    </div>
                )}

                <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem', color: 'var(--text-color)', fontWeight: 'bold' }}>Phone Login</h1>
                
                {error && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{error}</div>}

                {!confirmationResult ? (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '0.95rem' }}>Phone Number (with country code)</label>
                            <input 
                                type="tel" 
                                value={phoneNumber} 
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+1 234 567 8900" 
                                style={{
                                    padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-color)', width: '100%', fontSize: '1rem', outline: 'none'
                                }}
                            />
                        </div>
                        <div id="recaptcha-container"></div>
                        <Button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            {loading ? 'Sending OTP...' : 'Send OTP Code'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '0.95rem' }}>Enter the 6-digit OTP code sent to {phoneNumber}</label>
                            <input 
                                type="text" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456" 
                                style={{
                                    padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-color)', width: '100%', fontSize: '1.5rem', outline: 'none', textAlign: 'center', letterSpacing: '4px'
                                }}
                            />
                        </div>
                        <Button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            {loading ? 'Verifying...' : 'Verify & Log In'}
                        </Button>
                        <button type="button" onClick={() => setConfirmationResult(null)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', opacity: 0.8, fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            Use a different phone number
                        </button>
                    </form>
                )}
            </Card>
        </main>
    );
}
