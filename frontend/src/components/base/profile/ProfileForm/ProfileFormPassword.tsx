import dayjs from "dayjs"

import Button from "@/components/ui/Button"
import { useMe } from "@/api/auth/get-me"
import ProfileFormBlock from "./ProfileFormBlock"

export default function ProfileFormPassword() {
  const me = useMe()

  if (me.status !== "success") return null

  return (
    <div className="flex justify-between items-end">
      <ProfileFormBlock title="Пароль">
        <p>
          {me.data.passwordChangedAt
            ? `Изменен ${dayjs(me.data.passwordChangedAt).format("DD.MM.YYYY")}`
            : "Не менялся"}
        </p>
      </ProfileFormBlock>
      <Button type="secondary">Изменить пароль</Button>
    </div>
  )
}
