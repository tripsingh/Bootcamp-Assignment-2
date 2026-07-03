import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-blue-600 flex items-center justify-center text-white font-bold">U</div>
          <div className="text-lg font-semibold">Udyam Registration</div>
        </Link>
        <div className="text-sm text-gray-500 hidden sm:block">Step-by-step registration</div>
      </div>
    </header>
  )
}
