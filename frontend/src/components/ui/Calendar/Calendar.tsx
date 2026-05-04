"use client"

import classNames from "classnames"
import dayjs, { Dayjs } from "dayjs"
import { useMemo } from "react"

import Icon from "@/components/ui/Icon"

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
    <div className="flex w-fit flex-col gap-1.5 text-fg">
      <div className="flex items-center justify-between gap-2">
        <button
          className="flex h-5 w-7 cursor-pointer items-center justify-center p-0 text-fg-secondary transition-all hover:text-primary"
          type="button"
          aria-label="Предыдущий месяц"
          onClick={() => onActiveMonthChange(activeMonth.subtract(1, "month"))}
        >
          <Icon icon="chevronLeft" />
        </button>

        <p className="flex h-5 items-center justify-center text-sm font-medium leading-none">
          {activeMonth.format("MMMM YYYY")}
        </p>

        <button
          className="flex h-5 w-[3.25rem] cursor-pointer items-center justify-center p-0 text-fg-secondary transition-all hover:text-primary"
          type="button"
          aria-label="Следующий месяц"
          onClick={() => onActiveMonthChange(activeMonth.add(1, "month"))}
        >
          <Icon icon="chevronRight" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-fg-secondary">
        {weekDays.map((day) => (
          <p className="w-5 font-normal" key={day}>
            {day}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const isCurrentMonth = day.isSame(activeMonth, "month")
          const dayString = day.format("YYYY-MM-DD")
          const isSelected = selectedDate === dayString
          const isToday = day.isSame(dayjs(), "day")
          const disabled = isDateDisabled?.(dayString) ?? false

          return (
            <button
              key={day.toISOString()}
              className={classNames(
                "flex h-5 w-5 items-center justify-center rounded-[6px] border border-transparent bg-transparent text-sm transition-all",
                {
                  "!border-primary !bg-primary/15 text-primary": isSelected,
                  "hover:border-primary/40 hover:bg-primary/10 hover:text-fg-heading":
                    !isSelected,
                  "opacity-40": !isCurrentMonth && !isSelected,
                  "border-primary/50 text-primary": isToday && !isSelected,
                  "cursor-pointer": !disabled,
                  "cursor-not-allowed opacity-25 hover:border-transparent hover:bg-transparent":
                    disabled && !isSelected,
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
