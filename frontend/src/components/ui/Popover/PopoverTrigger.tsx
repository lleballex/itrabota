"use client"

import classNames from "classnames"

import { cloneElement, ReactElement, useMemo } from "react"

import { usePopover } from "./context"
import styles from "./Popover.module.css"

interface Props {
  className?: string
  children: ReactElement<{
    className?: string
    popoverTarget?: string
  }>
}

export default function PopoverTrigger({
  className,
  children: children_,
}: Props) {
  const { id } = usePopover()

  const children = useMemo(() => {
    return cloneElement(children_, {
      className: classNames(
        className,
        children_.props.className,
        styles.trigger
      ),
      popoverTarget: id,
    })
  }, [className, children_, id])

  return children
}
