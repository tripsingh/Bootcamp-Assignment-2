import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

type FormValues = {
  aadhaar: string
  entrepreneurName: string
}

export default function Step1() {
  const { register, handleSubmit } = useForm<FormValues>()
  const navigate = useNavigate()

  const onSubmit = (data: FormValues) => {
    // No backend call; simulate success and navigate to step2
    console.log('Step1 submit', data)
    navigate('/step2')
  }

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg font-semibold">Step 1: Aadhaar verification</h2>
      <p className="text-sm text-gray-500 mt-1">Enter Aadhaar details to validate and generate OTP.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
          <input id="aadhaar" {...register('aadhaar')} inputMode="numeric" maxLength={12} className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter Aadhaar Number" />
        </div>

        <div>
          <label htmlFor="entrepreneurName" className="block text-sm font-medium text-gray-700">Entrepreneur Name</label>
          <input id="entrepreneurName" {...register('entrepreneurName')} className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter Name as on Aadhaar" />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Validate & Generate OTP</button>
          <button type="button" className="px-4 py-2 bg-white border rounded text-gray-700" onClick={() => console.log('Save for later')}>Save & Continue Later</button>
        </div>
      </form>
    </section>
  )
}
