'use client'

import { Suspense } from 'react'
import ComparePageClient from './ComparePageClient'

export const dynamic = 'force-dynamic'

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-4">Loading comparison…</div>}>
      <ComparePageClient />
    </Suspense>
  )
}
