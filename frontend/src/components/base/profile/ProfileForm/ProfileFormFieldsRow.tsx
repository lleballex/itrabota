import classNames from "classnames"
import { ReactNode } from "react"

interface Props {
  className?: string
  children?: ReactNode
}

export default function ProfileFormFieldsRow({ className, children }: Props) {
  return <div className={classNames(className, "flex gap-2")}>{children}</div>
}
