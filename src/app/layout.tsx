import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Providers } from './providers'

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
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
} 