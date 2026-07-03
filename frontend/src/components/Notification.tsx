import React from 'react'

export default function Notification({ error, success }: { error?: string | null; success?: string | null }) {
  if (!error && !success) return null
  return (
    <div className="mt-3">
      {error && <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-700 rounded">{success}</div>}
    </div>
  )
}
