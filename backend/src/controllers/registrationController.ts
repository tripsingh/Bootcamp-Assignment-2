import { Request, Response } from 'express'
import prisma from '../prisma/client'

// Simulate OTP generation (in real app send SMS)
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const validateAadhaar = async (req: Request, res: Response) => {
  const { aadhaar, entrepreneurName } = req.body
  try {
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    const registration = await prisma.registration.upsert({
      where: { aadhaar },
      update: { entrepreneurName, otp, otpExpiresAt: expiresAt, otpVerified: false },
      create: { aadhaar, entrepreneurName, otp, otpExpiresAt: expiresAt }
    })

    // Note: In production we'd send the OTP via SMS; here we return a 200 and do not reveal OTP.
    return res.status(200).json({ message: 'OTP generated and sent (simulated)', sent: true })
  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
}

export const verifyOtp = async (req: Request, res: Response) => {
  const { aadhaar, otp } = req.body
  try {
    const reg = await prisma.registration.findUnique({ where: { aadhaar } })
    if (!reg) return res.status(404).json({ error: 'Registration not found' })
    if (!reg.otp || !reg.otpExpiresAt) return res.status(400).json({ error: 'OTP not generated' })
    if (new Date() > reg.otpExpiresAt) return res.status(400).json({ error: 'OTP expired' })
    if (reg.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' })

    await prisma.registration.update({ where: { aadhaar }, data: { otpVerified: true } })
    return res.status(200).json({ message: 'OTP verified' })
  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
}

export const validatePan = async (req: Request, res: Response) => {
  const { aadhaar, pan, panType } = req.body
  try {
    const reg = await prisma.registration.findUnique({ where: { aadhaar } })
    if (!reg) return res.status(404).json({ error: 'Registration not found' })
    // In real app call PAN validation service; here we accept and mark verified
    await prisma.registration.update({ where: { aadhaar }, data: { pan, panType, panVerified: true } })
    return res.status(200).json({ message: 'PAN validated (simulated)' })
  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
}

export const submitRegistration = async (req: Request, res: Response) => {
  const { aadhaar } = req.body
  try {
    const reg = await prisma.registration.findUnique({ where: { aadhaar } })
    if (!reg) return res.status(404).json({ error: 'Registration not found' })
    if (!reg.otpVerified || !reg.panVerified) return res.status(400).json({ error: 'Incomplete verification' })
    await prisma.registration.update({ where: { aadhaar }, data: { submittedAt: new Date() } })
    return res.status(201).json({ message: 'Registration submitted' })
  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
}
