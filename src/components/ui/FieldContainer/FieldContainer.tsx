"use client"

import { CSSProperties, ReactNode } from "react"
import classNames from "classnames"

import { FormError } from "@/types/form-error"
import { useFormError } from "@/lib/use-form-error"
import MountTransition from "@/components/ui/MountTransition"

interface Props {
  className?: string
  errorClassName?: string
  error?: FormError
  style?: CSSProperties
  children?: ReactNode
}

export default function FieldContainer({
  className,
  errorClassName,
  error: baseError,
  style,
  children,
}: Props) {
  const error = useFormError(baseError)

  return (
    <section
      className={classNames(className, "flex flex-col gap-0.5")}
      style={{ ...style, "--mt-gap-block": "0.5" } as CSSProperties}
    >
      {children}
      <MountTransition>
        {error && (
          <span className={classNames(errorClassName, "text-sm text-danger")}>
            {error.message}
          </span>
        )}
      </MountTransition>
    </section>
  )
}
