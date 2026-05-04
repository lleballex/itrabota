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
  if (notification.type === NotificationType.VacancyArchived) {
    return null
  }

  if (role === UserRole.Recruiter) {
    return Routes.recruiter.application(notification.application!.id)
  }

  return Routes.candidate.vacancy(notification.application!.vacancy!.id, {
    tab: "application",
  })
}

function getCandidateName(notification: Notification) {
  const candidate = notification.application?.candidate

  return [candidate?.firstName, candidate?.lastName].filter(Boolean).join(" ")
}

function getCompanyName(notification: Notification) {
  return notification.application?.vacancy?.recruiter?.company?.name
}

export function getNotificationContent(notification: Notification) {
  const vacancyTitle = notification.application?.vacancy?.title
  const funnelStepName = notification.application?.funnelStep?.name
  const candidateName = getCandidateName(notification)
  const companyName = getCompanyName(notification)

  switch (notification.type) {
    case NotificationType.CandidateResponded:
      if (candidateName && vacancyTitle) {
        return `${candidateName} откликнулся на вакансию «${vacancyTitle}»`
      }

      if (candidateName) {
        return `${candidateName} откликнулся на вашу вакансию`
      }

      return vacancyTitle
        ? `Поступил отклик на вакансию «${vacancyTitle}»`
        : "Поступил новый отклик на вакансию"
    case NotificationType.RecruiterInvited:
      if (companyName && vacancyTitle) {
        return `Компания ${companyName} пригласила вас на вакансию «${vacancyTitle}»`
      }

      if (companyName) {
        return `Компания ${companyName} пригласила вас на вакансию`
      }

      return vacancyTitle
        ? `Вас пригласили на вакансию «${vacancyTitle}»`
        : "Вас пригласили на вакансию"
    case NotificationType.CandidateAccepted:
      if (candidateName && vacancyTitle) {
        return `${candidateName} принял приглашение на вакансию «${vacancyTitle}»`
      }

      if (candidateName) {
        return `${candidateName} принял приглашение`
      }

      return vacancyTitle
        ? `Кандидат принял приглашение на вакансию «${vacancyTitle}»`
        : "Кандидат принял приглашение"
    case NotificationType.RecruiterOfferedStep:
      if (notification.application?.funnelStep?.shouldCreateCall) {
        if (companyName && funnelStepName) {
          return `Компания ${companyName} предложила выбрать время встречи для этапа «${funnelStepName}»`
        }

        if (companyName) {
          return `Компания ${companyName} предложила выбрать время встречи`
        }

        return funnelStepName
          ? `Рекрутер пригласил вас выбрать время встречи для этапа «${funnelStepName}»`
          : "Рекрутер пригласил вас выбрать время встречи"
      }

      if (companyName && funnelStepName) {
        return `Компания ${companyName} пригласила вас на этап «${funnelStepName}»`
      }

      if (companyName) {
        return `Компания ${companyName} пригласила вас на следующий этап`
      }

      return funnelStepName
        ? `Рекрутер пригласил вас на этап «${funnelStepName}»`
        : "Рекрутер пригласил вас на следующий этап"
    case NotificationType.RecruiterOfferedJob:
      if (companyName && vacancyTitle) {
        return `Компания ${companyName} отправила вам оффер по вакансии «${vacancyTitle}»`
      }

      if (companyName) {
        return `Компания ${companyName} отправила вам оффер`
      }

      return vacancyTitle
        ? `Рекрутер отправил вам оффер по вакансии «${vacancyTitle}»`
        : "Рекрутер отправил вам оффер"
    case NotificationType.CandidateRejected:
      if (candidateName && vacancyTitle) {
        return `${candidateName} отклонил процесс по вакансии «${vacancyTitle}»`
      }

      if (candidateName) {
        return `${candidateName} отклонил процесс найма`
      }

      return vacancyTitle
        ? `Кандидат отклонил процесс по вакансии «${vacancyTitle}»`
        : "Кандидат отклонил процесс найма"
    case NotificationType.RecruiterRejected:
      if (companyName && vacancyTitle) {
        return `Компания ${companyName} отклонила процесс по вакансии «${vacancyTitle}»`
      }

      if (companyName) {
        return `Компания ${companyName} отклонила процесс найма`
      }

      return vacancyTitle
        ? `Рекрутер отклонил процесс по вакансии «${vacancyTitle}»`
        : "Рекрутер отклонил процесс найма"
    case NotificationType.VacancyArchived:
      if (companyName && vacancyTitle) {
        return `Компания ${companyName} архивировала вакансию «${vacancyTitle}», отклик завершен`
      }

      if (companyName) {
        return `Компания ${companyName} архивировала вакансию, отклик завершен`
      }

      return vacancyTitle
        ? `Вакансия «${vacancyTitle}» архивирована, отклик завершен`
        : "Вакансия архивирована, отклик завершен"
    case NotificationType.MeetingScheduled:
      if (candidateName && notification.meeting?.startsAt) {
        return `${candidateName} назначил встречу на ${formatMeetingDateTime(
          notification.meeting.startsAt,
        )}`
      }

      if (notification.meeting?.startsAt) {
        return `Кандидат назначил встречу на ${formatMeetingDateTime(
          notification.meeting.startsAt,
        )}`
      }

      return "Кандидат назначил встречу"
  }
}
