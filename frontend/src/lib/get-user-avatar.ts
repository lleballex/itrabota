import { User, UserRole } from "@/types/entities/user"

import companyPlaceholderImg from "@/assets/images/company-placeholder.png"
import userPlaceholderImg from "@/assets/images/user-placeholder.png"

export const getUserAvatar = (user: User) => {
  const logo = {
    [UserRole.Recruiter]: user.recruiter?.company?.logo,
    [UserRole.Candidate]: user.candidate?.avatar,
  }[user.role]

  if (!logo) {
    return {
      [UserRole.Recruiter]: companyPlaceholderImg,
      [UserRole.Candidate]: userPlaceholderImg,
    }[user.role]
  }

  return process.env.NEXT_PUBLIC_ATTACHMENT_URL.replace(":id", logo.id)
}
