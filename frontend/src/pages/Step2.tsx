import React from 'react'
import { Link } from 'react-router-dom'

export default function Step2() {
  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Step 2: OTP & PAN</h2>
        <Link to="/step1" className="text-sm text-blue-600">Back</Link>
      </div>

      <p className="text-sm text-gray-500 mt-1">Enter the OTP received and provide PAN details. This is a UI placeholder — no backend calls.</p>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
          <input id="otp" className="mt-1 block w-full rounded border-gray-300 shadow-sm" placeholder="Enter OTP" />
        </div>

        <div>
          <label htmlFor="pan" className="block text-sm font-medium text-gray-700">PAN Number</label>
          <input id="pan" className="mt-1 block w-full rounded border-gray-300 shadow-sm" placeholder="Enter PAN Number" />
        </div>

        <div>
          <label htmlFor="panType" className="block text-sm font-medium text-gray-700">PAN Type</label>
          <select id="panType" className="mt-1 block w-full rounded border-gray-300 shadow-sm">
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </select>
        </div>

        <div className="flex items-center">
          <input id="declaration" type="checkbox" className="mr-2" />
          <label htmlFor="declaration" className="text-sm text-gray-700">I hereby declare that the information provided is true.</label>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Validate PAN</button>
          <button className="px-4 py-2 bg-white border rounded text-gray-700">Save & Continue Later</button>
        </div>
      </div>
    </section>
  )
}
