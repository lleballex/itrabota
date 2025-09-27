"use client"

import classNames from "classnames"
import { CSSProperties, ReactNode, useId } from "react"

import { PopoverContext } from "./context"

interface Props {
  className?: string
  position?: "center" | "left" | "right"
  children?: ReactNode
}

export default function Popover({
  className,
  position = "center",
  children,
}: Props) {
  const id = useId()

  return (
    <PopoverContext.Provider value={{ id }}>
      <section
        className={classNames(className, "contents")}
        style={{ "--popover-id": `--${id}` } as CSSProperties}
        data-popover-position={position}
      >
        {children}
      </section>
    </PopoverContext.Provider>
  )
}
