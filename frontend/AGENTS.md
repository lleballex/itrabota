# AGENTS.md

## Назначение

Этот файл задаёт краткие рабочие правила для задач в frontend-репозитории. Он не заменяет подробную документацию: детальные архитектурные и предметные правила должны жить в `docs/*` и считаться source of truth.

## Документация и изменение соглашений

- Сначала анализируй существующий код и фактические паттерны репозитория.
- Перед фиксацией новых архитектурных правил, соглашений или repo-wide conventions сначала покажи вывод пользователю и дождись согласования.
- Не придумывай правила, которые нельзя подтвердить кодом или отдельным согласованием.
- Если в проекте найдено несколько конфликтующих паттернов, не выбирай один молча: явно покажи различия и вынеси вопрос пользователю.
- Если для темы есть отдельный документ в `docs/*`, опирайся на него как на source of truth, а не расширяй `AGENTS.md`.

## Project Map

- `src/app` — route-level структура, layouts, page-level composition, screen-specific `_components`.
- `src/components/ui` — low-level reusable UI primitives.
- `src/components/base` — domain-reusable компоненты.
- `src/components/special` — app-level special components и providers.
- `src/api` — API functions, query/mutation hooks, API helpers.
- `src/lib` — утилиты, form helpers, data adapters.
- `src/stores` — client state stores.
- `src/types` — entity types и shared types.
- `src/app/_styles` — global theme, shared style layers, typography tokens.

## Repo-Specific Conventions

- Используй `@/*` imports для кода из `src`.
- Новую route-level логику размещай в `src/app`; screen-specific части держи рядом в `_components`, если они не нужны вне конкретного экрана.
- `src/components/ui` используй только для low-level reusable primitives без жёсткой привязки к конкретной domain-сущности.
- `src/components/base` используй для domain-reusable компонентов.
- `src/components/special` используй для app-level поведения, провайдеров и сквозных механизмов.
- Не создавай новые shared abstractions, reusable components или hooks без явной причины.
- Перед созданием нового abstraction/component/hook сначала проверь существующие аналоги в проекте и убедись, что переиспользование или локальное решение хуже.
- Если логика нужна только одному экрану или одному flow, по умолчанию не выноси её в shared слой.
- Forms: текущий стек проекта — `react-hook-form` + `zod`.
- API/server state: текущий базовый путь — `axios` + `@tanstack/react-query` через project-specific фабрики query/mutation hooks.
- Ошибки API и form mapping по умолчанию должны встраиваться в существующий project pattern, а не решаться новым способом без причины.

## Styling Conventions

- Основной способ стилизации — Tailwind utility classes.
- Глобальные tokens, typography и shared style layers находятся в `src/app/_styles`.
- CSS Modules допустимы только там, где Tailwind делает код неудобным или нечитаемым.
- Типичный допустимый случай для CSS Modules: сложные анимации, `anchor-positioning`, поведение `dialog/popover/highlight` и похожий сложный CSS.
- Если используется CSS Module, выноси туда только ту часть стилей, которая действительно требует обычного CSS; остальная стилизация должна оставаться в Tailwind.

## Commands

- Установка зависимостей: `yarn`
- Dev server: `yarn dev`
- Production build: `yarn build`
- Start production server: `yarn start`
- Lint: `yarn lint`

## Tests And Verification

- Отдельной test-команды в `package.json` сейчас нет. Не утверждай, что тесты были запущены, если их нечем запускать.
- После изменений обязательно проверяй:
  - что код проходит `yarn lint`;
  - что затронутые страницы или flows собираются без очевидных type/runtime regressions;
  - что новый код следует существующему placement pattern проекта;
  - что не создана лишняя abstraction без необходимости;
  - что не сломан существующий API/data flow;
  - что стилизация не нарушает текущий pattern: Tailwind как основной слой, CSS Modules только для действительно сложного CSS.
- Если менялись формы:
  - проверь default values, validation schema, submit flow, error mapping.
- Если менялся API слой:
  - проверь query/mutation contract, error handling, cache/refetch/invalidation поведение.
- Если менялись route-level компоненты:
  - проверь loading/error/empty states и role-based access behavior, если они затронуты.

## Docs

- Подробная архитектура: `docs/architecture.md`
<!-- - Placement rules для компонентов: `docs/components-and-placement.md`
- API integration и server state rules: `docs/api-integration.md`
- Styling rules: `docs/styling-rules.md` -->
