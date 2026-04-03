"use client"

import { cloneElement, ReactElement, useMemo } from "react"
import classNames from "classnames"

import styles from "./HighlightList.module.css"

interface Props {
  className?: string
  activeClassName?: string
  active?: boolean
  children: ReactElement<{ className?: string }>
}

export default function HighlightListItem({
  className,
  activeClassName,
  active: isActive,
  children: children_,
}: Props) {
  const children = useMemo(() => {
    return cloneElement(children_, {
      className: classNames(className, children_.props.className, styles.item, {
        [styles.active]: isActive,
        [activeClassName || ""]: isActive,
      }),
    })
  }, [children_, className, activeClassName, isActive])

  return children
}
