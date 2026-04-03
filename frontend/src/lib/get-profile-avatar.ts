import { UserRole } from "@/types/entities/user"
import companyPlaceholderImg from "@/assets/images/company-placeholder.png"
import userPlaceholderImg from "@/assets/images/user-placeholder.png"
import { Recruiter } from "@/types/entities/recruiter"
import { Candidate } from "@/types/entities/candidate"

interface Args {
  profile: Recruiter | Candidate
  role: UserRole
}

export const getProfileAvatar = ({ profile, role }: Args) => {
  const logo = {
    [UserRole.Recruiter]: (profile as Recruiter).company?.logo,
    [UserRole.Candidate]: (profile as Candidate).avatar,
  }[role]

  if (!logo) {
    return {
      [UserRole.Recruiter]: companyPlaceholderImg,
      [UserRole.Candidate]: userPlaceholderImg,
    }[role]
  }

  return process.env.NEXT_PUBLIC_ATTACHMENT_URL.replace(":id", logo.id)
}
