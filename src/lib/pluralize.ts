interface Variants {
  one: string
  few: string
  many: string
}

export const pluralize = (count: number, variants: Variants) => {
  const rule = new Intl.PluralRules("ru-RU").select(count)

  if (!(rule in variants)) {
    throw new Error(`Unspecified plural rule: ${rule}`)
  }

  return `${count} ${variants[rule as keyof Variants]}`
}
