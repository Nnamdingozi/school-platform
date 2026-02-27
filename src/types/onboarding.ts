// app/actions/onboarding-types.ts
export interface AdminFormData {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

export interface SchoolFormData {
    schoolName: string;
    curriculumId: string;
    primaryColor: string;
    secondaryColor: string;
    country: string;
    timezone: string;
}