import React from 'react'
import { useNavigate } from 'react-router-dom'
import schema from '../schema.json'
import FormRenderer from '../components/FormRenderer'

export default function Step1() {
  const navigate = useNavigate()

  const onButton = (btnId?: string | null) => {
    // placeholder: when Validate & Generate OTP clicked, go to step2
    if (btnId === 'validateAadhaar' || btnId === null) {
      navigate('/step2')
    }
  }

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg font-semibold">Step 1: Aadhaar verification</h2>
      <p className="text-sm text-gray-500 mt-1">Enter Aadhaar details to validate and generate OTP.</p>

      <div className="mt-4">
        <FormRenderer schema={(schema as any).step1} onButton={onButton} />
      </div>
    </section>
  )
}
