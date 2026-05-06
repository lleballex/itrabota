"use client"

import classNames from "classnames"
import { ReactNode, useEffect, useRef } from "react"

import { DrawerContext } from "./context"
import styles from "./Drawer.module.css"

interface Props {
  className?: string
  active: boolean
  onActiveChange: (val: boolean) => void
  children?: ReactNode
}

export default function DrawerRoot({
  className,
  active: isActive,
  onActiveChange: onIsActiveChange,
  children,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!dialogRef.current) return

    if (isActive && !dialogRef.current.open) {
      dialogRef.current.showModal()
      window.dispatchEvent(new CustomEvent("top-layer-open"))
    } else if (!isActive && dialogRef.current.open) {
      dialogRef.current.close()
    }
  }, [isActive])

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    const onClose = (e: Event) => {
      e.preventDefault()
      onIsActiveChange(false)
    }

    dialog.addEventListener("cancel", onClose)
    dialog.addEventListener("close", onClose)

    return () => {
      dialog.removeEventListener("cancel", onClose)
      dialog.removeEventListener("close", onClose)
    }
  }, [onIsActiveChange])

  return (
    <DrawerContext.Provider value={{ onIsActiveChange }}>
      <dialog
        ref={dialogRef}
        className={classNames(className, styles.root, "transition-all")}
        role="dialog"
      >
        <div className="flex h-full flex-col gap-4 border-l border-border bg-bg px-4 py-4">
          {children}
        </div>
      </dialog>
    </DrawerContext.Provider>
  )
}
