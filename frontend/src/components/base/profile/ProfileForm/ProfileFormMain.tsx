import { ReactNode } from "react"
import classNames from "classnames"

import Button from "@/components/ui/Button"

import ProfileFormPassword from "./ProfileFormPassword"
import ProfileFormBlockSeparator from "./ProfileFormBlockSeparator"

interface Props {
  className?: string
  pending?: boolean
  children?: ReactNode
}

export default function ProfileFormMain({
  className,
  pending: isPending,
  children,
}: Props) {
  return (
    <div className={classNames(className, "flex flex-col gap-5 grow")}>
      {children}
      <ProfileFormBlockSeparator />
      <ProfileFormPassword />
      <Button
        className="self-center mt-auto sticky bottom-3"
        type="glass"
        htmlType="submit"
        pending={isPending}
      >
        Сохранить данные
      </Button>
    </div>
  )
}
