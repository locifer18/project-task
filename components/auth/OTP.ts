import { sendOtp as sendOtpEmail } from '@/lib/mailer'

export async function sendOtp(email: string, otp: number): Promise<boolean> {
  return await sendOtpEmail(email, otp)
}