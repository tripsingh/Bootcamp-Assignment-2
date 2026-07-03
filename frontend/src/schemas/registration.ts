import { z } from 'zod'

export const step1Schema = z.object({
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
  entrepreneurName: z.string().min(1, 'Entrepreneur name is required')
})

export type Step1Input = z.infer<typeof step1Schema>

export const step2Schema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN format invalid'),
  panType: z.string().min(1, 'PAN Type is required'),
  declaration: z.boolean().refine(v => v === true, { message: 'Declaration is required' })
})

export type Step2Input = z.infer<typeof step2Schema>
