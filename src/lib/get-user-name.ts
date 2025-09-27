import { User } from "@/types/entities/user"

interface Args {
  format: "surnameFP"
}

export const getUserName = (user: User, { format }: Args) => {
  if (!user.profile) {
    return null
  }

  switch (format) {
    case "surnameFP":
      const patronymic = user.profile.patronymic
        ? `${user.profile.patronymic[0]}.`
        : ""
      return `${user.profile.lastName} ${user.profile.firstName[0]}.${patronymic}`
    default:
      throw new Error("Unknown format")
  }
}
