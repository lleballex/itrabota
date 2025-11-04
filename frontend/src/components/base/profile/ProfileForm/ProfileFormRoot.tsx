import classNames from "classnames"
import { FormEventHandler, ReactNode } from "react"
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form"

interface Props<
  FormInputValues extends FieldValues,
  FormOutputValues extends FieldValues
> {
  className?: string
  form: UseFormReturn<FormInputValues, unknown, FormOutputValues>
  onSubmit?: FormEventHandler<HTMLFormElement>
  children?: ReactNode
}

export default function ProfileFormRoot<
  FormInputValues extends FieldValues,
  FormOutputValues extends FieldValues
>({
  className,
  form,
  onSubmit,
  children,
}: Props<FormInputValues, FormOutputValues>) {
  return (
    <FormProvider {...form}>
      <form
        className={classNames(className, "flex gap-5 relative h-full")}
        onSubmit={onSubmit}
      >
        {children}
      </form>
    </FormProvider>
  )
}
