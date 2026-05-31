// // src/app/(landing)/layout.tsx
// import { Navbar } from "@/components/landing/navbar";
// import { Footer } from "@/components/landing/footer";

// export default function LandingLayout({ children }: { children: React.ReactNode }) {
//     return (
//         <>
//             <Navbar />
//             {children}
//             <Footer />
//         </>
//     );
// }


// src/app/(landing)/layout.tsx
//
// Theme and school colors are handled by the root layout (app/layout.tsx).
// This layout only adds the Navbar and Footer around landing page content.

// import { Navbar } from '@/components/landing/navbar'
// import { Footer } from '@/components/landing/footer'

// export default function LandingLayout({
//     children,
// }: {
//     children: React.ReactNode
// }) {
//     return (
//         <div className="min-h-screen flex flex-col">
//             <Navbar />
//             <main className="flex-1">
//                 {children}
//             </main>
//             <Footer />
//         </div>
//     )
// }



import React from 'react';
import { cookies } from 'next/headers';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { cn } from '@/lib/utils';

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface LandingLayoutProps {
    children: React.ReactNode;
}

/**
 * LANDING HUB LAYOUT
 * Rule 11: High-fidelity Registry standard.
 * Rule 12: Server-side theme resolution to prevent hydration flicker.
 * Rule 18: Semantic Flip (bg-background, text-foreground).
 * Rule 20: Compulsory Responsiveness.
 */
export default async function LandingLayout({ children }: LandingLayoutProps) {
    // Rule 12: Resolve the interface theme from the registry cookies
    const cookieStore = await cookies();
    const resolvedTheme = cookieStore.get('theme')?.value || 'dark';

    return (
        <div 
            className={cn(
                "min-h-screen flex flex-col transition-colors duration-500",
                "bg-background text-foreground", // Rule 18: Semantic Tokens
                resolvedTheme === 'dark' ? 'dark' : ''
            )}
        >
            {/* ── NAVIGATION HUB ── */}
            <Navbar />
            
            {/* ── CONTENT TERMINAL ── */}
            {/* 
                We use flex-1 to ensure the footer stays at the bottom.
                The animate-in ensures a premium 'registry-fetch' feel 
                when landing on the invitation or home pages.
            */}
            <main className="flex-1 w-full overflow-x-hidden">
                <div className="animate-in fade-in duration-1000">
                    {children}
                </div>
            </main>
            
            {/* ── FOOTER REGISTRY ── */}
            <Footer />
        </div>
    );
}