"use client"

import VacancyForm from "@/components/base/vacancy/VacancyForm"
import AuthProvider from "@/components/special/AuthProvider"
import { UserRole } from "@/types/entities/user"

const Content = () => {
  return <VacancyForm />
}

export default function RecruiterNewVacancyPage() {
  return <AuthProvider roles={[UserRole.Recruiter]} Component={Content} />
}
