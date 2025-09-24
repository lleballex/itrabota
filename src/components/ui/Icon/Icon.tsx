import classNames from "classnames"
import { ChevronDownIcon, FilesIcon, HouseIcon, UsersIcon } from "lucide-react"

const ICONS = {
  chevronDown: {
    Component: ChevronDownIcon,
  },
  files: {
    Component: FilesIcon,
  },
  house: {
    Component: HouseIcon,
  },
  users: {
    Component: UsersIcon,
  },
}

interface Props {
  className?: string
  icon: keyof typeof ICONS
}

export default function Icon({ className, icon: iconName }: Props) {
  const icon = ICONS[iconName]

  return (
    <icon.Component
      className={classNames(
        className,
        "w-[1em] h-[1em] text-[24px] stroke-current"
      )}
    />
  )
}
