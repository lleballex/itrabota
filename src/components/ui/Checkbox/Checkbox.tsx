import { ReactNode } from "react"
import classNames from "classnames"

import { useFieldValue } from "@/lib/use-field-value"
import Icon from "@/components/ui/Icon"
import { FormError } from "@/types/form-error"
import FieldContainer from "@/components/ui/FieldContainer"

interface Props {
  className?: string
  error?: FormError
  value?: boolean
  onChange?: (val: boolean) => void
  children?: ReactNode
}

export default function Checkbox({
  className,
  error,
  value: baseValue,
  onChange: baseOnChange,
  children,
}: Props) {
  const { value, onChange } = useFieldValue({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => val ?? false,
  })

  return (
    <FieldContainer className={className} error={error}>
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => onChange(!value)}
      >
        <div
          className={classNames(
            "flex items-center justify-center w-3.5 h-3.5 border border-border rounded-[8px] transition-all",
            {
              "border-danger": error,
            }
          )}
        >
          {value && <Icon icon="check" />}
        </div>
        {children}
      </div>
    </FieldContainer>
  )
}
