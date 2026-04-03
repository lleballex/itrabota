# AGENTS.md

## Назначение

Этот файл — корневая точка входа для агента по проекту `itrabota`.

Его задача:
- быстро объяснить, что это за проект;
- показать, к какой документации обращаться в зависимости от типа задачи;
- направить агента в frontend/backend-специфичные инструкции.

Этот файл не заменяет подробную документацию и не должен дублировать содержимое всех документов.

## Кратко о проекте

- Проект — платформа только для найма IT-специалистов.
- Основные роли:
  - `кандидат`
  - `рекрутер`
- Репозиторий состоит из двух самостоятельных приложений:
  - [frontend](/Users/leshalebedev/Code/itrabota/frontend)
  - [backend](/Users/leshalebedev/Code/itrabota/backend)

## Как работать с репозиторием

### 1. Сначала опирайся на код и согласованную документацию

- Не придумывай функциональность, если она не подтверждается кодом или отдельным согласованием.
- Если код и документация расходятся:
  1. считай код источником фактического текущего состояния;
  2. явно покажи расхождение пользователю;
  3. не переписывай документацию без согласования.

### 2. Выбирай документ по задаче

#### Для понимания текущего состояния проекта

- [docs/current-state.md](/Users/leshalebedev/Code/itrabota/docs/current-state.md)
  Назначение:
  зафиксированное текущее состояние проекта, что реализовано, что частично, что нестабильно, где есть фронт/бэк-расхождения.
  Когда обращаться:
  если нужно понять, что уже есть в проекте и чего в нём пока нет.

#### Для понимания целевого состояния

- [docs/target-scope.md](/Users/leshalebedev/Code/itrabota/docs/target-scope.md)
  Назначение:
  согласованный целевой scope проекта, обязательный минимум, желательный функционал, роли и пользовательские сценарии.
  Когда обращаться:
  если нужно понять, какой функционал должен быть в готовой версии и что входит в MVP.

#### Для анализа разрывов

- [docs/gaps.md](/Users/leshalebedev/Code/itrabota/docs/gaps.md)
  Назначение:
  разница между текущим состоянием и целевым scope, блокеры, критичность и зоны доработки.
  Когда обращаться:
  если нужно понять, почему задача важна и что именно сейчас мешает готовности проекта.

#### Для списка задач

- [docs/backlog.md](/Users/leshalebedev/Code/itrabota/docs/backlog.md)
  Назначение:
  конкретные задачи на доработку проекта с типом, приоритетом, сложностью, зависимостями и критерием завершения.
  Когда обращаться:
  если нужно выбрать конкретную задачу для реализации или оценить зависимости между задачами.

#### Для порядка выполнения

- [docs/roadmap.md](/Users/leshalebedev/Code/itrabota/docs/roadmap.md)
  Назначение:
  этапы реализации, критический путь, execution-tracker и рекомендуемый порядок задач из backlog.
  Когда обращаться:
  если нужно понять, какую задачу брать следующей и какой этап является текущим.

## Как определять, что читать первым

- Если задача про реализацию новой фичи:
  1. [docs/target-scope.md](/Users/leshalebedev/Code/itrabota/docs/target-scope.md)
  2. [docs/gaps.md](/Users/leshalebedev/Code/itrabota/docs/gaps.md)
  3. [docs/backlog.md](/Users/leshalebedev/Code/itrabota/docs/backlog.md)
  4. [docs/roadmap.md](/Users/leshalebedev/Code/itrabota/docs/roadmap.md)

- Если задача про понимание существующего поведения:
  1. [docs/current-state.md](/Users/leshalebedev/Code/itrabota/docs/current-state.md)
  2. затем код соответствующего приложения

- Если задача про планирование следующего шага:
  1. [docs/roadmap.md](/Users/leshalebedev/Code/itrabota/docs/roadmap.md)
  2. [docs/backlog.md](/Users/leshalebedev/Code/itrabota/docs/backlog.md)

- Если задача про архитектурный или продуктовый спор:
  1. [docs/target-scope.md](/Users/leshalebedev/Code/itrabota/docs/target-scope.md)
  2. [docs/current-state.md](/Users/leshalebedev/Code/itrabota/docs/current-state.md)
  3. затем соответствующие frontend/backend docs

## Переход в frontend/backend инструкции

### Frontend

- Корневые frontend-инструкции:
  [frontend/AGENTS.md](/Users/leshalebedev/Code/itrabota/frontend/AGENTS.md)
- Frontend-архитектура:
  [frontend/docs/architecture.md](/Users/leshalebedev/Code/itrabota/frontend/docs/architecture.md)
- Когда обращаться:
  если задача затрагивает маршруты, UI, формы, клиентские data flows, API hooks, стилизацию или placement компонентов.

### Backend

- Корневые backend-инструкции:
  [backend/AGENTS.md](/Users/leshalebedev/Code/itrabota/backend/AGENTS.md)
- Backend-архитектура:
  [backend/docs/architecture.md](/Users/leshalebedev/Code/itrabota/backend/docs/architecture.md)
- Backend доменная модель:
  [backend/docs/domain-model.md](/Users/leshalebedev/Code/itrabota/backend/docs/domain-model.md)
- Backend API-контракты:
  [backend/docs/api-contracts.md](/Users/leshalebedev/Code/itrabota/backend/docs/api-contracts.md)
- Когда обращаться:
  если задача затрагивает модули NestJS, DTO, сущности, API, сервисы, переходы между состояниями или модель данных.

## Правила работы с документацией

- Не обновляй planning-документы автоматически при любом изменении кода.
- Если изменение меняет фактическое состояние проекта, целевой scope, gaps, backlog или roadmap:
  - сначала покажи пользователю, что именно устарело;
  - затем согласуй обновление документации;
  - только потом вноси изменения.
- Не дублируй детальные правила frontend/backend сюда, если они уже есть в соответствующих `AGENTS.md`.

## Практический порядок действий для агента

1. Определи, это задача про frontend, backend или сквозной flow.
2. Прочитай корневую planning-документацию, если задача связана с roadmap/backlog/scope.
3. Перейди в соответствующий:
   - [frontend/AGENTS.md](/Users/leshalebedev/Code/itrabota/frontend/AGENTS.md)
   - [backend/AGENTS.md](/Users/leshalebedev/Code/itrabota/backend/AGENTS.md)
4. Проверь фактический код перед выводами.
5. Если задача затрагивает документацию, сначала согласуй обновление с пользователем.
