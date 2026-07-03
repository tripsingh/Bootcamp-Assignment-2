import axios from 'axios'

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })

export async function validateAadhaar(payload: { aadhaar: string; entrepreneurName?: string }) {
  return (await api.post('/validate-aadhaar', payload)).data
}

export async function verifyOtp(payload: { aadhaar: string; otp: string }) {
  return (await api.post('/verify-otp', payload)).data
}

export async function validatePan(payload: { aadhaar: string; pan: string; panType?: string }) {
  return (await api.post('/validate-pan', payload)).data
}

export async function submitRegistration(payload: { aadhaar: string }) {
  return (await api.post('/submit', payload)).data
}

export default api
