import classNames from "classnames"
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  FilesIcon,
  HouseIcon,
  LoaderCircleIcon,
  PenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"

const ICONS = {
  archive: {
    Component: ArchiveIcon,
  },
  archiveRestore: {
    Component: ArchiveRestoreIcon,
  },
  check: {
    Component: CheckIcon,
  },
  chevronDown: {
    Component: ChevronDownIcon,
  },
  chevronLeft: {
    Component: ChevronLeftIcon,
  },
  chevronRight: {
    Component: ChevronRightIcon,
  },
  chevronUp: {
    Component: ChevronUpIcon,
  },
  cross: {
    Component: XIcon,
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
  trash: {
    Component: TrashIcon,
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
        "w-[1em] h-[1em] text-[20px] stroke-current"
      )}
    />
  )
}
