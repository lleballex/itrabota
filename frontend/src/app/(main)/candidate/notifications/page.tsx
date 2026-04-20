"use client"

import NotificationsPageContent from "@/components/base/notification/NotificationsPageContent"
import AuthProvider from "@/components/special/AuthProvider"
import { User, UserRole } from "@/types/entities/user"

const Content = ({ me }: { me: User }) => {
  void me

  return <NotificationsPageContent role={UserRole.Candidate} />
}

export default function CandidateNotificationsPage() {
  return <AuthProvider roles={[UserRole.Candidate]} Component={Content} />
}
