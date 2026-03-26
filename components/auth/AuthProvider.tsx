'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (auth) {
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                if (currentUser) {
                    setUser(currentUser);
                    if (pathname === '/login') {
                        router.push('/');
                    }
                } else {
                    setUser(null);
                    if (pathname !== '/login') {
                        router.push('/login');
                    }
                }
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            // MOCK AUTHENTICATION FALLBACK FOR DEVELOPMENT
            const mockUser = localStorage.getItem('mock_versant_user');
            if (mockUser) {
                setUser(JSON.parse(mockUser));
                if (pathname === '/login') router.push('/');
            } else {
                setUser(null);
                if (pathname !== '/login') router.push('/login');
            }
            setLoading(false);
        }
    }, [pathname, router]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
                <div style={{ fontSize: '1.2rem', animation: 'pulse 1.5s infinite alternate' }}>Loading authentication...</div>
            </div>
        );
    }

    return <>{children}</>;
}
