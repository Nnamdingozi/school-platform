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
