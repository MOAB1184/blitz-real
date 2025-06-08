import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const hashedPassword = await bcrypt.hash(password, 10)

    // Map role to valid enum value
    let userRole = 'CREATOR'
    if (role?.toUpperCase() === 'SPONSOR' || role?.toUpperCase() === 'BUSINESS') {
      userRole = 'SPONSOR'
    } else if (role?.toUpperCase() === 'ADMIN') {
      userRole = 'ADMIN'
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: userRole as any, // Type assertion needed due to Prisma's strict typing
        verificationToken,
        verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
} 