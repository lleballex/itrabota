"use client"

import classNames from "classnames"
import { ReactNode, useEffect, useState } from "react"

interface Props {
  className?: string
  children?: ReactNode
}

export default function MountTransition({ className, children }: Props) {
  const [isActive, setIsActive] = useState(false)
  const [mountedChildren, setMountedChildren] = useState(children)

  useEffect(() => {
    if (children) {
      setMountedChildren(children)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsActive(true))
      })
    } else {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsActive(false))
      })
    }
  }, [children])

  const onTransitionEnd = () => {
    if (!isActive) {
      setMountedChildren(null)
    }
  }

  if (!mountedChildren) return null

  return (
    <div
      className={classNames(
        className,
        "grid grid-rows-[0fr] opacity-0 transition-all",
        {
          "grid-rows-[1fr] opacity-100": isActive,
          "my-[calc(-0.5*var(--mt-gap-block)*var(--spacing))] mx-[calc(-0.5*var(--mt-gap-inline)*var(--spacing))]":
            !isActive,
        }
      )}
      onTransitionEnd={onTransitionEnd}
    >
      <div className="overflow-hidden">{mountedChildren}</div>
    </div>
  )
}
