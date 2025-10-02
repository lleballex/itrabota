import classNames from "classnames"
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  ChevronDownIcon,
  FilesIcon,
  HouseIcon,
  LoaderCircleIcon,
  PenIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react"

const ICONS = {
  archive: {
    Component: ArchiveIcon,
  },
  archiveRestore: {
    Component: ArchiveRestoreIcon,
  },
  chevronDown: {
    Component: ChevronDownIcon,
  },
  files: {
    Component: FilesIcon,
  },
  house: {
    Component: HouseIcon,
  },
  loader: {
    Component: LoaderCircleIcon,
  },
  pen: {
    Component: PenIcon,
  },
  plus: {
    Component: PlusIcon,
  },
  search: {
    Component: SearchIcon,
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
        "w-[1em] h-[1em] text-[18px] stroke-current"
      )}
    />
  )
}
