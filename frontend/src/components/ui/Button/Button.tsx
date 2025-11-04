"use client"

import { ReactNode, useMemo } from "react"
import classNames from "classnames"
import Link from "next/link"

interface BaseProps {
  className?: string
  type: "glass" | "primary" | "secondary" | "text" | "base"
  children?: ReactNode
}

interface TrueButtonProps extends BaseProps {
  popoverTarget?: string
  htmlType?: "button" | "submit"
  pending?: boolean
  onClick?: () => void
  link?: never
}

interface LinkProps extends BaseProps {
  popoverTarget?: never
  htmlType?: never
  pending?: never
  onClick?: never
  link: {
    url: string
    target?: "_blank" | "_self" | "_parent" | "_top"
  }
}

export default function Button({
  className,
  type,
  children,
  popoverTarget,
  htmlType,
  pending: isPending,
  onClick,
  link,
}: TrueButtonProps | LinkProps) {
  const style = useMemo(() => {
    return {
      primary:
        "flex items-center justify-center gap-1 h-[var(--height-button)] px-3 rounded-full text-fg-heading font-bold bg-primary transition-all hover:opacity-70",
      secondary:
        "flex items-center justify-center gap-1 h-[var(--height-button)] px-3 rounded-full text-primary font-bold bg-secondary transition-all hover:opacity-70",
      glass:
        "glass flex items-center justify-center gap-1 h-control px-2.5 rounded-full text-fg font-bold transition-all hover:scale-115",
      text: "flex items-center gap-1 text-primary font-bold transition-all hover:opacity-70",
      base: "",
    }[type]
  }, [type])

  if (link) {
    return (
      <Link
        className={classNames(className, style)}
        href={link.url}
        target={link.target}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classNames(className, style, "cursor-pointer")}
      type={htmlType ?? "button"}
      popoverTarget={popoverTarget}
      disabled={isPending}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
