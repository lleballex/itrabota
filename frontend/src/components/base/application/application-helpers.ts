import { Application, ApplicationStatus } from "@/types/entities/application"
import { ApplicationMessageType } from "@/types/entities/application-message"

export const isWaitingForCandidateResponse = (application: Application) => {
  if (!application.messages?.length || application.status !== ApplicationStatus.Pending) {
    return false
  }

  const lastMessage =
    application.messages[application.messages.length - 1].type ===
    ApplicationMessageType.UserMessage
      ? application.messages[application.messages.length - 2]
      : application.messages[application.messages.length - 1]

  return (
    lastMessage.type === ApplicationMessageType.RecruiterInvited ||
    lastMessage.type === ApplicationMessageType.RecruiterOfferedStep ||
    lastMessage.type === ApplicationMessageType.RecruiterOfferedJob
  )
}
