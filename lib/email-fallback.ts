// Fallback email service for development
export async function sendOtpFallback(email: string, otp: number): Promise<boolean> {
  // In development, just log the OTP
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  
  // In production, this should throw an error
  throw new Error('Email service not configured')
}