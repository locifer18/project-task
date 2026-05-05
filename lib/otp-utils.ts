import db from './client'
import { sendOtp } from './mailer'

export type OtpType = 'SIGNUP' | 'FORGOT_PASSWORD' | 'LOGIN'

export async function generateAndSendOtp(email: string, type: OtpType): Promise<void> {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
//  console.log(otp);

  // Delete any existing OTPs for this email and type
  await db.otpVerification.deleteMany({
    where: { email, type }
  })

  // Store new OTP
  await db.otpVerification.create({
    data: {
      email,
      otp: otp.toString(),
      type,
      expiresAt
    }
  })

  // Send OTP email
  const emailType = type === 'SIGNUP' ? 'signup' : type === "LOGIN" ? 'login' : 'forgot-password'
  await sendOtp(email, otp, emailType)
}

export async function verifyOtp(email: string, otp: string, type: OtpType): Promise<boolean> {
  // Find OTP record
  const otpRecord = await db.otpVerification.findFirst({
    where: {
      email,
      type,
      otp: otp.toString()
    }
  })

  if (!otpRecord) {
    return false
  }

  // Check if OTP is expired
  if (otpRecord.expiresAt < new Date()) {
    await db.otpVerification.delete({ where: { id: otpRecord.id } })
    return false
  }

  // Delete the OTP record after successful verification
  await db.otpVerification.delete({ where: { id: otpRecord.id } })
  return true
}

export async function cleanupExpiredOtps(): Promise<number> {
  try {
    const result = await db.otpVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    return result.count
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error)
    return 0
  }
}