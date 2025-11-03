import { User, UserRole } from "@/types/entities/user"

interface Args {
  format: "surnameFP"
}

export const getUserName = (user: User, { format }: Args) => {
  const profile = {
    [UserRole.Candidate]: user.candidate,
    [UserRole.Recruiter]: user.recruiter,
  }[user.role]

  if (!profile) {
    return null
  }

  switch (format) {
    case "surnameFP":
      const patronymic = profile.patronymic ? `${profile.patronymic[0]}.` : ""
      return `${profile.lastName} ${profile.firstName[0]}.${patronymic}`
    default:
      throw new Error("Unknown format")
  }
}
