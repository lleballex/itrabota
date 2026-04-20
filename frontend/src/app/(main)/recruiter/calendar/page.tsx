"use client"

import { MeetingCalendar } from "@/components/base/meeting"
import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"

const Content = () => {
  return <MeetingCalendar role={UserRole.Recruiter} />
}

export default function RecruiterCalendarPage() {
  return <AuthProvider roles={[UserRole.Recruiter]} Component={Content} />
}
