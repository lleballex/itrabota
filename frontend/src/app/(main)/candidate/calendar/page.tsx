"use client"

import { MeetingCalendar } from "@/components/base/meeting"
import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"

const Content = () => {
  return <MeetingCalendar role={UserRole.Candidate} />
}

export default function CandidateCalendarPage() {
  return <AuthProvider roles={[UserRole.Candidate]} Component={Content} />
}
