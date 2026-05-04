const CYRILLIC_UPPERCASE = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
const CYRILLIC_LOWERCASE = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"

export function normalizeSearchQuery(query?: string | null) {
  return query?.trim().toLowerCase() || null
}

export function createCaseInsensitiveSearchExpression(expression: string) {
  return `LOWER(translate(${expression}, '${CYRILLIC_UPPERCASE}', '${CYRILLIC_LOWERCASE}'))`
}
