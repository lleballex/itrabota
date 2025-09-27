"use client"

import classNames from "classnames"
import { CSSProperties, ReactNode, useId } from "react"

import styles from "./HighlightList.module.css"

interface Props {
  className?: string
  highlightClassName?: string
  children?: ReactNode
}

export default function HighlightListRoot({
  className,
  highlightClassName,
  children,
}: Props) {
  const id = useId()

  return (
    <div
      className={classNames(className, styles.container)}
      style={{ "--highlight-list-id": `--${id}` } as CSSProperties}
    >
      {children}
      <span
        className={classNames(
          highlightClassName,
          styles.highlight,
          "bg-[rgba(130,130,130,0.5)] rounded transition-all" // TODO: move color to config
        )}
      />
    </div>
  )
}
