import classNames from "classnames"
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  BellIcon,
  CalendarDaysIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  FilesIcon,
  FileTextIcon,
  HouseIcon,
  InfoIcon,
  LoaderCircleIcon,
  MessageSquare,
  PenIcon,
  PlusIcon,
  SearchIcon,
  Settings2Icon,
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
  bell: {
    Component: BellIcon,
  },
  calendar: {
    Component: CalendarDaysIcon,
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
  fileText: {
    Component: FileTextIcon,
  },
  house: {
    Component: HouseIcon,
  },
  info: {
    Component: InfoIcon,
  },
  loader: {
    Component: LoaderCircleIcon,
  },
  messageSquare: {
    Component: MessageSquare,
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
  settings: {
    Component: Settings2Icon,
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
        "w-[1em] h-[1em] text-[20px] stroke-current",
      )}
    />
  )
}
