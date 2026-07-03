import React from 'react'
import { Link } from 'react-router-dom'
import schema from '../schema.json'
import FormRenderer from '../components/FormRenderer'

export default function Step2() {
  const onButton = (btnId?: string | null) => {
    console.log('Button clicked', btnId)
  }

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Step 2: OTP & PAN</h2>
        <Link to="/step1" className="text-sm text-blue-600">Back</Link>
      </div>

      <p className="text-sm text-gray-500 mt-1">Enter the OTP received and provide PAN details. This is a UI placeholder — no backend calls.</p>

      <div className="mt-4">
        <FormRenderer schema={(schema as any).step2} onButton={onButton} />
      </div>
    </section>
  )
}
