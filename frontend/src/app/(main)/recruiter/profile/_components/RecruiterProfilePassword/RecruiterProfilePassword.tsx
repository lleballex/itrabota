import dayjs from "dayjs"

import Button from "@/components/ui/Button"
import { User } from "@/types/entities/user"

interface Props {
  me: User
}

export default function RecruiterProfilePassword({ me }: Props) {
  return (
    <div className="flex justify-between items-end">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-h3">Пароль</h2>
        <p>
          {me.passwordChangedAt
            ? `Изменен ${dayjs(me.passwordChangedAt).format("DD.MM.YYYY")}`
            : "Не менялся"}
        </p>
      </div>
      <Button type="secondary">Изменить пароль</Button>
    </div>
  )
}
