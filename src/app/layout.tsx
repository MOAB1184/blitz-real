import './globals.css'
import { Inter } from 'next/font/google'
import SessionProvider from '@/components/providers/SessionProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const runtime = 'nodejs'

export const metadata = {
  title: 'Blitz - Local Events & Creators',
  description: 'Connect with local events and creators in your community',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error('Error fetching session:', error)
  }

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#fff4e3]`}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
} 