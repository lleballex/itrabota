"use client"

import { CSSProperties, ReactNode } from "react"
import classNames from "classnames"

import { FormError } from "@/types/form-error"
import { useFormError } from "@/lib/use-form-error"
import MountTransition from "@/components/ui/MountTransition"

interface Props {
  className?: string
  error?: FormError
  children?: ReactNode
}

export default function FieldContainer({
  className,
  error: baseError,
  children,
}: Props) {
  const error = useFormError(baseError)

  return (
    <section
      className={classNames(className, "flex flex-col gap-0.5")}
      style={{ "--mt-gap-block": "0.5" } as CSSProperties}
    >
      {children}
      <MountTransition>
        {error && (
          <span className="pl-3 text-sm text-danger">{error.message}</span>
        )}
      </MountTransition>
    </section>
  )
}
