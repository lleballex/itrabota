"use client"

import {
  DatesSetArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core/index.js"
import ruLocale from "@fullcalendar/core/locales/ru"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { useMemo, useRef, useState } from "react"

import { useMeetings } from "@/api/meetings/get-meetings"
import MeetingCalendarEventModal from "@/components/base/meeting/MeetingCalendarEventModal"
import HighlightList from "@/components/ui/HighlightList"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { Meeting } from "@/types/entities/meeting"
import { UserRole } from "@/types/entities/user"

import styles from "./MeetingCalendar.module.css"

interface Props {
  role: UserRole
}

interface VisibleRange {
  from: string
  to: string
}

const CALENDAR_VIEWS = [
  {
    id: "timeGridDay",
    label: "День",
  },
  {
    id: "timeGridWeek",
    label: "Неделя",
  },
  {
    id: "dayGridMonth",
    label: "Месяц",
  },
] as const

type CalendarView = (typeof CALENDAR_VIEWS)[number]["id"]

const formatMonthYear = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  year: "numeric",
})

const formatDayDate = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value

export default function MeetingCalendar({ role }: Props) {
  const calendarRef = useRef<FullCalendar | null>(null)
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null,
  )
  const [currentView, setCurrentView] = useState<CalendarView>("dayGridMonth")
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [visibleRange, setVisibleRange] = useState<VisibleRange | null>(null)

  const meetings = useMeetings(
    {
      role,
      from: visibleRange?.from ?? "",
      to: visibleRange?.to ?? "",
    },
    { isEnabled: Boolean(visibleRange) },
  )

  const meetingMap = useMemo(
    () =>
      (meetings.status === "success" ? meetings.data : []).reduce<
        Map<string, Meeting>
      >((acc, meeting) => {
        acc.set(meeting.id, meeting)
        return acc
      }, new Map()),
    [meetings],
  )

  const selectedMeeting = selectedMeetingId
    ? (meetingMap.get(selectedMeetingId) ?? null)
    : null

  const events = useMemo<EventInput[]>(
    () =>
      meetings.status === "success"
        ? meetings.data.map((meeting) => ({
            id: meeting.id,
            title: meeting.application?.vacancy?.title ?? "Встреча",
            start: meeting.startsAt,
            end: meeting.endsAt,
          }))
        : [],
    [meetings],
  )

  const onDatesSet = (arg: DatesSetArg) => {
    const nextRange = {
      from: arg.start.toISOString(),
      to: arg.end.toISOString(),
    }

    setCurrentDate(arg.view.currentStart)

    setVisibleRange((prev) =>
      prev?.from === nextRange.from && prev.to === nextRange.to
        ? prev
        : nextRange,
    )
  }

  const onEventClick = ({ event }: EventClickArg) => {
    setSelectedMeetingId(event.id)
  }

  const onActiveChange = (nextActive: boolean) => {
    if (!nextActive) {
      setSelectedMeetingId(null)
    }
  }

  const onViewChange = (nextView: CalendarView) => {
    setCurrentView(nextView)
    calendarRef.current?.getApi().changeView(nextView)
  }

  const onPrev = () => {
    calendarRef.current?.getApi().prev()
  }

  const onNext = () => {
    calendarRef.current?.getApi().next()
  }

  const onToday = () => {
    calendarRef.current?.getApi().today()
  }

  const currentTitle =
    currentView === "timeGridDay"
      ? formatDayDate.format(currentDate)
      : capitalize(formatMonthYear.format(currentDate))

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            <Button
              className="w-(--height-control) p-0!"
              type="secondary"
              onClick={onPrev}
            >
              <Icon icon="chevronLeft" />
            </Button>
            <Button type="secondary" onClick={onToday}>
              Сегодня
            </Button>
            <Button
              className="w-(--height-control) p-0!"
              type="secondary"
              onClick={onNext}
            >
              <Icon icon="chevronRight" />
            </Button>
          </div>

          <h4 className="text-h4">{currentTitle}</h4>

          <HighlightList.Root
            className="inline-flex flex-row rounded border border-border p-1 self-start md:self-auto"
            highlightClassName="bg-primary"
          >
            {CALENDAR_VIEWS.map((view) => (
              <HighlightList.Item
                key={view.id}
                className="py-1 px-2 transition-all hover:text-fg-heading"
                active={currentView === view.id}
                activeClassName="text-fg-heading"
              >
                <Button type="base" onClick={() => onViewChange(view.id)}>
                  {view.label}
                </Button>
              </HighlightList.Item>
            ))}
          </HighlightList.Root>
        </div>

        <div
          className={
            currentView === "timeGridWeek"
              ? `${styles.calendar} ${styles.weekView}`
              : styles.calendar
          }
        >
          <FullCalendar
            ref={calendarRef}
            allDaySlot={false}
            datesSet={onDatesSet}
            editable={false}
            eventClick={onEventClick}
            eventDisplay="block"
            eventDurationEditable={false}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            eventStartEditable={false}
            events={events}
            headerToolbar={false}
            height="auto"
            initialView={currentView}
            locale={ruLocale}
            moreLinkText={(count) => `ещё ${count}`}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            selectable={false}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
          />
        </div>
      </div>

      <MeetingCalendarEventModal
        active={Boolean(selectedMeeting)}
        meeting={selectedMeeting}
        onActiveChange={onActiveChange}
        role={role}
      />
    </>
  )
}
