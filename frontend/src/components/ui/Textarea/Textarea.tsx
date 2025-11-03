import { FormEventHandler, useEffect, useRef } from "react"
import classNames from "classnames"

import { useFieldValue } from "@/lib/use-field-value"
import { FormError } from "@/types/form-error"
import FieldContainer from "@/components/ui/FieldContainer"
import FieldLabel from "@/components/ui/FieldLabel"

// TODO: add default value

interface Props {
  className?: string
  label?: string
  error?: FormError
  value?: string | null
  onChange?: (val: string | null) => void
}

export default function Textarea({
  className,
  label,
  error,
  value: baseValue,
  onChange: baseOnChange,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const shouldSkipSync = useRef(false)

  const { value, onChange: onChange_ } = useFieldValue({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => val ?? null,
  })

  useEffect(() => {
    if (shouldSkipSync.current) {
      shouldSkipSync.current = false
      return
    }

    if (editorRef.current && editorRef.current.innerText !== value) {
      editorRef.current.innerText = value ?? ""
    }
  }, [value])

  const onChange: FormEventHandler = (e) => {
    shouldSkipSync.current = true
    const val = (e.target as HTMLElement).innerText
    onChange_(val)
  }

  return (
    <FieldContainer className={className} error={error}>
      <div
        className={classNames(
          "field flex-col gap-0.5 items-stretch py-2 h-auto",
          { "border-danger": error }
        )}
      >
        {label && <FieldLabel>{label}</FieldLabel>}
        <div
          className="outline-none"
          ref={editorRef}
          onInput={onChange}
          contentEditable
        />
      </div>
    </FieldContainer>
  )
}
