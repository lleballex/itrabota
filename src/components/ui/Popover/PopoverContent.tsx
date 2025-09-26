"use client"

import {
  CSSProperties,
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useContext,
} from "react"
import classNames from "classnames"

import { popoverContext } from "./context"
import styles from "./Popover.module.css"

interface Props {
  className?: string
  children?: ReactNode
}

const PopoverContent: ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { className, children },
  ref
) => {
  const { id } = useContext(popoverContext)

  return (
    <div
      className={classNames(
        className,
        styles.content,
        "glass p-1 rounded transition-all"
      )}
      style={{ positionAnchor: id } as CSSProperties}
      ref={ref}
      id={id}
      popover="auto"
    >
      {children}
    </div>
  )
}

export default forwardRef(PopoverContent)
