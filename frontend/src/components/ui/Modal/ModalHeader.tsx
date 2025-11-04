"use client"

import classNames from "classnames"
import { ReactNode } from "react"

import Icon from "@/components/ui/Icon"

import { useModal } from "./context"
import Button from "../Button"

interface Props {
  className?: string
  children?: ReactNode
}

export default function ModalHeader({ className, children }: Props) {
  const { onIsActiveChange } = useModal()

  return (
    <div
      className={classNames(
        "flex items-center justify-between gap-2",
        className
      )}
    >
      <h2 className="text-h2">{children}</h2>
      <Button type="base" onClick={() => onIsActiveChange(false)}>
        {/* TODO: move values to config */}
        <Icon className="text-[24px]" icon="cross" />
      </Button>
    </div>
  )
}
