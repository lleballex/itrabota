import { useEffect, useRef, useState } from "react"
import classNames from "classnames"
import Link from "next/link"

import { useToastsStore } from "@/stores/toasts"
import Icon from "@/components/ui/Icon"
import Button from "@/components/ui/Button"

import styles from "./Toasts.module.css"

const TOAST_DURATION = 10_000
const TOAST_EXIT_DURATION = 220
const TOP_LAYER_OPEN_EVENT = "top-layer-open"

export default function Toasts() {
  const toasts = useToastsStore((state) => state.toasts)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    container.setAttribute("popover", "manual")

    if (!("showPopover" in container) || !("hidePopover" in container)) return

    const syncPopover = () => {
      if (!toasts.length) {
        if (container.matches(":popover-open")) {
          container.hidePopover()
        }

        return
      }

      if (container.matches(":popover-open")) {
        container.hidePopover()
      }

      container.showPopover()
    }

    syncPopover()
    window.addEventListener(TOP_LAYER_OPEN_EVENT, syncPopover)

    return () => {
      window.removeEventListener(TOP_LAYER_OPEN_EVENT, syncPopover)
    }
  }, [toasts.length])

  return (
    <div
      ref={containerRef}
      className="fixed top-auto right-[var(--spacing-screen)] bottom-[var(--spacing-screen)] left-auto z-50 m-0 flex w-50 max-w-[calc(100dvw-var(--spacing-screen)*2)] flex-col items-end gap-2 border-0 bg-transparent p-0 overflow-visible"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: {
    id: string
    message: string
    type: "success" | "danger"
    action?: {
      label: string
      url: string
    }
  }
}

function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useToastsStore((state) => state.removeToast)
  const [isClosing, setIsClosing] = useState(false)

  const closeToast = () => {
    setIsClosing(true)
  }

  useEffect(() => {
    const timer = window.setTimeout(closeToast, TOAST_DURATION)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isClosing) return

    const timer = window.setTimeout(
      () => removeToast(toast.id),
      TOAST_EXIT_DURATION,
    )

    return () => window.clearTimeout(timer)
  }, [isClosing, removeToast, toast.id])

  return (
    <div
      className={classNames(
        styles.toast,
        "glass pointer-events-auto relative flex w-full max-w-50 items-center rounded-full py-2 px-3 pr-10",
        {
          [styles.closing]: isClosing,
          "bg-[rgba(216,50,63,0.14)]": toast.type === "danger",
          "bg-[rgba(62,163,80,0.14)]": toast.type === "success",
        },
      )}
      role={toast.type === "danger" ? "alert" : "status"}
    >
      <div className="min-w-0 flex-1 text-sm font-semibold leading-[1.35] text-fg-heading">
        <span>{toast.message}</span>
        {toast.action && (
          <>
            <span>. </span>
            <Link
              className="font-bold text-primary underline decoration-primary/50 underline-offset-3 transition-all hover:text-fg-heading hover:decoration-fg-heading"
              href={toast.action.url}
              onClick={closeToast}
            >
              {toast.action.label}
            </Link>
          </>
        )}
      </div>

      <Button
        className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-fg transition-all hover:bg-white/10 hover:text-fg-heading"
        type="base"
        onClick={closeToast}
      >
        <Icon className="!text-[16px]" icon="cross" />
      </Button>
    </div>
  )
}
