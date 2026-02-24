// src/app/DashboardChecker.tsx
'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SchoolProvider } from "@/context/schoolProvider";
import { Profile } from "@/generated/prisma/client";

interface DashboardCheckerProps {
    children: ReactNode;

}

export function DashboardChecker({ children}: DashboardCheckerProps) {
    const pathname = usePathname();
    const isInDashboard = pathname.startsWith('/(dashboard)'); // Modify this as needed

    return (
        <>
            {isInDashboard ? (
                <SchoolProvider>
                    {children}
                </SchoolProvider>
            ) : (
                children
            )}
        </>
    );
}