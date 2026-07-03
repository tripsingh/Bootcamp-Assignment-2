import React from 'react'
import Field from './Field'

type StepSchema = {
  labels: Array<{ text: string; htmlFor?: string | null }>
  inputs: Array<{ tag: string; id?: string | null; name?: string | null; placeholder?: string | null; type?: string | null }>
  buttons?: Array<{ tag: string; text?: string | null; id?: string | null; name?: string | null; type?: string | null }>
}

function findLabel(labels: StepSchema['labels'], id?: string | null) {
  if (!id) return undefined
  const found = labels.find(l => l.htmlFor === id)
  return found ? found.text : undefined
}

export default function FormRenderer({ schema, register, errors, onButton }: { schema: StepSchema; register?: any; errors?: any; onButton?: (btnId?: string | null) => void }) {
  return (
    <div className="space-y-4">
      {schema.inputs.map((inp) => (
        <Field key={inp.id || inp.name || Math.random()} def={inp} label={findLabel(schema.labels, inp.id)} register={register} error={errors && errors[inp.name || inp.id]} />
      ))}

      <div className="flex items-center gap-3 mt-2">
        {(schema.buttons || []).map(btn => (
          <button key={btn.id || btn.text} type={btn.type === 'submit' ? 'submit' : 'button'} id={btn.id || undefined} onClick={() => onButton && onButton(btn.id)} className="px-4 py-2 bg-blue-600 text-white rounded">{btn.text}</button>
        ))}
      </div>
    </div>
  )
}
