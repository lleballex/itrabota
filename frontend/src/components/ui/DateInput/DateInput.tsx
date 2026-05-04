"use client"

import classNames from "classnames"
import dayjs from "dayjs"
import { useId, useMemo, useRef, useState } from "react"
import {
  DayFlag,
  DayPicker,
  SelectionState,
  UI,
  type ClassNames,
  type ChevronProps,
} from "react-day-picker"
import { ru } from "react-day-picker/locale"

import Button from "@/components/ui/Button"
import FieldContainer from "@/components/ui/FieldContainer"
import FieldLabel from "@/components/ui/FieldLabel"
import Icon from "@/components/ui/Icon"
import Popover from "@/components/ui/Popover"
import { useFieldValue } from "@/lib/use-field-value"
import { FormError } from "@/types/form-error"

interface Props {
  className?: string
  label?: string
  placeholder?: string
  value?: string | null
  error?: FormError
  maxDate?: string
  onChange?: (value: string | null) => void
}

const DATE_VALUE_RE = /^\d{4}-\d{2}-\d{2}$/

const DateInputChevron = ({
  className,
  disabled,
  orientation,
}: ChevronProps) => {
  const icon = {
    down: "chevronDown",
    left: "chevronLeft",
    right: "chevronRight",
    up: "chevronUp",
  }[orientation ?? "right"] as "chevronDown" | "chevronLeft" | "chevronRight" | "chevronUp"

  return (
    <Icon
      className={classNames(className, {
        "opacity-40": disabled,
      })}
      icon={icon}
    />
  )
}

const dayPickerClassNames: Partial<ClassNames> = {
  [UI.Root]: "p-1 text-fg",
  [UI.Months]: "flex",
  [UI.Month]: "grid grid-cols-[1.5rem_1fr_3rem] items-center gap-y-0.5",
  [UI.MonthCaption]: "col-start-2 row-start-1 flex h-4 items-center justify-center px-2",
  [UI.CaptionLabel]:
    "flex h-4 items-center leading-none text-sm font-medium",
  [UI.PreviousMonthButton]:
    "col-start-1 row-start-1 flex h-4 w-6 cursor-pointer items-center justify-center p-0 text-fg-secondary transition-all hover:text-primary",
  [UI.NextMonthButton]:
    "col-start-3 row-start-1 flex h-4 w-12 cursor-pointer items-center justify-center p-0 pr-6 text-fg-secondary transition-all hover:text-primary",
  [UI.MonthGrid]: "col-span-3 border-separate border-spacing-[2px]",
  [UI.Weekdays]: "text-xs text-fg-secondary",
  [UI.Weekday]: "h-4 w-4 font-normal",
  [UI.Day]: "h-4 w-4 p-0 text-center text-sm",
  [UI.DayButton]:
    "flex h-4 w-4 cursor-pointer items-center justify-center rounded-[6px] border border-transparent bg-transparent transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-fg-heading",
  [DayFlag.outside]: "opacity-40",
  [DayFlag.disabled]:
    "cursor-not-allowed opacity-25 [&>button]:cursor-not-allowed [&>button]:hover:border-transparent [&>button]:hover:bg-transparent",
  [DayFlag.today]: "[&>button]:border-primary/50 [&>button]:text-primary",
  [SelectionState.selected]:
    "[&>button]:border-primary [&>button]:bg-primary/15 [&>button]:text-primary",
}

const parseDateValue = (value?: string | null) => {
  if (!value) {
    return undefined
  }

  const parsed = dayjs(value)

  if (
    !parsed.isValid() ||
    (DATE_VALUE_RE.test(value) && parsed.format("YYYY-MM-DD") !== value)
  ) {
    return undefined
  }

  return parsed.toDate()
}

const formatDateValue = (date: Date) => dayjs(date).format("YYYY-MM-DD")

export default function DateInput({
  className,
  label,
  placeholder,
  value: baseValue,
  error,
  maxDate,
  onChange: baseOnChange,
}: Props) {
  const id = useId()
  const popoverContentRef = useRef<HTMLDivElement>(null)

  const { value, onChange } = useFieldValue<string | null>({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => val || null,
  })

  const selectedDate = useMemo(() => parseDateValue(value), [value])
  const maxDateValue = useMemo(() => parseDateValue(maxDate), [maxDate])
  const [displayedMonth, setDisplayedMonth] = useState(
    selectedDate ?? new Date(),
  )

  const displayValue = selectedDate
    ? dayjs(selectedDate).format("DD.MM.YYYY")
    : null

  const onSelect = (date?: Date) => {
    onChange(date ? formatDateValue(date) : null)
    popoverContentRef.current?.hidePopover()
  }

  const setSelectedMonth = () => {
    if (selectedDate) {
      setDisplayedMonth(selectedDate)
    }
  }

  return (
    <FieldContainer className={className} errorClassName="pl-3" error={error}>
      <Popover.Root position="left">
        <div
          className={classNames("field", {
            "border-danger": error,
          })}
        >
          {label && (
            <FieldLabel className="text-nowrap shrink-0" fieldId={id}>
              {label}
            </FieldLabel>
          )}

          <Popover.Trigger className="grow">
            <Button
              className={classNames(
                "h-full w-full min-w-0 text-left outline-none",
                {
                  "text-fg-secondary": !displayValue,
                },
              )}
              type="base"
              onClick={setSelectedMonth}
            >
              <span className="block truncate">
                {displayValue ?? placeholder ?? ""}
              </span>
            </Button>
          </Popover.Trigger>

          <Icon className="shrink-0 text-fg-secondary" icon="calendar" />
        </div>

        <Popover.Content className="z-50" ref={popoverContentRef}>
          <DayPicker
            captionLayout="label"
            classNames={dayPickerClassNames}
            components={{ Chevron: DateInputChevron }}
            disabled={maxDateValue ? { after: maxDateValue } : undefined}
            locale={ru}
            month={displayedMonth}
            mode="single"
            navLayout="around"
            selected={selectedDate}
            showOutsideDays
            weekStartsOn={1}
            onMonthChange={setDisplayedMonth}
            onSelect={onSelect}
          />
        </Popover.Content>
      </Popover.Root>
    </FieldContainer>
  )
}
