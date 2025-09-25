import { ReactNode } from "react"

interface Props {
  children?: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="flex items-center justify-center grow">
      <div className="flex flex-col gap-3 w-[550px] border-1 border-border rounded p-5">
        {children}
      </div>
    </div>
  )
}
