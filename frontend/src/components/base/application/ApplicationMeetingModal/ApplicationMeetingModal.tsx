"use client"

import classNames from "classnames"
import dayjs from "dayjs"
import { useEffect, useMemo, useState } from "react"

import { useMeetingSlots } from "@/api/meetings/get-meeting-slots"
import { useAcceptApplicationByCandidate } from "@/api/applications/accept-application-by-candidate"
import { Application } from "@/types/entities/application"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import Calendar from "@/components/ui/Calendar"
import { formatMeetingTimeRange, MEETING_TIMEZONE } from "@/lib/meeting"

interface Props {
  application: Application
  active: boolean
  onActiveChange: (val: boolean) => void
}

export default function ApplicationMeetingModal({
  application,
  active,
  onActiveChange,
}: Props) {
  const [activeMonth, setActiveMonth] = useState(() => dayjs().startOf("month"))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const todayInMoscow = useMemo(
    () => dayjs().tz(MEETING_TIMEZONE).startOf("day"),
    [],
  )

  const slots = useMeetingSlots(
    {
      applicationId: application.id,
      date: selectedDate,
      refreshKey,
    },
    { isEnabled: Boolean(selectedDate) },
  )

  const {
    mutate: acceptApplicationByCandidate,
    status: acceptApplicationByCandidateStatus,
  } = useAcceptApplicationByCandidate()

  useEffect(() => {
    if (!active) {
      setFormError(null)
      setSelectedSlot(null)
      setSelectedDate(null)
      setRefreshKey(0)
    }
  }, [active])

  const onSelectDate = (date: string) => {
    setFormError(null)
    setSelectedSlot(null)
    setSelectedDate(date)
  }

  const isDateDisabled = (date: string) =>
    dayjs.tz(date, MEETING_TIMEZONE).isBefore(todayInMoscow, "day")

  const onSubmit = () => {
    if (!selectedSlot) {
      setFormError("Выберите свободный слот")
      return
    }

    acceptApplicationByCandidate(
      {
        applicationId: application.id,
        meetingStartsAt: selectedSlot,
      },
      {
        onSuccess: () => {
          setFormError(null)
          setSelectedSlot(null)
          setSelectedDate(null)
          onActiveChange(false)
        },
        onError: (error) => {
          if (error.statusCode === 409) {
            setFormError(error.message)
            setRefreshKey((key) => key + 1)
            return true
          }

          return false
        },
      },
    )
  }

  return (
    <Modal.Root active={active} onActiveChange={onActiveChange} width={600}>
      <Modal.Header>Выберите время встречи</Modal.Header>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-3 self-center">
          <Calendar
            activeMonth={activeMonth}
            selectedDate={selectedDate}
            onActiveMonthChange={setActiveMonth}
            onSelectDate={onSelectDate}
            isDateDisabled={isDateDisabled}
          />
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <p className="text-lg font-bold">Свободные слоты</p>

          {!selectedDate && <p>Выберите день в календаре</p>}

          {selectedDate && slots.status === "pending" && (
            <p>Загружаем свободные слоты...</p>
          )}

          {selectedDate && slots.status === "error" && (
            <p className="text-danger">{slots.error.message}</p>
          )}

          {selectedDate && slots.status === "success" && !slots.data.length && (
            <p>На этот день свободных слотов нет</p>
          )}

          {selectedDate &&
            slots.status === "success" &&
            Boolean(slots.data.length) && (
              <div className="flex flex-wrap gap-1">
                {slots.data.map((slot) => (
                  <button
                    key={slot.startsAt}
                    className={classNames(
                      "w-fit cursor-pointer rounded border px-1.5 py-1 text-xs transition-all",
                      selectedSlot === slot.startsAt
                        ? "border-primary bg-primary text-fg-heading"
                        : "border-border bg-secondary hover:border-primary hover:text-fg-heading",
                    )}
                    type="button"
                    onClick={() => {
                      setFormError(null)
                      setSelectedSlot(slot.startsAt)
                    }}
                  >
                    {formatMeetingTimeRange(slot.startsAt, slot.endsAt)}
                  </button>
                ))}
              </div>
            )}

          {formError && <p className="text-danger">{formError}</p>}
        </div>
      </div>

      <Modal.Controls>
        <Button
          type="primary"
          pending={acceptApplicationByCandidateStatus === "pending"}
          onClick={onSubmit}
        >
          Подтвердить
        </Button>
        <Button type="secondary" onClick={() => onActiveChange(false)}>
          Отменить
        </Button>
      </Modal.Controls>
    </Modal.Root>
  )
}
