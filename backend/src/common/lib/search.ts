import { Brackets, ObjectLiteral, SelectQueryBuilder } from "typeorm"

const CYRILLIC_UPPERCASE = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
const CYRILLIC_LOWERCASE = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"
const MAX_SEARCH_TOKENS = 8

export function normalizeSearchQuery(query?: string | null) {
  return query?.trim().toLowerCase() || null
}

export function splitSearchQuery(query?: string | null) {
  const normalizedQuery = normalizeSearchQuery(query)

  if (!normalizedQuery) {
    return []
  }

  return normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_SEARCH_TOKENS)
}

export function createCaseInsensitiveSearchExpression(expression: string) {
  return `LOWER(translate(${expression}, '${CYRILLIC_UPPERCASE}', '${CYRILLIC_LOWERCASE}'))`
}

export function applyTokenizedCaseInsensitiveSearch<
  Entity extends ObjectLiteral,
>(
  qb: SelectQueryBuilder<Entity>,
  query: string | null | undefined,
  expressions: string[],
  paramPrefix = "search",
) {
  const tokens = splitSearchQuery(query)

  if (!tokens.length || !expressions.length) {
    return
  }

  tokens.forEach((token, tokenIndex) => {
    const paramName = `${paramPrefix}${tokenIndex}`

    qb.andWhere(
      new Brackets((tokenQb) => {
        expressions.forEach((expression, expressionIndex) => {
          const condition = `${createCaseInsensitiveSearchExpression(
            expression,
          )} LIKE :${paramName}`

          if (expressionIndex === 0) {
            tokenQb.where(condition)
          } else {
            tokenQb.orWhere(condition)
          }
        })
      }),
      {
        [paramName]: `%${token}%`,
      },
    )
  })
}
