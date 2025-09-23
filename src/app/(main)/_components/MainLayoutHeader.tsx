import Button from "@/components/ui/Button"
import { Routes } from "@/config/routes"

export default function MainLayoutHeader() {
  return (
    <header className="flex items-center justify-end sticky top-2">
      <Button type="glass" link={{ url: Routes.login }}>
        Войти
      </Button>
    </header>
  )
}
