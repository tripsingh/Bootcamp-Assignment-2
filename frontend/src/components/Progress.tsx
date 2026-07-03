import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Progress({ current = 1 }: { current?: number }) {
  const location = useLocation()
  const step = location.pathname.includes('step2') ? 2 : current

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>Registration</div>
        <div>Step {step} of 2</div>
      </div>
      <div className="mt-3 w-full bg-gray-200 h-2 rounded overflow-hidden">
        <div className={`h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded`} style={{ width: `${(step / 2) * 100}%` }} />
      </div>
      <nav className="mt-3 flex gap-3 text-xs">
        <Link to="/step1" className={`px-2 py-1 rounded ${step === 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}>1. Aadhaar</Link>
        <Link to="/step2" className={`px-2 py-1 rounded ${step === 2 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}>2. OTP & PAN</Link>
      </nav>
    </div>
  )
}
