"use client"

import classNames from "classnames"
import { ReactNode, useId, useMemo, useRef } from "react"

import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { useFieldValue } from "@/lib/use-field-value"
import { FormError } from "@/types/form-error"
import FieldContainer from "@/components/ui/FieldContainer"
import FieldLabel from "@/components/ui/FieldLabel"

import styles from "./Select.module.css"

interface Props<V> {
  className?: string
  label?: string
  error?: FormError
  value?: V | null
  items: {
    value: V
    content: ReactNode
  }[]
  onChange?: (val: V | null) => void
}

// TODO: add correct outline
// TODO: is it correct to use label inside button and use label without id

export default function Select<V>({
  className,
  label,
  value: baseValue,
  error,
  items,
  onChange: baseOnChange,
}: Props<V>) {
  const id = useId()
  const popoverRef = useRef<HTMLDivElement>(null)

  const { value, onChange } = useFieldValue({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => val ?? null,
  })

  const valueContent = useMemo(() => {
    const item = items.find((i) => i.value === value)
    return item?.content ?? null
  }, [value, items])

  const toggleValue = (val: V | null) => {
    if (value === val) {
      onChange(null)
    } else {
      onChange(val)
    }
    popoverRef.current?.hidePopover()
  }

  return (
    <FieldContainer className={className} error={error}>
      <Button
        className={classNames(
          styles.target,
          "field justify-between hover:opacity-70",
          {
            "border-danger": error,
          }
        )}
        type="base"
        popoverTarget={id}
      >
        {label && <FieldLabel>{label}</FieldLabel>}
        {valueContent && <span className="grow text-left">{valueContent}</span>}
        <Icon
          className={classNames(styles.targetIndicator, "transition-all")}
          icon="chevronDown"
        />
      </Button>

      <div
        id={id}
        ref={popoverRef}
        popover="auto"
        className={classNames(
          styles.popover,
          "glass p-1 rounded transition-all"
        )}
      >
        {items.map((item) => (
          <Button
            className={classNames(styles.item, "py-1 px-2", {
              [styles.active]: item.value === value,
            })}
            key={String(item.value)}
            type="base"
            onClick={() => toggleValue(item.value)}
          >
            {item.content}
          </Button>
        ))}
        <span
          className={classNames(
            styles.highlight,
            "bg-[rgba(130,130,130,0.5)] rounded transition-all" // TODO: move color to config
          )}
        />
      </div>
    </FieldContainer>
  )
}
