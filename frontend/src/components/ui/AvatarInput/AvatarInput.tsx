"use client"

import classNames from "classnames"
import {
  ChangeEventHandler,
  CSSProperties,
  useId,
  useMemo,
  useRef,
} from "react"
import Image from "next/image"

import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { useFieldValue } from "@/lib/use-field-value"
import userPlaceholderImg from "@/assets/images/user-placeholder.png"
import { FormError } from "@/types/form-error"
import FieldContainer from "@/components/ui/FieldContainer"

import styles from "./AvatarInput.module.css"

type Value =
  | {
      id?: string
      name: string
      mimeType: string
      size: number
      content: string
    }
  | {
      id: string
      name: string
      mimeType: string
      size: number
    }
  | null

interface Props {
  className?: string
  error?: FormError
  value?: Value
  onChange?: (val: Value) => void
}

export default function AvatarInput({
  className,
  error,
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

  const src = useMemo(() => {
    // TODO: improve. for company logo display other placeholder
    if (!value) {
      return userPlaceholderImg
    } else if ("content" in value) {
      return `data:${value.mimeType};base64,${value.content}`
    } else {
      // TODO: remove url from here
      return `http://localhost:8000/api/attachments/${value.id}/content`
    }
  }, [value])

  const onClick = () => {
    inputRef.current?.click()
  }

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      const url = reader.result as ArrayBuffer
      onChange({
        name: file.name,
        mimeType: file.type,
        size: file.size,
        content: Buffer.from(url).toString("base64"),
      })
    }

    reader.readAsArrayBuffer(file)
  }

  return (
    <FieldContainer
      className={classNames(className, "flex flex-col items-center")}
      error={error}
      style={{ "--avatar-input-id": `--${id}` } as CSSProperties}
    >
      <Image
        className={classNames(
          styles.anchor,
          "w-25 h-25 rounded-full border border-transparent transition-all",
          {
            "!border-danger": error,
          }
        )}
        src={src}
        alt="Логотип"
        width={300}
        height={300}
      />

      <Button
        className="-mt-[calc(var(--height-control)/2)]"
        type="glass"
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
    </FieldContainer>
  )
}
