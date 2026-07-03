import React from 'react'
import { useNavigate } from 'react-router-dom'
import schema from '../schema.json'
import FormRenderer from '../components/FormRenderer'
import { useForm } from 'react-hook-form'
import { step1Schema, Step1Input } from '../schemas/registration'

export default function Step1() {
  const navigate = useNavigate()
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Step1Input>({ mode: 'onSubmit' })

  const onSubmit = (data: any) => {
    const parsed = step1Schema.safeParse(data)
    if (!parsed.success) {
      parsed.error.errors.forEach(e => {
        const field = e.path[0] as string
        setError(field as any, { type: 'manual', message: e.message })
      })
      return
    }
    // success
    navigate('/step2')
  }

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg font-semibold">Step 1: Aadhaar verification</h2>
      <p className="text-sm text-gray-500 mt-1">Enter Aadhaar details to validate and generate OTP.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <FormRenderer schema={(schema as any).step1} register={register} errors={errors} />
      </form>
    </section>
  )
}
