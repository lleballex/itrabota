import { Company } from "@/types/entities/company"
import companyPlaceholderImg from "@/assets/images/company-placeholder.png"

export const getCompanyLogo = (company?: Company) => {
  if (company?.logo) {
    return process.env.NEXT_PUBLIC_ATTACHMENT_URL.replace(
      ":id",
      company.logo.id
    )
  }

  return companyPlaceholderImg
}
