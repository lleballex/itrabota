export type Options = {
  format: "currency"
}

export const formatNumber = (value: number, options?: Options) => {
  const preparedOptions: Intl.NumberFormatOptions = {}

  if (options?.format === "currency") {
    preparedOptions.style = "currency"
    preparedOptions.currency = "RUB"
    preparedOptions.maximumFractionDigits = 0
  }

  return new Intl.NumberFormat("ru-RU", preparedOptions).format(value)
}
