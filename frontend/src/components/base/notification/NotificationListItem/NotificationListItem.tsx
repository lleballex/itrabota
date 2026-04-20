"use client"

import classNames from "classnames"
import dayjs from "dayjs"
import Link from "next/link"

import {
  getNotificationContent,
  getNotificationUrl,
  isNotificationUnread,
} from "@/lib/notifications"
import { Notification } from "@/types/entities/notification"
import { UserRole } from "@/types/entities/user"

interface Props {
  className?: string
  compact?: boolean
  notification: Notification
  role: UserRole
  onClick?: (notification: Notification) => void
}

function getNotificationCreatedAt(createdAt: string) {
  if (dayjs(createdAt).isSame(dayjs(), "day")) {
    return dayjs(createdAt).format("HH:mm")
  }

  return dayjs(createdAt).format("D MMMM HH:mm")
}

export default function NotificationListItem({
  className,
  compact,
  notification,
  role,
  onClick,
}: Props) {
  const isUnread = isNotificationUnread(notification)

  return (
    <Link
      className={classNames(
        className,
        "flex flex-col gap-1 rounded border px-3 py-2 transition-all hover:border-primary hover:bg-secondary",
        {
          "bg-secondary border-primary": isUnread,
          "border-border": !isUnread,
          "px-2 py-1.5": compact,
        },
      )}
      href={getNotificationUrl(notification, role)}
      onClick={() => onClick?.(notification)}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={classNames("text-sm", {
            "text-fg-heading font-medium": isUnread,
          })}
        >
          {getNotificationContent(notification)}
        </p>
        {isUnread && (
          <span className="mt-1 h-2.5 min-w-2.5 rounded-full bg-primary" />
        )}
      </div>
      <p className="text-xs text-[#888]">
        {getNotificationCreatedAt(notification.createdAt)}
      </p>
    </Link>
  )
}
