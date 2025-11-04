interface Props {
  label: string
  content: string
}

export default function VacancyDetailedItem({ label, content }: Props) {
  return (
    <div className="flex flex-col gap-1.5 p-3 w-full rounded bg-secondary">
      <p className="text-h6">{label}</p>
      <p>{content}</p>
    </div>
  )
}
