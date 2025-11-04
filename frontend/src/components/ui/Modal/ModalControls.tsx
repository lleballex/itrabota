"use client"

import classNames from "classnames"
import { ReactNode } from "react"

interface Props {
  className?: string
  children?: ReactNode
}

export default function ModalControls({ className, children }: Props) {
  return (
    <div
      className={classNames("flex items-center gap-2 [&>*]:w-full", className)}
    >
      {children}
    </div>
  )
}
