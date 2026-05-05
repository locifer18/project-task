import db from './client'

export async function cleanupExpiredOtps() {
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

// Run cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupExpiredOtps, 5 * 60 * 1000)
}