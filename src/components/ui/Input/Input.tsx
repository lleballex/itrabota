"use client"

import classNames from "classnames"
import { ChangeEventHandler, useId } from "react"

import { FormError } from "@/types/form-error"
import { useFieldValue } from "@/lib/use-field-value"
import FieldContainer from "@/components/ui/FieldContainer"
import FieldLabel from "@/components/ui/FieldLabel"

// TODO: add correct outline
// TOOD: add active state style
// TODO: focus on container click

interface Props {
  className?: string
  label?: string
  type?: "text" | "password"
  value?: string | null
  error?: FormError
  onChange?: (val: string | null) => void
}

export default function Input({
  className,
  label,
  type,
  value: baseValue,
  error,
  onChange: baseOnChange,
}: Props) {
  const id = useId()

  const { value, onChange: onChange_ } = useFieldValue({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => val || null,
  })

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value || null
    onChange_(val)
  }

  return (
    <FieldContainer className={className} errorClassName="pl-3" error={error}>
      <div
        className={classNames("field", {
          "border-danger": error,
        })}
      >
        {label && <FieldLabel fieldId={id}>{label}</FieldLabel>}
        <input
          className="grow h-full outline-none"
          id={id}
          type={type}
          value={value ?? ""}
          onChange={onChange}
        />
      </div>
    </FieldContainer>
  )
}
