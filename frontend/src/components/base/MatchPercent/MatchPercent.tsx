import classNames from "classnames"

interface Props {
  className?: string
  percent: number
}

const getMatchPercentColorClass = (percent: number) => {
  if (percent <= 33) {
    return "border-danger"
  }

  if (percent <= 66) {
    return "border-[#f2c94c]"
  }

  return "border-success"
}

export default function MatchPercent({ className, percent }: Props) {
  const normalizedPercent = Math.max(0, Math.min(100, Math.round(percent)))

  return (
    <div className={classNames(className, "flex items-center gap-1.5")}>
      <span
        className={classNames(
          "block h-2 w-2 rounded-full border-[3px]",
          getMatchPercentColorClass(normalizedPercent),
        )}
      />
      <p>Подходит на {normalizedPercent}%</p>
    </div>
  )
}
