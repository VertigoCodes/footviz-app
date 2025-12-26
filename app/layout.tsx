import './globals.css'
import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
