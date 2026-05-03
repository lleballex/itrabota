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

type SelectValue<V> = V | V[] | null

interface SelectItem<V> {
  value: V
  content: ReactNode
}

interface Props<V> {
  className?: string
  label?: string
  error?: FormError
  value?: SelectValue<V>
  items: {
    value: V
    content: ReactNode
  }[]
  multiple?: boolean
  placeholder?: ReactNode
  renderValue?: (params: {
    isMultiple: boolean
    selectedItems: SelectItem<V>[]
  }) => ReactNode
  onChange?: (val: SelectValue<V>) => void
}

// TODO: add correct outline
// TODO: is it correct to use label inside button and use label without id
// TODO: add pending

export default function Select<V>({
  className,
  label,
  value: baseValue,
  error,
  items,
  multiple = false,
  placeholder,
  renderValue,
  onChange: baseOnChange,
}: Props<V>) {
  const popoverContentRef = useRef<HTMLDivElement>(null)

  const { value, onChange } = useFieldValue<SelectValue<V>>({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => {
      if (multiple) {
        return Array.isArray(val) ? val : []
      }

      if (Array.isArray(val)) {
        return val[0] ?? null
      }

      return val ?? null
    },
  })

  const selectedItems = useMemo(() => {
    if (multiple) {
      if (!Array.isArray(value)) return []

      return items.filter((item) => value.includes(item.value))
    }

    return items.filter((item) => item.value === value)
  }, [items, multiple, value])

  const valueContent = useMemo(() => {
    if (renderValue) {
      return renderValue({ isMultiple: multiple, selectedItems })
    }

    if (!selectedItems.length) {
      return placeholder ?? null
    }

    if (!multiple) {
      return selectedItems[0]?.content ?? placeholder ?? null
    }

    if (selectedItems.every((item) => typeof item.content === "string")) {
      return selectedItems.map((item) => item.content as string).join(", ")
    }

    return `${selectedItems.length} выбрано`
  }, [multiple, placeholder, renderValue, selectedItems])

  const toggleValue = (val: V) => {
    if (multiple) {
      const currentValue = Array.isArray(value) ? value : []

      if (currentValue.includes(val)) {
        onChange(currentValue.filter((item) => item !== val))
      } else {
        onChange([...currentValue, val])
      }

      return
    }

    if (value === val) {
      onChange(null)
    } else {
      onChange(val)
    }
    popoverContentRef.current?.hidePopover()
  }

  return (
    <FieldContainer className={className} errorClassName="pl-3" error={error}>
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
              <span className="grow text-left truncate">{valueContent}</span>
            )}
            <Icon
              className={classNames(
                styles.triggerIndicator,
                "ml-auto transition-all",
              )}
              icon="chevronDown"
            />
          </Button>
        </Popover.Trigger>

        <Popover.Content
          className={classNames(styles.content, "max-h-[300px]")}
          ref={popoverContentRef}
        >
          <HighlightList.Root className="flex flex-col">
            {items.map((item) => (
              <HighlightList.Item
                key={String(item.value)}
                active={
                  multiple
                    ? Array.isArray(value) && value.includes(item.value)
                    : value === item.value
                }
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
