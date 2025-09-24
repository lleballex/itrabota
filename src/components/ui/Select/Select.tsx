"use client"

import classNames from "classnames"
import { ReactNode, useId, useMemo, useRef } from "react"

import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { useFieldValue } from "@/lib/use-field-value"

import styles from "./Select.module.css"

interface Props<V> {
  label?: string
  items: {
    value: V
    content: ReactNode
  }[]
}

export default function Select<V>({ label, items }: Props<V>) {
  const id = useId()
  const popoverRef = useRef<HTMLDivElement>(null)

  const { value, onChange } = useFieldValue<V | null>({
    baseValue: undefined,
    baseOnChange: undefined,
    transformBaseValue: (val) => val ?? null,
  })

  const valueContent = useMemo(() => {
    const item = items.find((i) => i.value === value)
    return item?.content ?? null
  }, [value, items])

  const selectValue = (val: V) => {
    onChange(val)
    popoverRef.current?.hidePopover()
  }

  return (
    <section className="contents">
      <Button
        className={classNames(
          styles.target,
          "flex justify-between gap-2 h-control px-3 rounded-full bg-secondary text-left transition-all hover:opacity-70" // TODO: extract to utilities, add outline
        )}
        type="base"
        popoverTarget={id}
      >
        {label && <span className="text-sm text-secondary-light">{label}</span>}
        {valueContent && <span className="grow">{valueContent}</span>}
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
              "text-primary": false,
            })}
            key={String(item.value)}
            type="base"
            onClick={() => selectValue(item.value)}
          >
            {item.content}
          </Button>
        ))}

        <span
          className={classNames(
            styles.highlight,
            "bg-[rgba(130,130,130,0.5)] rounded transition-all"
          )}
        />
      </div>
    </section>
  )
}
