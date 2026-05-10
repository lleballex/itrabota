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
  CircleAlert,
  FilesIcon,
  FileTextIcon,
  GitlabIcon,
  GithubIcon,
  HouseIcon,
  InfoIcon,
  LoaderCircleIcon,
  MailIcon,
  MessageSquare,
  PenIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
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
  circleAlert: {
    Component: CircleAlert,
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
  github: {
    Component: GithubIcon,
  },
  gitlab: {
    Component: GitlabIcon,
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
  mail: {
    Component: MailIcon,
  },
  messageSquare: {
    Component: MessageSquare,
  },
  pen: {
    Component: PenIcon,
  },
  phone: {
    Component: PhoneIcon,
  },
  plus: {
    Component: PlusIcon,
  },
  search: {
    Component: SearchIcon,
  },
  telegram: {
    Component: SendIcon,
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
