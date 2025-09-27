"use client"

import classNames from "classnames"
import { ChangeEventHandler, CSSProperties, useId, useRef } from "react"
import Image from "next/image"

import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { useFieldValue } from "@/lib/use-field-value"
import avatarImg from "@/assets/images/avatar.png"

import styles from "./AvatarInput.module.css"

interface Props {
  className?: string
  value?: string | null
  onChange?: (val: string | null) => void
}

export default function AvatarInput({
  className,
  value: baseValue,
  onChange: baseOnChange,
}: Props) {
  const id = useId()

  const inputRef = useRef<HTMLInputElement>(null)

  const { value, onChange } = useFieldValue({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => val || null,
  })

  const onClick = () => {
    inputRef.current?.click()
  }

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      const url = reader.result as string
      onChange(url)
    }

    reader.readAsDataURL(file)
  }

  return (
    <section
      className={classNames(className, "contents")}
      style={{ "--avatar-input-id": `--${id}` } as CSSProperties}
    >
      <Image
        className={classNames(styles.anchor, "w-25 h-25")}
        src={value ?? avatarImg}
        alt="Логотип"
        width={300}
        height={300}
      />

      <Button
        className={classNames(
          styles.absolute,
          "p-1.5 rounded-full bg-secondary transition-all hover:scale-115"
        )}
        type="base"
        onClick={onClick}
      >
        <Icon icon="pen" />
      </Button>

      <input
        className="hidden"
        ref={inputRef}
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        onInput={onFileChange}
      />
    </section>
  )
}
