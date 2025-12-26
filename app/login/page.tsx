'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import PageContainer from '@/components/PageContainer'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    })

    if (result?.error) {
      setError('Invalid credentials')
    } else {
      window.location.href = '/players'
    }
  }

  return (
  <PageContainer>
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>

        <input
          className="w-full border p-2"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          className="w-full border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button className="w-full bg-black text-white p-2">
          Login
        </button>
      </form>
    </div>
  </PageContainer>
)

}
