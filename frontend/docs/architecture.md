# Frontend Architecture

## Назначение

Этот документ фиксирует core pattern разработки frontend-репозитория: как здесь обычно устроены экраны, компоненты, hooks, типы, утилиты и integration points. Документ нужен для того, чтобы новые изменения продолжали текущую архитектурную линию проекта, а не создавали новый локальный подход в каждом feature.

Документ разделён на две части:

- `Current State` — то, что подтверждается текущим кодом и уже используется в репозитории;
- `Recommended Pattern` — эталонный паттерн для новых изменений, если он уже может быть надёжно выведен из кода и согласован.

Если в коде есть несколько конкурирующих паттернов, это должно быть явно отмечено. Такой случай нельзя описывать как единое правило.

## Общая структура

Проект построен на `Next.js App Router` и организован вокруг route-level экранов в `src/app`, с отдельными слоями для reusable UI, domain-reusable компонентов, API-интеграции, типов и утилит.

Основные директории:

- `src/app` — routes, layouts, page-level composition, route-private `_components`, route-local forms.
- `src/components/ui` — low-level reusable UI primitives.
- `src/components/base` — domain-reusable компоненты и составные блоки.
- `src/components/special` — app-level special components и providers.
- `src/api` — API-функции, query/mutation hooks, API helpers.
- `src/lib` — утилиты, form helpers, data adapters.
- `src/stores` — client state stores.
- `src/types` — entity types и shared types.
- `src/app/_styles` — global theme, typography, utility layers и shared style rules.

## Current State

### 1. Архитектурные уровни

Фактически в проекте используются следующие уровни:

- `Route level`:
  страницы и layouts в `src/app`, включая route-private `_components`.
- `Feature/domain composition level`:
  составные доменные блоки в `src/components/base`.
- `Shared UI level`:
  низкоуровневые reusable primitives в `src/components/ui`.
- `App behavior level`:
  глобальные механизмы уровня приложения в `src/components/special`.
- `Data access level`:
  запросы и hooks в `src/api`.
- `Shared logic level`:
  независимые утилиты и helpers в `src/lib`.
- `Type layer`:
  типы сущностей и shared types в `src/types`.

Это не FSD в строгом виде и не классическая layered architecture в формализованном виде. Проект использует собственную практическую схему слоёв.

### 2. Страницы и feature composition

Новые экраны фактически строятся так:

- route-level entrypoint живёт в `src/app/**/page.tsx`;
- если экран разрастается, screen-specific части кладутся рядом в `_components`;
- если блок нужен в нескольких экранах внутри одного домена, он может быть вынесен в `src/components/base/...`;
- если блок является low-level primitive без жёсткой domain-привязки, он живёт в `src/components/ui`.

Примеры текущих route-level зон:

- auth screens: `src/app/auth/*`;
- candidate screens: `src/app/(main)/candidate/*`;
- recruiter screens: `src/app/(main)/recruiter/*`;
- main layout parts: `src/app/(main)/_components/*`.

### 3. Разделение `ui`, `base`, `special`, `_components`

#### `src/components/ui`

Фактическое назначение:

- low-level reusable primitives;
- компоненты без жёсткой привязки к вакансии, профилю, отклику или конкретному screen flow;
- часто это form controls, overlays, small layout primitives, generic async rendering helpers.

Типичные примеры:

- `Button`, `Input`, `Select`, `Textarea`, `Checkbox`;
- `Modal`, `Popover`, `HighlightList`;
- `RemoteData`, `Icon`, `Separator`.

#### `src/components/base`

Фактическое назначение:

- domain-reusable компоненты;
- составные блоки предметной области;
- компоненты, которые уже выше уровня primitive и знают о структуре доменных данных.

Типичные примеры:

- vacancy: `VacancyCard`, `VacancyDetailed`, `VacancyForm`, `VacancyRespondModal`, `VacancyStatus`;
- application: `ApplicationCard`, `ApplicationDetailed`, `ApplicationChat`, `ApplicationRejectModal`;
- profile: `ProfileForm`.

#### `src/components/special`

Фактическое назначение:

- app-level special components;
- провайдеры и сквозное поведение приложения.

Текущие примеры:

- `AuthProvider`;
- `Toasts`.

#### `_components` рядом с route

Фактическое назначение:

- screen-specific компоненты;
- части, которые нужны конкретному экрану или узкому route flow;
- по текущему коду это первый кандидат на локальное размещение, если нет явной причины выносить код выше.

Примеры:

- `src/app/(main)/recruiter/profile/_components/*`
- `src/app/(main)/candidate/profile/_components/*`
- `src/app/(main)/recruiter/vacancies/[vacancyId]/_components/*`

### 4. Где размещать логику

#### Бизнес-логика и data access

Фактически сейчас:

- API-вызовы и hooks доступа к server state находятся в `src/api`.
- Query и mutation hooks строятся через project-specific фабрики:
  - `createUseQuery`
  - `createUseMutation`
- Ошибки API централизованно преобразуются в `ApiError`.
- Отрисовка loading/error/success часто делегируется через `RemoteData`.

#### Presentation logic

Фактически сейчас presentation logic может находиться:

- прямо в route-level `page.tsx`, если экран небольшой;
- в route-private `_components`, если это логика конкретного экрана;
- в `components/base`, если логика относится к domain-reusable составному блоку;
- внутри `ui`, если это поведение самого primitive-компонента.

#### Hooks

Фактически сейчас есть несколько типов hooks:

- API hooks в `src/api/*`;
- small reusable hooks в `src/lib/*`;
- feature-local hooks рядом с компонентом, если логика узкоспециальная.
  Пример: `ApplicationDetailed/use-steps.ts`.

Единого формального правила по всем видам hooks в коде пока не зафиксировано, но локальность размещения уже прослеживается.

#### Типы

Фактически сейчас:

- entity types лежат в `src/types/entities`;
- shared non-entity types лежат в `src/types`;
- component-local props обычно объявляются прямо в файле компонента через `interface Props`;
- form values и form schema types чаще живут рядом с формой в `form.ts`.

#### Утилиты

Фактически сейчас:

- общие утилиты и form helpers лежат в `src/lib`;
- domain-independent helpers поднимаются туда без привязки к route;
- route-specific helpers обычно остаются рядом с feature.

### 5. Правила создания новых директорий и файлов

Фактически из кода можно вывести такие правила:

- новый экран создаётся в `src/app/.../page.tsx`;
- route-level layout создаётся в `src/app/.../layout.tsx`, если layout нужен сегменту;
- screen-private части размещаются в `_components` рядом с экраном;
- reusable primitive-компонент обычно получает отдельную папку в `src/components/ui/<ComponentName>/`;
- domain-reusable компонент обычно получает отдельную папку в `src/components/base/<domain>/<ComponentName>/`;
- рядом с компонентом часто есть `index.ts` для реэкспорта;
- route-local или component-local form schema обычно лежит в `form.ts`;
- если у составного компонента есть внутренние части, они размещаются рядом с ним в его папке.

### 6. Нейминг

#### Директории

Фактически сейчас:

- route-сегменты следуют Next.js naming;
- screen-private директории называются `_components`;
- папки компонентов в `ui` и `base` чаще всего в `PascalCase`;
- доменные поддиректории в `base` — в lowercase, например `vacancy`, `profile`, `application`.

#### Файлы

Фактически сейчас:

- компонентные файлы обычно называются в `PascalCase.tsx`;
- `index.ts` используется для реэкспорта;
- API-файлы называются в `kebab-case` с действием:
  - `get-vacancies.ts`
  - `update-vacancy.ts`
  - `create-me-candidate.ts`
- form schema files обычно называются `form.ts`;
- есть исключения и несогласованности.
  Пример: файл `CanidateProfileWorkExperience.tsx` содержит опечатку в имени.

#### Компоненты

Фактически сейчас:

- имена React-компонентов в `PascalCase`;
- пропсы чаще всего описываются через `interface Props`;
- для compound components используется object export pattern:
  - `ProfileForm.Root`
  - `Modal.Root`
  - `Popover.Trigger`
  - `HighlightList.Item`

#### Hooks

Фактически сейчас:

- hooks называются в формате `useX`;
- API hooks именуются по действию и сущности:
  - `useVacancies`
  - `useVacancy`
  - `useCreateVacancy`
  - `useUpdateMeCandidate`

#### Types

Фактически сейчас:

- entity types в `PascalCase`;
- enums и enum-like словари тоже в `PascalCase`;
- form types именуются не полностью единообразно:
  - где-то `FormValues`;
  - где-то `FormInputValues` / `FormOutputValues`.

Это нужно считать текущим расхождением, а не единым стандартом.

### 7. API как часть архитектуры

Фактический паттерн:

- низкоуровневый HTTP-клиент централизован в `src/api/lib/axios.ts`;
- hooks для запросов и мутаций живут в `src/api/<domain>/...`;
- query hooks создаются через `createUseQuery`;
- mutation hooks создаются через `createUseMutation`;
- queries возвращают project-specific `RemoteData`, а не raw `react-query` result;
- ошибки API преобразуются в единый `ApiError`;
- form-level field errors маппятся через `handleFormApiError`.

Что пока не выглядит как полностью устоявшийся единый стандарт:

- стратегия cache invalidation;
- правила refetch после mutation;
- формальный подход к optimistic updates.

### 8. Где в проекте уже есть расхождения

#### Profile form pattern

Сейчас есть два подхода:

- candidate profile использует domain-reusable abstraction `ProfileForm` из `src/components/base/profile/ProfileForm`;
- recruiter profile собирает похожий экран вручную в route-level коде.

Это нельзя описывать как единый уже соблюдаемый стандарт.

#### Form typing pattern

Сейчас есть минимум два варианта:

- `FormValues`;
- `FormInputValues` + `FormOutputValues`.

#### Styling implementation pattern

Сейчас используется гибрид:

- основной слой — Tailwind utility classes;
- дополнительный слой — CSS Modules для сложного CSS;
- ещё один слой — global shared classes и design tokens в `src/app/_styles`.

Это тоже нужно описывать как комбинированный стек, а не как один-единственный способ стилизации.

## Recommended Pattern

Этот раздел фиксирует рекомендуемый эталон для новых изменений, если он уже подтверждён кодом и отдельными согласованиями.

### 1. Базовая схема размещения

При добавлении нового кода ориентир такой:

- новый экран:
  создаётся в `src/app`;
- screen-specific составные части:
  остаются рядом в `_components`;
- low-level reusable primitive:
  создаётся в `src/components/ui`;
- domain-reusable компонент:
  создаётся в `src/components/base`;
- app-level provider или cross-cutting behavior:
  создаётся в `src/components/special`;
- API hooks и network integration:
  создаются в `src/api`;
- shared utility без route/domain привязки:
  создаётся в `src/lib`;
- shared type:
  создаётся в `src/types`.

### 2. Правило локальности по умолчанию

Для нового кода рекомендуемый default:

- сначала размещать код локально рядом с экраном или feature;
- поднимать его в `base`, `ui`, `lib` или другой shared слой только если есть явная причина;
- перед новым abstraction сначала проверять, нет ли уже существующего аналога в проекте.

### 3. Разделение ответственности

Рекомендуемое разделение:

- `page.tsx`:
  entrypoint экрана, composition, route params, orchestration;
- route `_components`:
  screen-specific presentation и screen-specific behavior;
- `components/base`:
  domain-reusable composition;
- `components/ui`:
  reusable primitive UI;
- `api`:
  запросы, mutation/query hooks, API integration contracts;
- `lib`:
  независимые helpers, adapters, small shared hooks;
- `types`:
  shared и entity types.

### 4. Naming pattern для нового кода

Рекомендуемый эталон:

- папки reusable-компонентов: `PascalCase`;
- React-компоненты: `PascalCase`;
- hooks: `useX`;
- API files: `kebab-case` с action prefix;
- props interface: `Props`, если файл содержит один основной компонент;
- form schema file: `form.ts`;
- внутренние части compound-компонента: `ComponentPart.tsx`.

### 5. API pattern для нового кода

Рекомендуемый эталон:

- не обходить project-specific query/mutation factories без явной причины;
- новые API integrations размещать в `src/api/<domain>`;
- query hooks строить через текущий project pattern;
- mutation hooks строить через текущий project pattern;
- error mapping в формы и UI вписывать в существующий `ApiError` / toast / form error flow;
- cache invalidation и refetch-поведение должны проектироваться явно, а не оставляться случайными по умолчанию.

### 6. Когда не нужно создавать новую директорию

Новая директория обычно не нужна, если:

- логика используется только одним route-level экраном;
- это маленький helper, который не стал reusable;
- компонент слишком мал, чтобы его отделение повышало читаемость;
- abstraction создаётся только “на будущее”, без текущего подтверждённого reuse.

## Anti-Patterns

Ниже перечислены признаки плохой структуры для этого репозитория.

- Выносить код в shared слой без подтверждённого reuse или явной architectural причины.
- Создавать новый reusable component, hook или abstraction, не проверив существующие аналоги.
- Класть domain-specific компонент в `ui`.
- Класть screen-specific код в `base`, если он нужен только одному экрану.
- Дублировать альтернативный способ работы с API вместо использования существующего project pattern.
- Описывать документацией один “стандарт”, если в коде реально есть несколько конкурирующих паттернов.
- Нормализовать расхождение молча вместо явного согласования.
- Создавать новые naming conventions поверх уже существующих, не сверив их с кодом проекта.
- Размещать shared business logic в случайных route-level файлах, если она уже явно стала reusable.
- Создавать директории и слои “на вырост”, когда локальное размещение было бы проще и чище.

## Что считать source of truth

- Общая архитектура и core pattern: этот документ.
- Placement rules и более подробные правила по компонентам: `docs/components-and-placement.md`.
- API integration и server state rules: `docs/api-integration.md`.
- Styling stack и границы использования CSS Modules: `docs/styling-rules.md`.
