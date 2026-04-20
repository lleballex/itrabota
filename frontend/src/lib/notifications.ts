import { Routes } from "@/config/routes"
import { formatMeetingDateTime } from "@/lib/meeting"
import { Notification, NotificationType } from "@/types/entities/notification"
import { UserRole } from "@/types/entities/user"

export function isNotificationUnread(notification: Notification) {
  return !notification.readAt
}

export function getNotificationUrl(
  notification: Notification,
  role: UserRole,
) {
  if (role === UserRole.Recruiter) {
    return Routes.recruiter.application(notification.application!.id)
  }

  return Routes.candidate.vacancy(notification.application!.vacancy!.id, {
    tab: "application",
  })
}

export function getNotificationContent(notification: Notification) {
  const vacancyTitle = notification.application?.vacancy?.title
  const funnelStepName = notification.application?.funnelStep?.name

  switch (notification.type) {
    case NotificationType.CandidateResponded:
      return vacancyTitle
        ? `Новый отклик на вакансию «${vacancyTitle}»`
        : "Поступил новый отклик на вакансию"
    case NotificationType.RecruiterInvited:
      return vacancyTitle
        ? `Вас пригласили на вакансию «${vacancyTitle}»`
        : "Вас пригласили на вакансию"
    case NotificationType.CandidateAccepted:
      return vacancyTitle
        ? `Кандидат принял приглашение на вакансию «${vacancyTitle}»`
        : "Кандидат принял приглашение"
    case NotificationType.RecruiterOfferedStep:
      if (notification.application?.funnelStep?.shouldCreateCall) {
        return funnelStepName
          ? `Рекрутер пригласил вас выбрать время встречи для этапа «${funnelStepName}»`
          : "Рекрутер пригласил вас выбрать время встречи"
      }

      return funnelStepName
        ? `Рекрутер пригласил вас на этап «${funnelStepName}»`
        : "Рекрутер пригласил вас на следующий этап"
    case NotificationType.RecruiterOfferedJob:
      return vacancyTitle
        ? `Рекрутер отправил вам оффер по вакансии «${vacancyTitle}»`
        : "Рекрутер отправил вам оффер"
    case NotificationType.CandidateRejected:
      return vacancyTitle
        ? `Кандидат отклонил процесс по вакансии «${vacancyTitle}»`
        : "Кандидат отклонил процесс найма"
    case NotificationType.RecruiterRejected:
      return vacancyTitle
        ? `Рекрутер отклонил процесс по вакансии «${vacancyTitle}»`
        : "Рекрутер отклонил процесс найма"
    case NotificationType.MeetingScheduled:
      if (notification.meeting?.startsAt) {
        return `Кандидат назначил встречу на ${formatMeetingDateTime(
          notification.meeting.startsAt,
        )}`
      }

      return "Кандидат назначил встречу"
  }
}
