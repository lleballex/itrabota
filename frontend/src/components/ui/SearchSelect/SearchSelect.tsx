"use client"

import classNames from "classnames"
import {
  ChangeEventHandler,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react"

import Button from "@/components/ui/Button"
import FieldContainer from "@/components/ui/FieldContainer"
import FieldLabel from "@/components/ui/FieldLabel"
import HighlightList from "@/components/ui/HighlightList"
import Icon from "@/components/ui/Icon"
import Popover from "@/components/ui/Popover"
import { useFieldValue } from "@/lib/use-field-value"
import { FormError } from "@/types/form-error"

import styles from "./SearchSelect.module.css"

type SearchSelectValue<V> = V | V[] | null

interface SearchSelectItem<V> {
  value: V
  content: ReactNode
  searchValue?: string
}

interface Props<V> {
  className?: string
  label?: string
  error?: FormError
  value?: SearchSelectValue<V>
  items: SearchSelectItem<V>[]
  multiple?: boolean
  placeholder?: ReactNode
  searchPlaceholder?: string
  emptyContent?: ReactNode
  renderValue?: (params: {
    isMultiple: boolean
    selectedItems: SearchSelectItem<V>[]
  }) => ReactNode
  onChange?: (val: SearchSelectValue<V>) => void
}

export default function SearchSelect<V>({
  className,
  label,
  value: baseValue,
  error,
  items,
  multiple = false,
  placeholder,
  searchPlaceholder = "Поиск",
  emptyContent = "Ничего не найдено",
  renderValue,
  onChange: baseOnChange,
}: Props<V>) {
  const popoverContentRef = useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = useState("")

  const { value, onChange } = useFieldValue<SearchSelectValue<V>>({
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

  const filteredItems = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase()

    if (!normalizedSearchValue) return items

    return items.filter((item) => {
      const itemSearchValue =
        item.searchValue ??
        (typeof item.content === "string" ? item.content : String(item.value))

      return itemSearchValue.toLowerCase().includes(normalizedSearchValue)
    })
  }, [items, searchValue])

  const valueContent = useMemo(() => {
    if (multiple) {
      return null
    }

    if (renderValue) {
      return renderValue({ isMultiple: multiple, selectedItems })
    }

    if (!selectedItems.length) {
      return placeholder ?? null
    }

    return selectedItems[0]?.content ?? placeholder ?? null
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

    setSearchValue("")
    popoverContentRef.current?.hidePopover()
  }

  const removeValue = (val: V) => {
    if (!Array.isArray(value)) return

    onChange(value.filter((item) => item !== val))
  }

  const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchValue(e.target.value)
  }

  return (
    <FieldContainer className={className} errorClassName="pl-3" error={error}>
      <Popover.Root>
        <Popover.Trigger className={styles.trigger}>
          <Button
            className={classNames(
              "field justify-between hover:opacity-70",
              {
                "border-danger": error,
              },
            )}
            type="base"
          >
            {label && <FieldLabel>{label}</FieldLabel>}
            <span className="flex grow items-center gap-1.5 overflow-hidden text-left">
              {multiple ? (
                selectedItems.length ? (
                  <span className="flex min-w-0 gap-1 overflow-hidden">
                    {selectedItems.map((item) => (
                      <span
                        key={String(item.value)}
                        className="inline-flex max-w-[160px] shrink-0 rounded border border-border px-1 py-0.5 text-xs transition-colors hover:bg-border"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          removeValue(item.value)
                        }}
                      >
                        <span className="truncate">{item.content}</span>
                      </span>
                    ))}
                  </span>
                ) : (
                  placeholder && (
                    <span className="truncate text-fg">{placeholder}</span>
                  )
                )
              ) : (
                valueContent && (
                  <span className="grow truncate text-left">{valueContent}</span>
                )
              )}
            </span>
            <Icon
              className={classNames(
                styles.triggerIndicator,
                "ml-auto shrink-0 transition-all",
              )}
              icon="chevronDown"
            />
          </Button>
        </Popover.Trigger>

        <Popover.Content
          className={classNames(
            styles.content,
            "max-h-[320px] min-w-[220px] overflow-hidden",
          )}
          ref={popoverContentRef}
        >
          <div className="field mb-1 px-2">
            <Icon className="shrink-0 text-fg" icon="search" />
            <input
              className="min-w-0 grow outline-none"
              placeholder={searchPlaceholder}
              value={searchValue}
              autoFocus
              onChange={onSearchChange}
            />
            {searchValue && (
              <Button
                className="flex shrink-0 items-center justify-center text-fg transition-all hover:opacity-70"
                type="base"
                onClick={() => setSearchValue("")}
              >
                <Icon icon="cross" />
              </Button>
            )}
          </div>

          {filteredItems.length ? (
            <HighlightList.Root className="flex max-h-[260px] flex-col overflow-y-auto">
              {filteredItems.map((item) => (
                <HighlightList.Item
                  key={String(item.value)}
                  active={
                    multiple
                      ? Array.isArray(value) && value.includes(item.value)
                      : value === item.value
                  }
                >
                  <Button
                    className="flex w-full items-center justify-between gap-2 px-2 py-1 text-left"
                    type="base"
                    onClick={() => toggleValue(item.value)}
                  >
                    <span className="min-w-0 truncate">{item.content}</span>
                    {(multiple
                      ? Array.isArray(value) && value.includes(item.value)
                      : value === item.value) && (
                      <Icon
                        className="shrink-0 text-primary"
                        icon="check"
                      />
                    )}
                  </Button>
                </HighlightList.Item>
              ))}
            </HighlightList.Root>
          ) : (
            <div className="px-2 py-2 text-sm text-fg">{emptyContent}</div>
          )}
        </Popover.Content>
      </Popover.Root>
    </FieldContainer>
  )
}
