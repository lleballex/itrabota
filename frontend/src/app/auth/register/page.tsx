"use client"

import { Controller, FieldPath, useForm } from "react-hook-form"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import { Routes } from "@/config/routes"
import { UserRole } from "@/types/entities/user"
import { useRegister } from "@/api/auth/register"

import { formResolver } from "./form"
import { handleFormApiError } from "@/lib/handle-form-api-error"

export default function RegisterPage() {
  const router = useRouter()

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

  const { mutate, status } = useRegister()

  const onSubmit = form.handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        router.push(Routes.home)
      },
      onError: (error) => handleFormApiError({ error, form }),
    })
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
            label="Что вы хотите?"
            items={[
              {
                value: UserRole.Candidate,
                content: "Найти работу",
              },
              {
                value: UserRole.Recruiter,
                content: "Найти сотрудников",
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
        <Button
          type="secondary"
          htmlType="submit"
          pending={status === "pending"}
        >
          Продолжить
        </Button>
        <Button link={{ url: Routes.login }} type="text">
          Войти
        </Button>
      </div>
    </form>
  )
}
