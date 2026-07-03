import { z } from 'zod'

export const validateAadhaarSchema = z.object({
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
  entrepreneurName: z.string().min(1, 'Entrepreneur name is required')
})

export const verifyOtpSchema = z.object({
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits')
})

export const validatePanSchema = z.object({
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN format invalid'),
  panType: z.string().min(1, 'PAN Type is required')
})

export const submitSchema = z.object({
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits')
})
