"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"

import { useNotifications } from "@/api/notifications/get-notifications"
import { useUnreadNotificationsCount } from "@/api/notifications/get-unread-notifications-count"
import { useReadNotifications } from "@/api/notifications/read-notifications"
import NotificationListItem from "@/components/base/notification/NotificationListItem"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import Popover from "@/components/ui/Popover"
import RemoteData from "@/components/ui/RemoteData"
import { isNotificationUnread } from "@/lib/notifications"
import { Routes } from "@/config/routes"
import { User, UserRole } from "@/types/entities/user"

interface Props {
  user: User
}

export default function MainLayoutHeaderNotifications({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const notifications = useNotifications(
    { limit: 10 },
    { isEnabled: isOpen },
  )
  const unreadCount = useUnreadNotificationsCount()
  const { mutate: readNotifications } = useReadNotifications()
  const loadedNotifications =
    notifications.status === "success" ? notifications.data : null

  const notificationsRoute = {
    [UserRole.Recruiter]: Routes.recruiter.notifications,
    [UserRole.Candidate]: Routes.candidate.notifications,
  }[user.role]

  function markNotificationsAsRead(ids: string[]) {
    if (!ids.length) {
      return
    }

    readNotifications(
      { ids },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] })
          queryClient.invalidateQueries({
            queryKey: ["notificationsUnreadCount"],
          })
        },
      },
    )
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

    readNotifications(
      { ids },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] })
          queryClient.invalidateQueries({
            queryKey: ["notificationsUnreadCount"],
          })
        },
      },
    )
  }, [isOpen, loadedNotifications, queryClient, readNotifications])

  return (
    <Popover.Root position="right">
      <Popover.Trigger>
        <Button className="relative !px-2" type="glass">
          <Icon icon="bell" />
          {unreadCount.status === "success" && unreadCount.data.count > 0 && (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-primary px-1 text-center text-xs font-bold text-fg-heading">
              {unreadCount.data.count}
            </span>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        ref={popoverRef}
        className="flex w-[360px] max-w-[calc(100vw-var(--spacing-screen)*2)] flex-col gap-3"
      >
        <div className="flex items-center justify-between gap-2 px-2 pt-1">
          <p className="font-medium text-fg-heading">Уведомления</p>
          <Link className="text-sm text-primary" href={notificationsRoute}>
            Все уведомления
          </Link>
        </div>

        <RemoteData
          data={notifications}
          onSuccess={(notifications) =>
            notifications.length ? (
              <div className="flex max-h-[420px] flex-col gap-2 overflow-auto">
                {notifications.map((notification) => (
                  <NotificationListItem
                    key={notification.id}
                    compact
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
              <p className="px-2 pb-2 text-sm text-[#888]">
                Пока нет уведомлений
              </p>
            )
          }
        />
      </Popover.Content>
    </Popover.Root>
  )
}
