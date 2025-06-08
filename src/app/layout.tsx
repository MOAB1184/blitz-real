'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import SessionProvider from './session-provider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#fff4e3]`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
} 