"use client"

import { Controller, useForm } from "react-hook-form"
import { useEffect } from "react"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import { Routes } from "@/config/routes"
import { UserRole, UserRoles } from "@/types/entities/user"

import { formResolver } from "./form"

export default function RegisterPage() {
  const form = useForm({
    resolver: formResolver,
  })

  const formPassword = form.watch("password")
  const formPasswordRepeat = form.watch("passwordRepeat")

  useEffect(() => {
    if (form.formState.isSubmitted) {
      form.trigger()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formPassword, formPasswordRepeat])

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
  })

  return (
    <form className="contents" onSubmit={onSubmit}>
      <h1 className="text-h2">Регистрация</h1>

      <Controller
        control={form.control}
        name="role"
        render={({ field, fieldState }) => (
          <Select
            {...field}
            error={fieldState.error}
            label="Кто вы?"
            items={[
              {
                value: UserRole.Candidate,
                content: UserRoles.Candidate,
              },
              {
                value: UserRole.Rucruiter,
                content: UserRoles.Rucruiter,
              },
            ]}
          />
        )}
      />

      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Input {...field} error={fieldState.error} label="Email" />
        )}
      />

      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <Input
            {...field}
            error={fieldState.error}
            label="Пароль"
            type="password"
          />
        )}
      />

      <Controller
        control={form.control}
        name="passwordRepeat"
        render={({ field, fieldState }) => (
          <Input
            {...field}
            error={fieldState.error}
            label="Пароль ещё раз"
            type="password"
          />
        )}
      />

      <div className="flex items-center justify-between">
        <Button type="secondary" htmlType="submit">
          Продолжить
        </Button>
        <Button link={{ url: Routes.login }} type="text">
          Войти
        </Button>
      </div>
    </form>
  )
}
