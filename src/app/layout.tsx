import './globals.css'
import { Inter } from 'next/font/google'
import SessionProvider from '@/components/providers/SessionProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const runtime = 'nodejs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Blitz - Local Events & Creators',
  description: 'Connect with local events and creators in your community',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

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