"use client"

import NotificationsPageContent from "@/components/base/notification/NotificationsPageContent"
import AuthProvider from "@/components/special/AuthProvider"
import { User, UserRole } from "@/types/entities/user"

const Content = ({ me }: { me: User }) => {
  void me

  return <NotificationsPageContent role={UserRole.Recruiter} />
}

export default function RecruiterNotificationsPage() {
  return <AuthProvider roles={[UserRole.Recruiter]} Component={Content} />
}
