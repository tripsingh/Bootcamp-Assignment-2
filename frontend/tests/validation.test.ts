import { step1Schema, step2Schema } from '../src/schemas/registration'

describe('Frontend validation schemas', () => {
  describe('step1Schema', () => {
    it('accepts valid aadhaar and entrepreneurName', () => {
      const parsed = step1Schema.safeParse({ aadhaar: '123456789012', entrepreneurName: 'Test User' })
      expect(parsed.success).toBe(true)
    })

    it('rejects invalid aadhaar length', () => {
      const parsed = step1Schema.safeParse({ aadhaar: '1234', entrepreneurName: 'Test User' })
      expect(parsed.success).toBe(false)
      expect(parsed.error?.errors[0].message).toContain('Aadhaar must be exactly 12 digits')
    })

    it('rejects missing entrepreneurName', () => {
      const parsed = step1Schema.safeParse({ aadhaar: '123456789012', entrepreneurName: '' })
      expect(parsed.success).toBe(false)
      expect(parsed.error?.errors[0].message).toContain('Entrepreneur name is required')
    })
  })

  describe('step2Schema', () => {
    it('accepts valid OTP, PAN, panType, and declaration', () => {
      const parsed = step2Schema.safeParse({
        otp: '123456',
        pan: 'ABCDE1234F',
        panType: 'individual',
        declaration: true
      })
      expect(parsed.success).toBe(true)
    })

    it('rejects invalid OTP', () => {
      const parsed = step2Schema.safeParse({
        otp: '123',
        pan: 'ABCDE1234F',
        panType: 'individual',
        declaration: true
      })
      expect(parsed.success).toBe(false)
      expect(parsed.error?.errors[0].message).toContain('OTP must be 6 digits')
    })

    it('rejects invalid PAN', () => {
      const parsed = step2Schema.safeParse({
        otp: '123456',
        pan: '1234',
        panType: 'individual',
        declaration: true
      })
      expect(parsed.success).toBe(false)
      expect(parsed.error?.errors[0].message).toContain('PAN format invalid')
    })

    it('rejects missing declaration', () => {
      const parsed = step2Schema.safeParse({
        otp: '123456',
        pan: 'ABCDE1234F',
        panType: 'individual',
        declaration: false
      })
      expect(parsed.success).toBe(false)
      expect(parsed.error?.errors[0].message).toContain('Declaration is required')
    })
  })
})
