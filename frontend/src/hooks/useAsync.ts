import { useState } from 'react'

export default function useAsync() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run<T>(fn: () => Promise<T>) {
    setLoading(true)
    setError(null)
    try {
      const res = await fn()
      setLoading(false)
      return res
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || 'Unknown error'
      setError(String(msg))
      setLoading(false)
      throw e
    }
  }

  return { loading, error, setError, run }
}
