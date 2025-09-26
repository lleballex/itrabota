"use client"

import classNames from "classnames"

import {
  cloneElement,
  CSSProperties,
  ReactElement,
  useContext,
  useMemo,
} from "react"

import { popoverContext } from "./context"
import styles from "./Popover.module.css"

interface Props {
  className?: string
  children: ReactElement<{
    className?: string
    style?: CSSProperties
    popoverTarget?: string
  }>
}

export default function PopoverTrigger({
  className,
  children: children_,
}: Props) {
  const { id } = useContext(popoverContext)

  const children = useMemo(() => {
    return cloneElement(children_, {
      className: classNames(
        className,
        children_.props.className,
        styles.trigger
      ),
      style: { anchorName: id } as CSSProperties,
      popoverTarget: id,
    })
  }, [className, children_, id])

  return children
}
