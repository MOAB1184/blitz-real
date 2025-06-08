import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Blitz - Local Events & Creators',
  description: 'Connect with local events and creators in your community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#fff4e3]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 