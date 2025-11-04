"use client"

import classNames from "classnames"
import { ReactNode, useEffect, useRef } from "react"

import { ModalContext } from "./context"
import styles from "./Modal.module.css"

interface Props {
  className?: string
  width?: number
  active: boolean
  onActiveChange: (val: boolean) => void
  children?: ReactNode
}

export default function ModalRoot({
  className,
  width,
  active: isActive,
  onActiveChange: onIsActiveChange,
  children,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!dialogRef.current) return

    if (isActive && !dialogRef.current.open) {
      dialogRef.current.showModal()
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
      dialog.removeEventListener("cl", onClose)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ModalContext.Provider value={{ onIsActiveChange }}>
      <dialog
        ref={dialogRef}
        className={classNames(
          className,
          styles.root,
          "transition-all max-w-[90dvw] max-h-[90dvh]"
        )}
        role="dialog"
        style={{ width: width }}
      >
        {/* TODO: move values to config */}
        <div className="glass flex flex-col gap-3 p-6 rounded backdrop-blur-[15px] bg-[rgba(0,0,0,0.5)]">
          {children}
        </div>
      </dialog>
    </ModalContext.Provider>
  )
}
