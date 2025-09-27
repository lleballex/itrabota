"use client"

import classNames from "classnames"
import { CSSProperties, ReactNode, useId } from "react"

import { PopoverContext } from "./context"

interface Props {
  className?: string
  children?: ReactNode
}

export default function Popover({ className, children }: Props) {
  const id = useId()

  return (
    <PopoverContext.Provider value={{ id }}>
      <section
        className={classNames(className, "contents")}
        style={{ "--popover-id": `--${id}` } as CSSProperties}
      >
        {children}
      </section>
    </PopoverContext.Provider>
  )
}
