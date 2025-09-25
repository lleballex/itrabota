import classNames from "classnames"
import { ReactNode } from "react"

interface Props {
  className?: string
  fieldId?: string // TODO: id must be required
  children?: ReactNode
}

export default function FieldLabel({ className, fieldId, children }: Props) {
  return (
    <label
      className={classNames(className, "text-sm text-secondary-light")}
      htmlFor={fieldId}
    >
      {children}
    </label>
  )
}
