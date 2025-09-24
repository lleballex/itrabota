import classNames from "classnames"
import { useId } from "react"

import { FormError } from "@/types/form-error"

interface Props {
  className?: string
  label?: string
  error?: FormError
}

export default function Input({ className, label, error }: Props) {
  const id = useId()

  // TODO: focus on container click

  return (
    <section className={classNames(className, "flex flex-col gap-0.5")}>
      <div
        className={classNames(
          "flex gap-2 h-control px-3 bg-secondary rounded-full",
          {
            "border-1 border-danger":
              error /* TODO: move border-width to config */,
          }
        )}
      >
        {label && (
          <label
            className="self-center text-sm text-secondary-light"
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <input className="grow outline-none" id={id} />
        {/* /* TODO: add outline */}
      </div>
      {error && <p className="pl-3 text-sm text-danger">{error}</p>}
    </section>
  )
}
