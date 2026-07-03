import prisma from '../prisma/client'

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createOrUpdateRegistration(aadhaar: string, entrepreneurName?: string) {
  try {
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    const registration = await prisma.registration.upsert({
      where: { aadhaar },
      update: { entrepreneurName, otp, otpExpiresAt: expiresAt, otpVerified: false },
      create: { aadhaar, entrepreneurName, otp, otpExpiresAt: expiresAt }
    })

    return { registration }
  } catch (e) {
    const err = new Error('Database error') as any
    err.isPrisma = true
    err.cause = e
    throw err
  }
}

export async function findRegistrationByAadhaar(aadhaar: string) {
  try {
    return await prisma.registration.findUnique({ where: { aadhaar } })
  } catch (e) {
    const err = new Error('Database error') as any
    err.isPrisma = true
    err.cause = e
    throw err
  }
}

export async function markOtpVerified(aadhaar: string) {
  try {
    return await prisma.registration.update({ where: { aadhaar }, data: { otpVerified: true } })
  } catch (e) {
    const err = new Error('Database error') as any
    err.isPrisma = true
    err.cause = e
    throw err
  }
}

export async function updatePan(aadhaar: string, pan?: string, panType?: string) {
  try {
    return await prisma.registration.update({ where: { aadhaar }, data: { pan, panType, panVerified: true } })
  } catch (e) {
    const err = new Error('Database error') as any
    err.isPrisma = true
    err.cause = e
    throw err
  }
}

export async function submitRegistration(aadhaar: string) {
  try {
    const reg = await prisma.registration.findUnique({ where: { aadhaar } })
    if (!reg) return null
    if (!reg.otpVerified || !reg.panVerified) return { incomplete: true }
    const updated = await prisma.registration.update({ where: { aadhaar }, data: { submittedAt: new Date() } })
    return updated
  } catch (e) {
    const err = new Error('Database error') as any
    err.isPrisma = true
    err.cause = e
    throw err
  }
}
