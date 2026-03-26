import "./globals.css";
import type { Metadata } from "next";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
    title: "Versant by Mohit",
    description: "AI-powered Versant English Test Simulation",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
