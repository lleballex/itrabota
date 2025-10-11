"use client"

import { Controller, useForm } from "react-hook-form"

import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { Routes } from "@/config/routes"

import { formResolver } from "./form"

export default function LoginPage() {
  const form = useForm({
    resolver: formResolver,
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
  })

  return (
    <form className="contents" onSubmit={onSubmit}>
      <h1 className="text-h2">Вход</h1>

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

      <div className="flex items-center justify-between">
        <Button type="secondary" htmlType="submit">
          Войти
        </Button>
        <Button link={{ url: Routes.register }} type="text">
          Регистрация
        </Button>
      </div>
    </form>
  )
}
