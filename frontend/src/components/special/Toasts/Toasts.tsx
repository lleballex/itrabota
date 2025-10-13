import classNames from "classnames"

import { useToastsStore } from "@/stores/toasts"
import Icon from "@/components/ui/Icon"
import Button from "@/components/ui/Button"

export default function Toasts() {
  const { toasts, removeToast } = useToastsStore()

  return (
    <div className="flex flex-col gap-[var(--spacing-screen)] fixed bottom-[var(--spacing-screen)] left-1/2 translate-x-[-50%] z-10">
      {toasts.map((toast) => (
        <div
          className={classNames("glass relative w-45 p-2 rounded text-center", {
            "bg-[rgba(216,50,63,0.08)]": toast.type === "danger", // TODO: move to config?
            "bg-[rgba(62,163,80,0.08)]": toast.type === "success", // TODO: move to config?
          })}
          key={toast.id}
        >
          <div>{toast.message}</div>
          <Button
            className="glass absolute p-0.5 -top-[6px] -left-[6px] rounded-full"
            type="base"
            onClick={() => removeToast(toast.id)}
          >
            <Icon className="!text-[14px]" icon="cross" />
          </Button>
        </div>
      ))}
    </div>
  )
}
