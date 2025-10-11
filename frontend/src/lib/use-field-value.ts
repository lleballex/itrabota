import { useEffect, useState } from "react"

export const useFieldValue = <V>({
  baseValue,
  baseOnChange,
  transformBaseValue,
}: {
  baseValue?: V
  baseOnChange?: (v: V) => void
  transformBaseValue: (v?: V) => V
}) => {
  const [value, setValue] = useState<V>(transformBaseValue(baseValue))

  useEffect(() => {
    setValue(transformBaseValue(baseValue))
  }, [baseValue])

  const onChange = (val: V) => {
    if (baseOnChange) {
      baseOnChange(val)
    } else {
      setValue(val)
    }
  }

  return {
    value,
    onChange,
  }
}
