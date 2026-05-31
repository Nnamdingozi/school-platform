// 'use client'

// import { Sun, Moon } from 'lucide-react'
// import { useEffect, useState } from 'react'

// interface ThemeToggleProps {
//     className?: string
// }

// // Reads the current theme from the <html> element
// function getCurrentTheme(): 'dark' | 'light' {
//     if (typeof document === 'undefined') return 'light'
//     return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
// }

// export function ThemeToggle({ className }: ThemeToggleProps) {
//     const [theme, setTheme] = useState<'dark' | 'light'>('light')

//     // Sync state with the class already applied by the server (no flicker)
//     useEffect(() => {
//         setTheme(getCurrentTheme())
//     }, [])

//     async function toggle() {
//         const next = theme === 'dark' ? 'light' : 'dark'

//         // 1. Apply immediately to DOM (instant feedback)
//         document.documentElement.classList.toggle('dark', next === 'dark')

//         // 2. Persist in cookie (survives refresh without waiting for DB)
//         document.cookie = `theme=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`

//         // 3. Persist in DB (source of truth, fire-and-forget)
//         await fetch('/api/user/theme', {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ theme: next }),
//         }).catch(() => {
//             // Non-critical — cookie already saved the preference
//             console.warn('Failed to persist theme to DB')
//         })

//         setTheme(next)
//     }

//     return (
//         <button
//             onClick={toggle}
//             aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
//             className={[
//                 'rounded-md p-2 transition-colors',
//                 'text-muted-foreground hover:text-foreground',
//                 'hover:bg-accent',
//                 className,
//             ]
//                 .filter(Boolean)
//                 .join(' ')}
//         >
//             {theme === 'dark' ? (
//                 <Sun className="h-4 w-4" />
//             ) : (
//                 <Moon className="h-4 w-4" />
//             )}
//         </button>
//     )
// }





'use client'

import { useState, useEffect, useTransition } from 'react'
import { Sun, Moon, Loader2 } from 'lucide-react'
import { updateUserTheme, type ThemeValue } from '@/app/actions/profile'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
    className?: string
}

/**
 * UTILITY: Resolves the current theme from the document root.
 */
function getCurrentTheme(): ThemeValue {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * REGISTRY INTERFACE TOGGLE (Tier 3)
 * Rule 14: Optimistic UI - Updates DOM and Cookies immediately.
 * Rule 11: Final System Truth - Persists preference to DB via Server Action.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
    const [theme, setTheme] = useState<ThemeValue>('light');
    const [isPending, startTransition] = useTransition();

    // Rule 12: Sync state with server-applied class on mount to prevent flickering.
    useEffect(() => {
        setTheme(getCurrentTheme());
    }, []);

    const toggleTheme = () => {
        const nextTheme: ThemeValue = theme === 'dark' ? 'light' : 'dark';

        // 1. Rule 14: Optimistic UI Update (DOM)
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');

        // 2. Local State Sync
        setTheme(nextTheme);

        // 3. Cookie Persistence (Survival across page refreshes before DB sync)
        document.cookie = `theme=${nextTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

        // 4. Rule 11: Background Synchronization with Registry
        startTransition(async () => {
            const res = await updateUserTheme(nextTheme);
            if (!res.success) {
                console.warn("[THEME_SYNC_WARNING]:", res.error);
                // We don't rollback theme for a non-critical UI preference, 
                // but we log it for debugging.
            }
        });
    };

    return (
        <button
            onClick={toggleTheme}
            disabled={isPending}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} registry mode`}
            className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-slate-900 transition-all hover:bg-slate-800 hover:border-school-primary/30 group",
                className
            )}
        >
            <div className="relative h-5 w-5">
                {/* Sun Icon (Light Mode) */}
                <Sun 
                    className={cn(
                        "absolute inset-0 h-5 w-5 text-amber-500 transition-all duration-500 transform",
                        theme === 'dark' ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
                    )} 
                />
                
                {/* Moon Icon (Dark Mode) */}
                <Moon 
                    className={cn(
                        "absolute inset-0 h-5 w-5 text-blue-400 transition-all duration-500 transform",
                        theme === 'light' ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
                    )} 
                />
            </div>

            {/* Rule 14: Subtle indicator for background sync */}
            {isPending && (
                <div className="absolute -top-1 -right-1">
                    <Loader2 className="h-3 w-3 animate-spin text-school-primary opacity-50" />
                </div>
            )}

            {/* Tooltip Overlay */}
            <span className="absolute top-full mt-2 scale-0 rounded bg-slate-800 px-2 py-1 text-[8px] font-black uppercase text-white transition-all group-hover:scale-100 whitespace-nowrap z-50">
                Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </span>
        </button>
    );
}