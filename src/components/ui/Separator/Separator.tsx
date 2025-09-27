import classNames from "classnames"

interface Props {
  className?: string
  type: "horizontal" | "vertical"
}

export default function Separator({ className, type }: Props) {
  return (
    <span
      className={classNames(className, "bg-border", {
        "h-[1px] w-full": type === "horizontal",
        "w-[1px] h-full": type === "vertical",
      })}
    />
  )
}
