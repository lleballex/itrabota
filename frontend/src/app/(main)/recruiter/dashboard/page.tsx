"use client"

import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"

import RecruiterDashboardContent from "./_components/RecruiterDashboardContent"

export default function RecruiterDashboardPage() {
  return (
    <AuthProvider
      Component={RecruiterDashboardContent}
      roles={[UserRole.Recruiter]}
    />
  )
}
