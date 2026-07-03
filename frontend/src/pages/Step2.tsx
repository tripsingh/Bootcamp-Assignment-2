import React from 'react'
import { Link } from 'react-router-dom'
import schema from '../schema.json'
import FormRenderer from '../components/FormRenderer'
import { useForm } from 'react-hook-form'
import { step2Schema, Step2Input } from '../schemas/registration'

export default function Step2() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Step2Input>({ mode: 'onSubmit' })

  const onSubmit = (data: any) => {
    const parsed = step2Schema.safeParse({
      ...data,
      // ensure checkbox value boolean
      declaration: !!data.declaration
    })
    if (!parsed.success) {
      parsed.error.errors.forEach(e => {
        const field = e.path[0] as string
        setError(field as any, { type: 'manual', message: e.message })
      })
      return
    }
    console.log('Step2 valid', parsed.data)
  }

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Step 2: OTP & PAN</h2>
        <Link to="/step1" className="text-sm text-blue-600">Back</Link>
      </div>

      <p className="text-sm text-gray-500 mt-1">Enter the OTP received and provide PAN details. This is a UI placeholder — no backend calls.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <FormRenderer schema={(schema as any).step2} register={register} errors={errors} />
      </form>
    </section>
  )
}
