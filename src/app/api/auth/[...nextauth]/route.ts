import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

console.log('NextAuth handler loaded');

const handler = async (...args: any[]) => {
  console.log('NextAuth handler called with args:', args[0]?.method, args[0]?.url);
  // @ts-ignore
  return (await NextAuth(authOptions))(...args)
}

export { handler as GET, handler as POST } 