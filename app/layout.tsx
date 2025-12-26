import './globals.css'
import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
