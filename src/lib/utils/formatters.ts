// lib/utils/formatters.ts

export const toTitleCase = (str: string): string =>
    str.trim().replace(/\w\S*/g, txt =>
        txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    )

// Other formatting helpers you'll likely need
export const formatRole = (role: string): string =>
    role.replace(/_/g, ' ').toLowerCase().replace(/\w\S*/g, txt =>
        txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    )

export const formatPhone = (phone: string): string =>
    phone.trim().replace(/\s+/g, ' ')

// src/lib/utils/formatters.ts — add this function
export function letterFromPercentage(pct: number | null): string {
    if (pct == null) return '-';
    if (pct >= 85)   return 'A';
    if (pct >= 70)   return 'B';
    if (pct >= 55)   return 'C';
    if (pct >= 40)   return 'D';
    return 'E';
}