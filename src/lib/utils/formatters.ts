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