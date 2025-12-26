import { ReactNode } from 'react'

export default function PageContainer({
  children,
}: {
  children: ReactNode
}) {
  return (
    <main className="max-w-5xl mx-auto p-4">
      {children}
    </main>
  )
}
