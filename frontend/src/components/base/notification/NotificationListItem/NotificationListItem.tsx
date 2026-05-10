"use client"

import classNames from "classnames"
import dayjs from "dayjs"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { getCompanyLogo } from "@/lib/get-company-logo"
import { getProfileAvatar } from "@/lib/get-profile-avatar"
import {
  getNotificationContent,
  getNotificationUrl,
  isNotificationUnread,
} from "@/lib/notifications"
import { Notification, NotificationType } from "@/types/entities/notification"
import { UserRole } from "@/types/entities/user"

interface Props {
  className?: string
  compact?: boolean
  isLast?: boolean
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

function getNotificationAvatar(notification: Notification, role: UserRole) {
  if (role === UserRole.Recruiter && notification.application?.candidate) {
    return getProfileAvatar({
      profile: notification.application.candidate,
      role: UserRole.Candidate,
    })
  }

  return getCompanyLogo(notification.application?.vacancy?.recruiter?.company)
}

export default function NotificationListItem({
  className,
  compact,
  isLast,
  notification,
  role,
  onClick,
}: Props) {
  const router = useRouter()
  const isUnread = isNotificationUnread(notification)
  const url = getNotificationUrl(notification, role)
  const baseContent = getNotificationContent(notification)
  const shouldShowMeetingLinkState =
    notification.type === NotificationType.MeetingScheduled &&
    Boolean(notification.meeting)
  const meetingLink = notification.meeting?.link

  const notificationContent = (
    <>
      {baseContent}
      {shouldShowMeetingLinkState &&
        (meetingLink ? (
          <>
            . Ссылка на встречу:{" "}
            <a
              className="break-all text-primary underline transition hover:opacity-70"
              href={meetingLink}
              rel="noreferrer"
              target="_blank"
              onClick={(event) => event.stopPropagation()}
            >
              {meetingLink}
            </a>
          </>
        ) : (
          ". Ссылку на встречу создать не удалось"
        ))}
    </>
  )
  const content = compact ? (
    <div
      className={classNames("flex flex-col gap-0.5 border-border py-2", {
        "border-b": !isLast,
      })}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={classNames("text-sm group-hover:font-bold", {
            "text-fg-heading font-bold": isUnread,
          })}
        >
          {notificationContent}
        </p>
        {isUnread && (
          <span className="mt-1 h-2.5 min-w-2.5 rounded-full bg-primary" />
        )}
      </div>
      <p className="text-xs text-[#888]">
        {getNotificationCreatedAt(notification.createdAt)}
      </p>
    </div>
  ) : (
    <>
      <Image
        className="h-8 w-8 shrink-0 rounded-full object-contain"
        src={getNotificationAvatar(notification, role)}
        width={180}
        height={180}
        alt=""
      />

      <div
        className={classNames(
          "flex min-h-[calc(var(--spacing)*11)] grow gap-4 justify-between items-center border-border pb-3",
          {
            "border-b": !isLast,
          },
        )}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-4 text-sm text-secondary-light">
            <p>{getNotificationCreatedAt(notification.createdAt)}</p>
          </div>

          <p
            className={classNames("leading-snug", {
              "font-medium text-fg-heading": isUnread,
            })}
          >
            {notificationContent}
          </p>
        </div>

        {isUnread && (
          <span className="mt-1 h-1.25 w-1.25 rounded-full bg-primary" />
        )}
      </div>
    </>
  )

  const rootClassName = compact
    ? classNames(className, "group flex flex-col")
    : classNames(
        className,
        "group relative flex gap-4 pt-3 after:absolute after:top-0 after:right-[calc(var(--spacing-content)*-1)] after:bottom-0 after:left-[calc(var(--spacing-content)*-1)] after:-z-1 after:bg-[rgba(20,20,20)] after:opacity-0 after:transition-all hover:after:opacity-100",
      )

  const handleClick = () => {
    onClick?.(notification)

    if (url) {
      router.push(url)
    }
  }

  return (
    <div
      className={rootClassName}
      role={url ? "link" : "button"}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          handleClick()
        }
      }}
    >
      {content}
    </div>
  )
}
