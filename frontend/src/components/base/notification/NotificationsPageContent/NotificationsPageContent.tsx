"use client"

import { useEffect, useRef } from "react"

import { useNotifications } from "@/api/notifications/get-notifications"
import { useReadNotifications } from "@/api/notifications/read-notifications"
import NotificationsList from "@/components/base/notification/NotificationsList"
import RemoteData from "@/components/ui/RemoteData"
import { isNotificationUnread } from "@/lib/notifications"
import { UserRole } from "@/types/entities/user"

interface Props {
  role: UserRole
}

export default function NotificationsPageContent({ role }: Props) {
  const notifications = useNotifications({})
  const { mutate: readNotifications } = useReadNotifications()
  const queuedIdsRef = useRef(new Set<string>())
  const flushTimeoutRef = useRef<number | null>(null)

  function flushReadQueue() {
    const ids = Array.from(queuedIdsRef.current)

    if (!ids.length) {
      return
    }

    queuedIdsRef.current.clear()

    readNotifications({ ids })
  }

  function enqueueRead(ids: string[]) {
    let hasNewIds = false

    ids.forEach((id) => {
      if (queuedIdsRef.current.has(id)) {
        return
      }

      queuedIdsRef.current.add(id)
      hasNewIds = true
    })

    if (!hasNewIds || flushTimeoutRef.current) {
      return
    }

    flushTimeoutRef.current = window.setTimeout(() => {
      flushTimeoutRef.current = null
      flushReadQueue()
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (flushTimeoutRef.current) {
        window.clearTimeout(flushTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h1">Уведомления</h1>

      <RemoteData
        data={notifications}
        onSuccess={(notifications) => {
          if (!notifications.length) {
            return <p>Пока уведомлений нет </p>
          }

          const unreadNotifications = notifications.filter(isNotificationUnread)
          const readItems = notifications.filter(
            (notification) => !isNotificationUnread(notification),
          )

          return (
            <div className="flex flex-col gap-6">
              {unreadNotifications.length > 0 && (
                <section className="flex flex-col gap-2">
                  <h2 className="text-h4">Новые</h2>
                  <NotificationsList
                    notifications={unreadNotifications}
                    role={role}
                    onRead={enqueueRead}
                  />
                </section>
              )}

              {readItems.length > 0 && (
                <section className="flex flex-col gap-2">
                  <h2 className="text-h4">Просмотренные</h2>
                  <NotificationsList
                    notifications={readItems}
                    role={role}
                    onRead={enqueueRead}
                  />
                </section>
              )}
            </div>
          )
        }}
      />
    </div>
  )
}
