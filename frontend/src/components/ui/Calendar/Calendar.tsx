"use client"

import classNames from "classnames"
import dayjs, { Dayjs } from "dayjs"
import { useMemo } from "react"

import Button from "@/components/ui/Button"

interface Props {
  activeMonth: Dayjs
  selectedDate: string | null
  weekDays?: string[]
  onActiveMonthChange: (month: Dayjs) => void
  onSelectDate: (date: string) => void
  isDateDisabled?: (date: string) => boolean
}

const CALENDAR_DAYS_COUNT = 42
const DEFAULT_WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

export default function Calendar({
  activeMonth,
  selectedDate,
  weekDays = DEFAULT_WEEK_DAYS,
  onActiveMonthChange,
  onSelectDate,
  isDateDisabled,
}: Props) {
  const calendarDays = useMemo(() => {
    const monthStart = activeMonth.startOf("month")
    const firstWeekday = monthStart.day() === 0 ? 6 : monthStart.day() - 1
    const gridStart = monthStart.subtract(firstWeekday, "day")

    return Array.from({ length: CALENDAR_DAYS_COUNT }, (_, index) =>
      gridStart.add(index, "day"),
    )
  }, [activeMonth])

  return (
    <div className="flex w-fit flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Button
          className="min-w-0 px-2"
          type="secondary"
          onClick={() => onActiveMonthChange(activeMonth.subtract(1, "month"))}
        >
          <span aria-hidden="true">{"<"}</span>
        </Button>
        <p className="min-w-[140px] text-center text-base font-bold">
          {activeMonth.format("MMMM YYYY")}
        </p>
        <Button
          className="min-w-0 px-2"
          type="secondary"
          onClick={() => onActiveMonthChange(activeMonth.add(1, "month"))}
        >
          <span aria-hidden="true">{">"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-fg-secondary">
        {weekDays.map((day) => (
          <p key={day}>{day}</p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const isCurrentMonth = day.isSame(activeMonth, "month")
          const dayString = day.format("YYYY-MM-DD")
          const isSelected = selectedDate === dayString
          const disabled = isDateDisabled?.(dayString) ?? false

          return (
            <button
              key={day.toISOString()}
              className={classNames(
                "flex h-6 w-6 items-center justify-center rounded border text-sm transition-all",
                isSelected
                  ? "border-primary bg-primary text-fg-heading"
                  : "border-border bg-secondary",
                {
                  "opacity-40": !isCurrentMonth,
                  "cursor-not-allowed opacity-25": disabled,
                  "cursor-pointer hover:border-primary hover:text-fg-heading":
                    !disabled,
                },
              )}
              disabled={disabled}
              type="button"
              onClick={() => onSelectDate(dayString)}
            >
              {dayjs(dayString).format("D")}
            </button>
          )
        })}
      </div>
    </div>
  )
}
