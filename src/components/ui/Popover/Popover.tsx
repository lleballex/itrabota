"use client"

import classNames from "classnames"
import { ReactNode, useId } from "react"

import { popoverContext } from "./context"

interface Props {
  className?: string
  children?: ReactNode
}

export default function Popover({ className, children }: Props) {
  const id = useId()

  return (
    <section className={classNames(className, "contents")}>
      <popoverContext.Provider value={{ id }}>
        {children}
      </popoverContext.Provider>
    </section>
  )
}
