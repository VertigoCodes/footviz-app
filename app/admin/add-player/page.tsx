'use client'

import { useState } from 'react'

export default function AddPlayerPage() {
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        position,
        stats: {
          pace: 5,
          passing: 5,
          shooting: 5,
          defending: 5,
          stamina: 5,
        },
      }),
    })

    const data = await res.json()

    if (data.success) {
      setMessage('Player added')
      setName('')
      setPosition('')
    } else {
      setMessage('Failed to add player')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Add Player</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="w-full border p-2"
          placeholder="Position"
          value={position}
          onChange={e => setPosition(e.target.value)}
        />

        <button className="w-full bg-black text-white p-2">
          Add Player
        </button>
      </form>

      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  )
}
