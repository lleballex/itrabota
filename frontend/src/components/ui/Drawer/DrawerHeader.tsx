"use client"

import classNames from "classnames"
import { ReactNode } from "react"

import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"

import { useDrawer } from "./context"

interface Props {
  className?: string
  children?: ReactNode
}

export default function DrawerHeader({ className, children }: Props) {
  const { onIsActiveChange } = useDrawer()

  return (
    <div
      className={classNames(
        className,
        "flex items-center justify-between gap-3 border-b border-border pb-3"
      )}
    >
      <h2 className="text-h3">{children}</h2>
      <Button type="base" onClick={() => onIsActiveChange(false)}>
        <Icon className="text-[24px]" icon="cross" />
      </Button>
    </div>
  )
}
