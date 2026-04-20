"use client"

import { useEffect, useRef } from "react"

import NotificationListItem from "@/components/base/notification/NotificationListItem"
import { isNotificationUnread } from "@/lib/notifications"
import { Notification } from "@/types/entities/notification"
import { UserRole } from "@/types/entities/user"

interface Props {
  notifications: Notification[]
  role: UserRole
  onRead?: (ids: string[]) => void
}

interface ObservedItemProps {
  notification: Notification
  role: UserRole
  onRead?: (ids: string[]) => void
}

function ObservedNotificationListItem({
  notification,
  role,
  onRead,
}: ObservedItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hasBeenReadRef = useRef(false)

  useEffect(() => {
    if (!onRead || !ref.current || !isNotificationUnread(notification)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (!entry?.isIntersecting || hasBeenReadRef.current) {
          return
        }

        hasBeenReadRef.current = true
        onRead([notification.id])
        observer.disconnect()
      },
      {
        threshold: 0.6,
      },
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [notification, onRead])

  return (
    <div ref={ref}>
      <NotificationListItem
        notification={notification}
        role={role}
        onClick={(notification) => {
          if (isNotificationUnread(notification)) {
            onRead?.([notification.id])
          }
        }}
      />
    </div>
  )
}

export default function NotificationsList({
  notifications,
  role,
  onRead,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      {notifications.map((notification) => (
        <ObservedNotificationListItem
          key={notification.id}
          notification={notification}
          role={role}
          onRead={onRead}
        />
      ))}
    </div>
  )
}
