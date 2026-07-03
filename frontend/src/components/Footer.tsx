import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t">
      <div className="max-w-3xl mx-auto px-4 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Udyam - Frontend prototype
      </div>
    </footer>
  )
}
