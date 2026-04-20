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
import { useMemo, useState } from "react"

import { useMeetings } from "@/api/meetings/get-meetings"
import MeetingCalendarEventModal from "@/components/base/meeting/MeetingCalendarEventModal"
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

export default function MeetingCalendar({ role }: Props) {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null,
  )
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

  return (
    <>
      <div className="flex flex-col gap-3">
        {meetings.status === "pending" && (
          <p className="text-sm text-fg">Загружаем встречи...</p>
        )}

        {meetings.status === "error" && (
          <p className="text-sm text-danger">{meetings.error.message}</p>
        )}

        {meetings.status === "success" && !meetings.data.length && (
          <p className="text-sm text-fg">В выбранном диапазоне встреч нет.</p>
        )}

        <div className={`${styles.calendar}`}>
          <FullCalendar
            allDaySlot={false}
            buttonText={{
              today: "Сегодня",
              month: "Месяц",
              week: "Неделя",
              day: "День",
            }}
            dayMaxEvents
            datesSet={onDatesSet}
            editable={false}
            eventClick={onEventClick}
            eventDisplay="block"
            eventDurationEditable={false}
            eventStartEditable={false}
            events={events}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="auto"
            initialView="dayGridMonth"
            locale={ruLocale}
            moreLinkText={(count) => `ещё ${count}`}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            selectable={false}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            titleFormat={{
              year: "numeric",
              month: "long",
              day: "numeric",
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
