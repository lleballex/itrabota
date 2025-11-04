import classNames from "classnames"
import { ReactNode } from "react"

interface Props {
  className?: string
  title: string
  children?: ReactNode
}

export default function ProfileFormBlock({
  className,
  title,
  children,
}: Props) {
  return (
    <section className={classNames(className, "flex flex-col gap-2.5")}>
      <h2 className="text-h3">{title}</h2>
      {children}
    </section>
  )
}
