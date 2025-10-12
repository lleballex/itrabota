"use client"

import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { Routes } from "@/config/routes"
import { useLogin } from "@/api/auth/login"

import { formResolver } from "./form"

export default function LoginPage() {
  const router = useRouter()

  const form = useForm({
    resolver: formResolver,
  })

  const { mutate, status } = useLogin()

  const onSubmit = form.handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        router.push(Routes.home)
      },
      onError: (error) => {
        if (error.statusCode === 401) {
          form.setError("password", { message: "INCORRECT_EMAIL_OR_PASSWORD" })
          return true
        }
        return false
      },
    })
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
        <Button
          type="secondary"
          htmlType="submit"
          pending={status === "pending"}
        >
          Войти
        </Button>
        <Button link={{ url: Routes.register }} type="text">
          Регистрация
        </Button>
      </div>
    </form>
  )
}
