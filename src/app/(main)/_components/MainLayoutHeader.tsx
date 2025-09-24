import Link from "next/link"
import classNames from "classnames"

import Button from "@/components/ui/Button"
import { Routes } from "@/config/routes"

interface Props {
  className?: string
}

export default function MainLayoutHeader({ className }: Props) {
  return (
    <header
      className={classNames(className, "flex items-center justify-between")}
    >
      <Link href={Routes.home}>
        {/* TODO: add backdrop blur */}
        <h1 className="text-h2 font-extrabold">
          айтиработа
          <span className="text-primary">.рф</span>
        </h1>
      </Link>
      <Button type="glass" link={{ url: Routes.login }}>
        Войти
      </Button>
    </header>
  )
}
