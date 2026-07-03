import React from 'react'

type FieldDef = {
  tag: string
  id?: string | null
  name?: string | null
  placeholder?: string | null
  type?: string | null
}

export default function Field({ def, label, register, error }: { def: FieldDef; label?: string; register?: any; error?: any }) {
  const id = def.id || def.name || undefined
  const commonProps: any = {
    id,
    name: def.name || undefined,
    placeholder: def.placeholder || undefined,
    className: 'mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500',
  }

  const reg = register && (def.name || def.id) ? register(def.name || def.id) : {}

  return (
    <div className="mb-3">
      {label && id && <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>}

      {def.tag === 'input' && def.type !== 'checkbox' && (
        <input type={def.type || 'text'} {...commonProps} {...reg} />
      )}

      {def.tag === 'input' && def.type === 'checkbox' && (
        <div className="flex items-center">
          <input type="checkbox" {...(register && (def.name || def.id) ? register(def.name || def.id) : {})} id={id} name={def.name || undefined} className="mr-2" />
          {label && <label htmlFor={id} className="text-sm text-gray-700">{label}</label>}
        </div>
      )}

      {def.tag === 'select' && (
        <select {...commonProps} {...reg}>
          <option value="">Select</option>
          <option value="individual">Individual</option>
          <option value="company">Company</option>
        </select>
      )}

      {def.tag === 'textarea' && (
        <textarea {...commonProps} {...reg} />
      )}

      {/* Validation messages placeholder */}
      {error && <div className="mt-1 text-xs text-red-600" role="alert">{String(error.message)}</div>}
    </div>
  )
}
