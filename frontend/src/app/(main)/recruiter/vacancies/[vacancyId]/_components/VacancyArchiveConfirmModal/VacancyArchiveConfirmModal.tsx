import { useArchiveVacancy } from "@/api/vacancies/archive-vacancy"
import { useRestoreVacancy } from "@/api/vacancies/restore-vacancy"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import { useToastsStore } from "@/stores/toasts"
import { Vacancy } from "@/types/entities/vacancy"

export type VacancyArchiveAction = "archive" | "restore"

interface Props {
  vacancy: Vacancy
  action: VacancyArchiveAction | null
  active: boolean
  onActiveChange: (val: boolean) => void
}

const CONTENT: Record<
  VacancyArchiveAction,
  {
    title: string
    text: string
    confirmText: string
    successText: string
  }
> = {
  archive: {
    title: "Архивировать вакансию",
    text: "Вакансия больше не будет предлагаться кандидатам. Все активные отклики будут завершены",
    confirmText: "Архивировать",
    successText: "Вакансия архивирована",
  },
  restore: {
    title: "Вернуть вакансию из архива",
    text: "Вакансия станет доступной для кандидатов и новых откликов",
    confirmText: "Вернуть",
    successText: "Вакансия восстановлена из архива",
  },
}

export default function VacancyArchiveConfirmModal({
  vacancy,
  action,
  active,
  onActiveChange,
}: Props) {
  const { addToast } = useToastsStore()
  const { mutate: archiveVacancy, status: archiveStatus } = useArchiveVacancy()
  const { mutate: restoreVacancy, status: restoreStatus } = useRestoreVacancy()

  if (!action) return null

  const content = CONTENT[action]
  const pending =
    action === "archive"
      ? archiveStatus === "pending"
      : restoreStatus === "pending"

  const onSuccess = () => {
    addToast({
      type: "success",
      message: content.successText,
    })
    onActiveChange(false)
  }

  const onConfirm = () => {
    const data = { id: vacancy.id }

    if (action === "archive") {
      archiveVacancy(data, { onSuccess })
    } else {
      restoreVacancy(data, { onSuccess })
    }
  }

  return (
    <Modal.Root active={active} onActiveChange={onActiveChange} width={560}>
      <Modal.Header>{content.title}</Modal.Header>
      <p>{content.text}</p>
      <Modal.Controls>
        <Button type="primary" pending={pending} onClick={onConfirm}>
          {content.confirmText}
        </Button>
        <Button type="secondary" onClick={() => onActiveChange(false)}>
          Отменить
        </Button>
      </Modal.Controls>
    </Modal.Root>
  )
}
