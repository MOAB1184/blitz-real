import sgMail from '@sendgrid/mail'
import type { MailDataRequired } from '@sendgrid/mail'

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined')
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL
if (!FROM_EMAIL) {
  throw new Error('SENDGRID_FROM_EMAIL is not defined')
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
  
  try {
    const msg: MailDataRequired = {
      to: email,
      from: FROM_EMAIL,
      subject: 'Verify your email address',
      html: `
        <h1>Welcome to Blitz!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      `
    }
    await sgMail.send(msg)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
  
  try {
    const msg: MailDataRequired = {
      to: email,
      from: FROM_EMAIL,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      `
    }
    await sgMail.send(msg)
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
} 