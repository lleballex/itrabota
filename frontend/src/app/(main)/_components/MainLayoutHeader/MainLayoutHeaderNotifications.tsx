"use client"

import { useEffect, useRef, useState } from "react"

import { useNotifications } from "@/api/notifications/get-notifications"
import { useUnreadNotificationsCount } from "@/api/notifications/get-unread-notifications-count"
import { useReadNotifications } from "@/api/notifications/read-notifications"
import NotificationListItem from "@/components/base/notification/NotificationListItem"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import Popover from "@/components/ui/Popover"
import RemoteData from "@/components/ui/RemoteData"
import { isNotificationUnread } from "@/lib/notifications"
import { User } from "@/types/entities/user"

interface Props {
  user: User
}

export default function MainLayoutHeaderNotifications({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const notifications = useNotifications({ limit: 10 }, { isEnabled: isOpen })
  const unreadCount = useUnreadNotificationsCount()
  const { mutate: readNotifications } = useReadNotifications()
  const loadedNotifications =
    notifications.status === "success" ? notifications.data : null

  function markNotificationsAsRead(ids: string[]) {
    if (!ids.length) {
      return
    }

    readNotifications({ ids })
  }

  useEffect(() => {
    const node = popoverRef.current

    if (!node) {
      return
    }

    const handleToggle = (event: Event & { newState?: "open" | "closed" }) => {
      setIsOpen(event.newState === "open")
    }

    node.addEventListener("toggle", handleToggle as EventListener)

    return () => {
      node.removeEventListener("toggle", handleToggle as EventListener)
    }
  }, [])

  useEffect(() => {
    if (!loadedNotifications || !isOpen) {
      return
    }

    const ids = loadedNotifications
      .filter(isNotificationUnread)
      .map((notification) => notification.id)

    if (!ids.length) {
      return
    }

    readNotifications({ ids })
  }, [isOpen, loadedNotifications, readNotifications])

  return (
    <Popover.Root position="right">
      <Popover.Trigger>
        <Button className="relative w-(--height-control) !p-0" type="glass">
          <Icon icon="bell" />
          {unreadCount.status === "success" && unreadCount.data.count > 0 && (
            <span className="flex items-center justify-center absolute -right-0.5 -top-0.5 w-2.5 h-2.5 rounded-full bg-primary text-center text-xs font-bold text-fg-heading">
              {unreadCount.data.count}
            </span>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        ref={popoverRef}
        className="flex gap-2 p-2 w-[360px] max-w-[calc(100vw-var(--spacing-screen)*2)] max-h-[400px] overflow-y-auto flex-col py-0"
      >
        <RemoteData
          data={notifications}
          onSuccess={(notifications) =>
            notifications.length ? (
              <div className="flex flex-col">
                {notifications.map((notification, index) => (
                  <NotificationListItem
                    key={notification.id}
                    compact
                    isLast={index === notifications.length - 1}
                    notification={notification}
                    role={user.role}
                    onClick={(notification) => {
                      if (isNotificationUnread(notification)) {
                        markNotificationsAsRead([notification.id])
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-center py-2 text-secondary-light">
                Уведомлений нет
              </p>
            )
          }
        />
      </Popover.Content>
    </Popover.Root>
  )
}
