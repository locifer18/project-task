import nodemailer from 'nodemailer'
import { forgetTemplate, loginTemplate, mailToClient, mailToAdmin, signupTemplate } from './node_mock'
import db from './client'

const APP_NAME = "TaskFlow"
const APP_EMAIL = "noreply@taskflow.app"

const emailUser = process.env.EMAIL_USER
const pass = process.env.EMAIL_PASS

const isEmailConfigured = emailUser && pass &&
  emailUser !== 'your-email@gmail.com' &&
  pass !== 'your-app-specific-password'

let transporter: any = null

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    secure: true,
    port: 465,
    service: "gmail",
    auth: { user: emailUser, pass }
  })
}

export async function sendOtp(useremail: string, otp: number, type: 'signup' | 'login' | 'forgot-password' = 'signup'): Promise<boolean> {
  try {
    const subject = type === 'signup' ? `${APP_EMAIL} - Verify your email` : type === "login" ? `${APP_EMAIL} - Login OTP` : `${APP_EMAIL} - Reset your password`
    const title = type === 'signup' ? `${APP_NAME} - Account Verification` : type === "login" ? `${APP_NAME} - Login` : `${APP_NAME} - Password Reset`
    const message = type === 'signup'
      ? 'Please use this code to complete your account registration.'
      : type === "login" ? 'Please use this code to login to your account.' : 'Please use this code to reset your password.'

    let htmlTemplate: string
    switch (type) {
      case "signup":
        htmlTemplate = signupTemplate.replace("{{TITLE}}", title).replace("{{OTP}}", `${otp}`).replace("{{MESSAGE}}", message)
        break
      case "login":
        htmlTemplate = loginTemplate.replace("{{TITLE}}", title).replace("{{OTP}}", `${otp}`).replace("{{MESSAGE}}", message)
        break
      case "forgot-password":
        htmlTemplate = forgetTemplate.replace("{{TITLE}}", title).replace("{{OTP}}", `${otp}`).replace("{{MESSAGE}}", message)
        break
      default:
        htmlTemplate = `<p>Your OTP is: <strong>${otp}</strong></p>`
    }

    await transporter.sendMail({ from: emailUser, to: useremail, subject, html: htmlTemplate })
    return true
  } catch (error) {
    console.error('Failed to send OTP email:', error)
    throw new Error('Failed to send OTP email')
  }
}

export async function sendTaskAssignmentEmail(
  userEmail: string, userName: string, taskTitle: string,
  taskDescription: string, dueDate: string, priority: string
): Promise<boolean> {
  try {
    const subject = `${APP_NAME} - New Task Assigned: ${taskTitle}`
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <h2>New Task Assigned</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>A new task has been assigned to you.</p>
        <table style="font-size:14px;background:#f9fafb;padding:16px;border-radius:8px;width:100%;">
          <tr><td style="padding:8px 0;font-weight:600;">Task</td><td>${taskTitle}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;">Priority</td><td>${priority}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;">Due Date</td><td>${dueDate}</td></tr>
        </table>
        <p>Best regards,<br><strong>${APP_NAME}</strong></p>
      </div>`
    await transporter.sendMail({ from: emailUser, to: userEmail, subject, html })
    return true
  } catch (error) {
    console.error("Failed to send task assignment email:", error)
    return false
  }
}

export async function sendProjectAssignedEmail(
  toEmail: string, userName: string, projectName: string, clientName?: string
): Promise<boolean> {
  try {
    const subject = `${APP_NAME} - New Project Assigned: ${projectName}`
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <h2>New Project Assignment</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>You have been assigned to project: <strong>${projectName}</strong>${clientName ? ` (${clientName})` : ''}.</p>
        <p>Best regards,<br><strong>${APP_NAME}</strong></p>
      </div>`
    await transporter.sendMail({ from: emailUser, to: toEmail, subject, html })
    return true
  } catch (error) {
    console.error("Failed to send project assigned email:", error)
    return false
  }
}

export async function sendAdminLeaveNotificationEmail(
  adminEmail: string, adminName: string,
  leaveData: { empName: string; department: string; leaveType: string; startDate: string; endDate: string; reason: string }
): Promise<boolean> {
  try {
    const subject = `${APP_NAME} - New Leave Request from ${leaveData.empName}`
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <h2>New Leave Request</h2>
        <p>Hi <strong>${adminName}</strong>,</p>
        <p>${leaveData.empName} has requested ${leaveData.leaveType} leave.</p>
        <p><strong>Duration:</strong> ${new Date(leaveData.startDate).toDateString()} → ${new Date(leaveData.endDate).toDateString()}</p>
        <p><strong>Reason:</strong> ${leaveData.reason}</p>
        <p>Best regards,<br><strong>${APP_NAME}</strong></p>
      </div>`
    await transporter.sendMail({ from: emailUser, to: adminEmail, subject, html })
    return true
  } catch (error) {
    console.error("Failed to send admin leave notification email:", error)
    return false
  }
}

export async function sendAdminProjectNotificationEmail(
  adminEmail: string, adminName: string,
  projectData: { projectName: string; clientName?: string; budget: number; projectType: string }
): Promise<boolean> {
  try {
    const subject = `${APP_NAME} - New Project Created: ${projectData.projectName}`
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <h2>New Project Created</h2>
        <p>Hi <strong>${adminName}</strong>,</p>
        <p>A new project <strong>${projectData.projectName}</strong> has been created.</p>
        <p><strong>Type:</strong> ${projectData.projectType} | <strong>Budget:</strong> ₹${projectData.budget}</p>
        <p>Best regards,<br><strong>${APP_NAME}</strong></p>
      </div>`
    await transporter.sendMail({ from: emailUser, to: adminEmail, subject, html })
    return true
  } catch (error) {
    console.error("Failed to send admin project notification email:", error)
    return false
  }
}

export async function sendAdminPaymentNotificationEmail(
  adminEmail: string, adminName: string, type: 'accepted' | 'query',
  paymentData: { clientName: string; projectName: string; amount: string; querySubject?: string }
): Promise<boolean> {
  try {
    const isAccepted = type === 'accepted'
    const subject = `${APP_NAME} - Payment ${isAccepted ? 'Accepted' : 'Query'}: ${paymentData.projectName}`
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <h2>Payment ${isAccepted ? 'Accepted' : 'Query Raised'}</h2>
        <p>Hi <strong>${adminName}</strong>,</p>
        <p>${paymentData.clientName} - ${paymentData.projectName} - ₹${paymentData.amount}</p>
        ${!isAccepted && paymentData.querySubject ? `<p><strong>Query:</strong> ${paymentData.querySubject}</p>` : ''}
        <p>Best regards,<br><strong>${APP_NAME}</strong></p>
      </div>`
    await transporter.sendMail({ from: emailUser, to: adminEmail, subject, html })
    return true
  } catch (error) {
    console.error("Failed to send admin payment notification email:", error)
    return false
  }
}

export async function sendAdminClockNotificationEmail(
  adminEmail: string, adminName: string, type: "clock_in" | "clock_out",
  data: { title: string; message: string; section: string; createdAt: Date; isRead: boolean }
): Promise<boolean> {
  try {
    const subject = `${APP_NAME} - ${data.title}`
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <h2>${data.title}</h2>
        <p>Hi <strong>${adminName}</strong>,</p>
        <p>${data.message}</p>
        <p><strong>Time:</strong> ${new Date(data.createdAt).toLocaleString()}</p>
        <p>Best regards,<br><strong>${APP_NAME}</strong></p>
      </div>`
    await transporter.sendMail({ from: emailUser, to: adminEmail, subject, html })
    return true
  } catch (error) {
    console.error("Failed to send admin clock notification email:", error)
    return false
  }
}

export async function sendBulkAdminEmails(
  type: 'leave' | 'payment_accepted' | 'payment_query' | 'project' | 'clock_in' | 'clock_out',
  data: any
): Promise<boolean[]> {
  try {
    const admins = await db.user.findMany({
      where: { role: "ADMIN" },
    })
    if (admins.length === 0) return []

    const results = await Promise.allSettled(admins.map(async (admin) => {
      switch (type) {
        case 'leave': return sendAdminLeaveNotificationEmail(admin.email, admin.name, data)
        case 'payment_accepted': return sendAdminPaymentNotificationEmail(admin.email, admin.name, 'accepted', data)
        case 'payment_query': return sendAdminPaymentNotificationEmail(admin.email, admin.name, 'query', data)
        case 'project': return sendAdminProjectNotificationEmail(admin.email, admin.name, data)
        case 'clock_in': return sendAdminClockNotificationEmail(admin.email, admin.name, 'clock_in', data)
        case 'clock_out': return sendAdminClockNotificationEmail(admin.email, admin.name, 'clock_out', data)
        default: return false
      }
    }))
    return results.map(r => r.status === 'fulfilled' ? r.value : false)
  } catch (error) {
    console.error("Failed to send bulk admin emails:", error)
    return []
  }
}

export async function verifyEmailConfig(): Promise<boolean> {
  if (!isEmailConfigured) return false
  try {
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Email server verification failed:', error)
    return false
  }
}

// Keep these stubs so other files that import them don't break
export async function sendMailToAdmin(...args: any[]): Promise<boolean> { return false }
export async function sendMailToClient(...args: any[]): Promise<boolean> { return false }
export async function sendPaymentRequestMailToClient(...args: any[]): Promise<boolean> { return false }
export async function sendPaymentConfirmationMailToClient(...args: any[]): Promise<boolean> { return false }
export async function sendProjectTicketEmail(...args: any[]): Promise<boolean> { return false }
export async function sendLeaveStatusEmail(...args: any[]): Promise<boolean> { return false }
export async function sendProjectAssignmentEmail(...args: any[]): Promise<boolean> { return false }
export async function sendPayoutNotificationEmail(...args: any[]): Promise<boolean> { return false }
export async function sendProjectUpdateEmail(...args: any[]): Promise<boolean> { return false }
export async function sendMeetingEmail(...args: any[]): Promise<boolean> { return false }
export async function sendCertificateEmail(...args: any[]): Promise<boolean> { return false }
export async function sendMeetingEmailLink(...args: any[]): Promise<boolean> { return false }
export async function sendMeetingStatusEmail(...args: any[]): Promise<boolean> { return false }
export async function sendFeatureRequestEmail(...args: any[]): Promise<boolean> { return false }
export async function sendFeatureStatusEmail(...args: any[]): Promise<boolean> { return false }
export async function sendClientFeedbackEmail(...args: any[]): Promise<boolean> { return false }
export async function sendFeedbackEmail(...args: any[]): Promise<boolean> { return false }
