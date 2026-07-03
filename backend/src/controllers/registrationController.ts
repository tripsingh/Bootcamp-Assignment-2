import { Request, Response } from 'express'
import * as service from '../services/registrationService'

function isPrismaError(err: any) {
  return err && (err.isPrisma === true || err.code || err.name?.includes('Prisma'))
}

export const validateAadhaar = async (req: Request, res: Response) => {
  const { aadhaar, entrepreneurName } = req.body
  try {
    await service.createOrUpdateRegistration(aadhaar, entrepreneurName)
    // In production we'd send OTP via SMS; here we acknowledge request
    return res.status(200).json({ message: 'OTP generated and sent (simulated)', sent: true })
  } catch (err: any) {
    if (isPrismaError(err)) return res.status(503).json({ error: 'Database error' })
    return res.status(500).json({ error: 'Server error' })
  }
}

export const verifyOtp = async (req: Request, res: Response) => {
  const { aadhaar, otp } = req.body
  try {
    const reg = await service.findRegistrationByAadhaar(aadhaar)
    if (!reg) return res.status(404).json({ error: 'Registration not found' })
    if (!reg.otp || !reg.otpExpiresAt) return res.status(400).json({ error: 'OTP not generated' })
    if (new Date() > reg.otpExpiresAt) return res.status(400).json({ error: 'OTP expired' })
    if (reg.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' })

    await service.markOtpVerified(aadhaar)
    return res.status(200).json({ message: 'OTP verified' })
  } catch (err: any) {
    if (isPrismaError(err)) return res.status(503).json({ error: 'Database error' })
    return res.status(500).json({ error: 'Server error' })
  }
}

export const validatePan = async (req: Request, res: Response) => {
  const { aadhaar, pan, panType } = req.body
  try {
    const reg = await service.findRegistrationByAadhaar(aadhaar)
    if (!reg) return res.status(404).json({ error: 'Registration not found' })
    // In real app call PAN validation service; here we accept and mark verified
    await service.updatePan(aadhaar, pan, panType)
    return res.status(200).json({ message: 'PAN validated (simulated)' })
  } catch (err: any) {
    if (isPrismaError(err)) return res.status(503).json({ error: 'Database error' })
    return res.status(500).json({ error: 'Server error' })
  }
}

export const submitRegistration = async (req: Request, res: Response) => {
  const { aadhaar } = req.body
  try {
    const result = await service.submitRegistration(aadhaar)
    if (result === null) return res.status(404).json({ error: 'Registration not found' })
    if ((result as any).incomplete) return res.status(400).json({ error: 'Incomplete verification' })
    return res.status(201).json({ message: 'Registration submitted' })
  } catch (err: any) {
    if (isPrismaError(err)) return res.status(503).json({ error: 'Database error' })
    return res.status(500).json({ error: 'Server error' })
  }
}
