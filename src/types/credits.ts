export interface InitiatePaymentResult {
    success: boolean
    authorizationUrl?: string
    reference?: string
    error?: string
}

export interface VerifyPaymentResult {
    success: boolean
    credits?: number
    error?: string
}

export interface CreditPackage {
    id: string;
    name: string;
    credits: number;
    priceNGN: number;
    priceUSD: number;
    description: string;
    popular: boolean;
}
