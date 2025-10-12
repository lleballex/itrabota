import { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"

import Button from "@/components/ui/Button"
import HighlightList from "@/components/ui/HighlightList"
import Icon from "@/components/ui/Icon"
import Popover from "@/components/ui/Popover"
import { User, UserRole } from "@/types/entities/user"
import { Routes } from "@/config/routes"
import { getUserName } from "@/lib/get-user-name"
import avatarImg from "@/assets/images/avatar.png"
import { useLogout } from "@/api/auth/logout"

interface Props {
  user: User
}

export default function MainLayoutHeaderUser({ user }: Props) {
  const { mutate: logout } = useLogout()

  const profileLink = useMemo(() => {
    const mapper = {
      [UserRole.Recruiter]: Routes.recruiter.profile,
      [UserRole.Candidate]: Routes.candidate.profile,
    }

    if (user.role in mapper) {
      return mapper[user.role]
    }

    return null
  }, [user])

  const profileName = useMemo(() => {
    return getUserName(user, { format: "surnameFP" })
  }, [user])

  return (
    <Popover.Root position="right">
      <Popover.Trigger>
        <Button className="gap-2 !p-1 !pr-2 font-medium" type="glass">
          <Image
            className="w-[calc(var(--height-control)-var(--spacing)*2)] h-[calc(var(--height-control)-var(--spacing)*2)] rounded-full"
            src={avatarImg}
            alt="alt"
            width={50}
            height={50}
          />
          {profileName && <p>{profileName}</p>}
          <Icon icon="chevronDown" />
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <HighlightList.Root className="flex flex-col text-right">
          {profileLink && (
            <HighlightList.Item>
              <Link className="py-1 px-2" href={profileLink}>
                Профиль
              </Link>
            </HighlightList.Item>
          )}
          <HighlightList.Item>
            <Button
              className="py-1 px-2 text-danger text-right"
              type="base"
              onClick={logout}
            >
              Выйти
            </Button>
          </HighlightList.Item>
        </HighlightList.Root>
      </Popover.Content>
    </Popover.Root>
  )
}
