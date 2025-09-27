"use client"

import classNames from "classnames"
import { ReactNode, useMemo, useRef } from "react"

import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { useFieldValue } from "@/lib/use-field-value"
import { FormError } from "@/types/form-error"
import FieldContainer from "@/components/ui/FieldContainer"
import FieldLabel from "@/components/ui/FieldLabel"
import Popover from "@/components/ui/Popover"
import HighlightList from "@/components/ui/HighlightList"

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
  const popoverContentRef = useRef<HTMLDivElement>(null)

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
    popoverContentRef.current?.hidePopover()
  }

  return (
    <FieldContainer className={className} error={error}>
      <Popover.Root>
        <Popover.Trigger className={styles.trigger}>
          <Button
            className={classNames("field justify-between hover:opacity-70", {
              "border-danger": error,
            })}
            type="base"
          >
            {label && <FieldLabel>{label}</FieldLabel>}
            {valueContent && (
              <span className="grow text-left">{valueContent}</span>
            )}
            <Icon
              className={classNames(styles.triggerIndicator, "transition-all")}
              icon="chevronDown"
            />
          </Button>
        </Popover.Trigger>

        <Popover.Content className={styles.content} ref={popoverContentRef}>
          <HighlightList.Root className="flex flex-col">
            {items.map((item) => (
              <HighlightList.Item
                key={String(item.value)}
                active={value === item.value}
              >
                <Button
                  className="py-1 px-2"
                  type="base"
                  onClick={() => toggleValue(item.value)}
                >
                  {item.content}
                </Button>
              </HighlightList.Item>
            ))}
          </HighlightList.Root>
        </Popover.Content>
      </Popover.Root>
    </FieldContainer>
  )
}
