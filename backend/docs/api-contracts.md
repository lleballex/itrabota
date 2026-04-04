# Контракты backend API

## Назначение документа

Этот документ описывает backend API в человекочитаемом виде на основе текущего кода.

Это не автогенерация Swagger и не попытка угадать будущий контракт. Здесь фиксируется только то, что можно надёжно вывести из контроллеров, DTO и сервисов.

Если endpoint реализован частично, опирается на нестабильную внутреннюю структуру ответа или содержит технический долг, это помечается отдельно.

## Общие правила API

- глобальный префикс API: `/api`
- валидация входных данных выполняется через глобальный `ValidationPipe`
- включены:
- `whitelist: true`
- `transform: true`
- аутентификация построена на JWT через cookie `accessToken`
- если route помечен `@Auth()`, требуется авторизация
- если route помечен `@Auth(UserRole.Recruiter)` или `@Auth(UserRole.Candidate)`, требуется соответствующая роль
- явных response DTO в проекте сейчас почти нет
- если явного response DTO нет, не нужно искусственно фиксировать примерный JSON-ответ
- стабильного response layer сейчас нет, и фактический контракт ответа в большинстве endpoint равен форме entity и текущим joins/select в сервисах
- для любого endpoint потенциально возможен `500 Internal Server Error`, даже если в коде явно перечислены только прикладные ошибки

## 1. Auth

### POST `/api/auth/login`

- Модуль: `auth`
- Route: `/api/auth/login`
- HTTP method: `POST`
- Назначение: аутентификация пользователя по email и password
- Auth / roles: не требуется
- Params: нет
- Query: нет
- Body DTO: `LoginDto`
- Response DTO:
- явного response body нет
- статус: `204 No Content`
- в cookie устанавливается `accessToken`
- Возможные ошибки:
- ошибки валидации DTO
- ошибка авторизации через `LocalAuthGuard`
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- фактический контракт ответа завязан на cookie-based auth
- тело ответа отсутствует

### POST `/api/auth/register`

- Модуль: `auth`
- Route: `/api/auth/register`
- HTTP method: `POST`
- Назначение: регистрация пользователя
- Auth / roles: не требуется
- Params: нет
- Query: нет
- Body DTO: `RegisterDto`
- Response DTO:
- явный response DTO отсутствует
- по факту тело ответа не используется
- в cookie устанавливается `accessToken`
- Возможные ошибки:
- ошибки валидации DTO
- `BadRequestException`, если email уже занят
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- endpoint не возвращает оформленный пользовательский объект
- контракт фактически ориентирован на установку cookie

### POST `/api/auth/logout`

- Модуль: `auth`
- Route: `/api/auth/logout`
- HTTP method: `POST`
- Назначение: выход пользователя
- Auth / roles: требуется авторизация, любая роль (`@Auth()`)
- Params: нет
- Query: нет
- Body DTO: нет
- Response DTO:
- явного response body нет
- статус: `204 No Content`
- cookie `accessToken` очищается
- Возможные ошибки:
- ошибки авторизации
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- endpoint стабилизирован: авторизация обязательна

## 2. Me

### GET `/api/me`

- Модуль: `me`
- Route: `/api/me`
- HTTP method: `GET`
- Назначение: получить текущего пользователя
- Auth / roles: требуется авторизация, любая роль
- Params: нет
- Query: нет
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается результат `usersService.findOneById(...)`
- Возможные ошибки:
- ошибки авторизации
- `NotFoundException`, если пользователь не найден
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- форма ответа зависит от текущего query builder в `UsersService`

### POST `/api/me/recruiter`

- Модуль: `me`
- Route: `/api/me/recruiter`
- HTTP method: `POST`
- Назначение: создать профиль рекрутера и связанную компанию для текущего пользователя
- Auth / roles: требуется роль `Recruiter`
- Params: нет
- Query: нет
- Body DTO: `CreateMeRecruiterDto`
- Response DTO:
- явного response DTO нет
- по факту возвращается обновлённый пользователь через `usersService.findOneById(...)`
- Возможные ошибки:
- ошибки авторизации / роли
- ошибки валидации DTO
- `ConflictException`, если email уже занят
- возможны обычные `Error` в зависимых сервисах, если инварианты нарушены
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- операция составная, выполняется без транзакции
- контракт ответа зависит от `UsersService`

### PATCH `/api/me/recruiter`

- Модуль: `me`
- Route: `/api/me/recruiter`
- HTTP method: `PATCH`
- Назначение: обновить профиль рекрутера и связанную компанию
- Auth / roles: требуется роль `Recruiter`
- Params: нет
- Query: нет
- Body DTO: `UpdateMeRecruiterDto`
- Response DTO:
- явного response DTO нет
- по факту возвращается обновлённый пользователь через `usersService.findOneById(...)`
- Возможные ошибки:
- ошибки авторизации / роли
- ошибки валидации DTO
- `ConflictException`, если email уже занят
- `Error`, если у рекрутера отсутствует компания
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- операция составная, выполняется без транзакции
- в коде есть технический долг по типу исключений

### POST `/api/me/candidate`

- Модуль: `me`
- Route: `/api/me/candidate`
- HTTP method: `POST`
- Назначение: создать профиль кандидата для текущего пользователя
- Auth / roles: требуется роль `Candidate`
- Params: нет
- Query: нет
- Body DTO: `CreateMeCandidateDto`
- Response DTO:
- явного response DTO нет
- по факту возвращается обновлённый пользователь через `usersService.findOneById(...)`
- Возможные ошибки:
- ошибки авторизации / роли
- ошибки валидации DTO
- `ConflictException`, если email уже занят
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- операция составная, выполняется без транзакции
- порядок опыта работы отдельным контрактом не описан

### PATCH `/api/me/candidate`

- Модуль: `me`
- Route: `/api/me/candidate`
- HTTP method: `PATCH`
- Назначение: обновить профиль кандидата
- Auth / roles: требуется роль `Candidate`
- Params: нет
- Query: нет
- Body DTO: `UpdateMeCandidateDto`
- Response DTO:
- явного response DTO нет
- по факту возвращается обновлённый пользователь через `usersService.findOneById(...)`
- Возможные ошибки:
- ошибки авторизации / роли
- ошибки валидации DTO
- `ConflictException`, если email уже занят
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- операция составная, выполняется без транзакции
- обновление опыта работы реализовано как upsert/remove по входному массиву

## 3. Vacancies

### GET `/api/vacancies/recruiter`

- Модуль: `vacancies`
- Route: `/api/vacancies/recruiter`
- HTTP method: `GET`
- Назначение: получить вакансии текущего рекрутера
- Auth / roles: требуется роль `Recruiter`
- Params: нет
- Query DTO: `GetRecruiterVacanciesDto`
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается массив `Vacancy[]`
- Возможные ошибки:
- ошибки авторизации / роли
- ошибки валидации query DTO
- ошибки получения текущего рекрутера
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка:
- пагинации нет
- фильтрация по `query`
- фильтрация по `status`
- сортировка по `vacancy.createdAt DESC`
- Примечания:
- отсутствие пагинации стоит считать текущим ограничением контракта

### GET `/api/vacancies/candidate`

- Модуль: `vacancies`
- Route: `/api/vacancies/candidate`
- HTTP method: `GET`
- Назначение: получить список вакансий для кандидата
- Auth / roles: требуется роль `Candidate`
- Params: нет
- Query DTO: `GetCandidateVacanciesDto`
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается массив `Vacancy[]`
- Возможные ошибки:
- ошибки авторизации / роли
- ошибки валидации query DTO
- ошибки получения текущего кандидата
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка:
- пагинации нет
- фильтрация по `query`
- дополнительно всегда фильтруется `status = active`
- сортировка по `vacancy.createdAt DESC`
- Примечания:
- архивные вакансии кандидат здесь не получает

### POST `/api/vacancies`

- Модуль: `vacancies`
- Route: `/api/vacancies`
- HTTP method: `POST`
- Назначение: создать вакансию
- Auth / roles: требуется роль `Recruiter`
- Params: нет
- Query: нет
- Body DTO: `CreateVacancyDto`
- Response DTO:
- явного response DTO нет
- по факту возвращается созданная вакансия через `findOneById(...)`
- Возможные ошибки:
- ошибки авторизации / роли
- ошибки валидации DTO
- `NotFoundException`, если связанная запись не найдена при последующей загрузке
- возможны ошибки, связанные с неконсистентными id связанных сущностей
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- операция составная, выполняется без транзакции
- создание шагов воронки встроено в создание вакансии
- в коде есть TODO, что логика `funnelSteps` сейчас используется не только для update

### GET `/api/vacancies/:id`

- Модуль: `vacancies`
- Route: `/api/vacancies/:id`
- HTTP method: `GET`
- Назначение: получить вакансию по id
- Auth / roles: не требуется
- Params:
- `id: string`
- Query: нет
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается `Vacancy`
- Возможные ошибки:
- `NotFoundException`, если вакансия не найдена
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка:
- не применимо
- шаги воронки сортируются по `index ASC`
- Примечания:
- публичность endpoint зафиксирована кодом

### PATCH `/api/vacancies/:id`

- Модуль: `vacancies`
- Route: `/api/vacancies/:id`
- HTTP method: `PATCH`
- Назначение: обновить вакансию
- Auth / roles: требуется роль `Recruiter`
- Params:
- `id: string`
- Query: нет
- Body DTO: `UpdateVacancyDto`
- Response DTO:
- явного response DTO нет
- по факту возвращается обновлённая вакансия через `findOneById(...)`
- Возможные ошибки:
- ошибки авторизации / роли
- ошибки валидации DTO
- `NotFoundException`, если вакансия не найдена
- `ForbiddenException`, если текущий рекрутер не является автором вакансии
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- операция составная, выполняется в транзакции на уровне service orchestration
- обновление `funnelSteps` включает create/update/delete по входному массиву
- поведение PATCH для связанных полей:
  - отсутствующее поле в body не меняет соответствующую связь;
  - `cityId: null` очищает связь с городом;
  - `skillIds: []` очищает набор навыков;
  - переданные id связей маппятся в relation-object через `repo.create(...)`.

## 4. Applications

### GET `/api/applications/recruiter`

- Модуль: `applications`
- Route: `/api/applications/recruiter`
- HTTP method: `GET`
- Назначение: получить процессы текущего рекрутера
- Auth / roles: требуется роль `Recruiter`
- Params: нет
- Query DTO: `GetApplicationsDto`
- Поддерживаемые query-поля:
- `query` — поиск по `vacancy.title`
- `status` — фильтр по `ApplicationStatus`
- `type` — фильтр по `ApplicationType`
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается массив `Application[]`
- Возможные ошибки:
- ошибки авторизации / роли
- ошибки получения текущего рекрутера
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка:
- пагинации нет
- фильтрация по `query`, `status`, `type`
- фильтрация по ownership рекрутера через `vacancy.recruiter.id`
- сортировка по `application.createdAt DESC`
- дополнительная сортировка сообщений `message.createdAt ASC`
- Примечания:
- контракт ответа зависит от текущих join-ов в `ApplicationsService.createQB(...)`

### GET `/api/applications/candidate`

- Модуль: `applications`
- Route: `/api/applications/candidate`
- HTTP method: `GET`
- Назначение: получить процессы текущего кандидата
- Auth / roles: требуется роль `Candidate`
- Params: нет
- Query DTO: `GetApplicationsDto`
- Поддерживаемые query-поля:
- `query` — поиск по `vacancy.title`
- `status` — фильтр по `ApplicationStatus`
- `type` — фильтр по `ApplicationType`
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается массив `Application[]`
- Возможные ошибки:
- ошибки авторизации / роли
- ошибки получения текущего кандидата
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка:
- пагинации нет
- фильтрация по `query`, `status`, `type`
- фильтрация по ownership кандидата через `candidate.id`
- сортировка по `application.createdAt DESC`
- дополнительная сортировка сообщений `message.createdAt ASC`
- Примечания:
- контракт ответа зависит от текущих join-ов в `ApplicationsService.createQB(...)`

### GET `/api/applications/recruiter/:id`

- Модуль: `applications`
- Route: `/api/applications/recruiter/:id`
- HTTP method: `GET`
- Назначение: получить конкретный процесс для текущего рекрутера
- Auth / roles: требуется роль `Recruiter`
- Params:
- `id: string` — id процесса
- Query: нет
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается `Application`
- Возможные ошибки:
- ошибки авторизации / роли
- `NotFoundException`, если процесс не найден или не принадлежит вакансиям текущего рекрутера
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо

### POST `/api/vacancies/:id/applications`

- Модуль: `vacancies` / фактически использует `applications`
- Route: `/api/vacancies/:id/applications`
- HTTP method: `POST`
- Назначение: создать отклик кандидата на вакансию
- Auth / roles: требуется роль `Candidate`
- Params:
- `id: string` — id вакансии
- Query: нет
- Body DTO: `CreateApplicationDto`
- Response DTO:
- явного response DTO нет
- по факту возвращается `Application`
- Возможные ошибки:
- ошибки авторизации / роли
- ошибки валидации DTO
- `NotFoundException`, если вакансия или связанные данные не найдены
- `ConflictException`, если отклик на эту вакансию у кандидата уже существует
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- endpoint живёт в контроллере вакансий, но делегирует в `ApplicationsService`
- операция составная, выполняется в транзакции
- при создании отклика `Application.type` принудительно устанавливается в `response`
- при создании отклика автоматически создаётся системное сообщение `candidate_responded`
- если передан `message`, создаётся ещё и пользовательское сообщение

### GET `/api/vacancies/:id/applications`

- Модуль: `vacancies` / фактически использует `applications`
- Route: `/api/vacancies/:id/applications`
- HTTP method: `GET`
- Назначение: получить отклики по вакансии для текущего рекрутера
- Auth / roles: требуется роль `Recruiter`
- Params:
- `id: string` — id вакансии
- Query: нет
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается массив `Application[]`
- Возможные ошибки:
- ошибки авторизации / роли
- ошибки получения текущего рекрутера
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка:
- пагинации нет
- фильтрация по vacancy id (через сервисный параметр)
- сортировка по `application.createdAt DESC`
- дополнительная сортировка сообщений `message.createdAt ASC`
- Примечания:
- контракт ответа завязан на текущий query builder
- endpoint частично нестабилен как публичный контракт из-за отсутствия response DTO
- возвращаемая форма `Application` зависит от join-ов в `ApplicationsService.createQB(...)`, включая `vacancy.specialization`

### GET `/api/vacancies/:id/applications/me`

- Модуль: `vacancies` / фактически использует `applications`
- Route: `/api/vacancies/:id/applications/me`
- HTTP method: `GET`
- Назначение: получить отклик текущего кандидата на конкретную вакансию
- Auth / roles: требуется роль `Candidate`
- Params:
- `id: string` — id вакансии
- Query: нет
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается `Application`
- Возможные ошибки:
- ошибки авторизации / роли
- `NotFoundException`, если вакансия или отклик не найдены
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- endpoint возвращает только один отклик текущего кандидата

## 5. Attachments

### GET `/api/attachments/:id/content`

- Модуль: `attachments`
- Route: `/api/attachments/:id/content`
- HTTP method: `GET`
- Назначение: получить бинарное содержимое attachment
- Auth / roles: не требуется
- Params:
- `id: string`
- Query: нет
- Body DTO: нет
- Response DTO:
- не JSON
- возвращается `StreamableFile`
- выставляются заголовки `Content-Type` и `Content-Length`
- Возможные ошибки:
- `NotFoundException`, если attachment не найден
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка: не применимо
- Примечания:
- endpoint отдаёт контент напрямую
- метаданные attachment отдельным публичным endpoint сейчас не опубликованы

## 6. Справочники

### GET `/api/cities`

- Модуль: `cities`
- Route: `/api/cities`
- HTTP method: `GET`
- Назначение: получить список городов
- Auth / roles: не требуется
- Params: нет
- Query: нет
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается `City[]`
- Возможные ошибки:
- явные прикладные ошибки не заданы
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка:
- пагинации нет
- сортировка по `name ASC`

### GET `/api/industries`

- Модуль: `industries`
- Route: `/api/industries`
- HTTP method: `GET`
- Назначение: получить список отраслей
- Auth / roles: не требуется
- Params: нет
- Query: нет
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается `Industry[]`
- Возможные ошибки:
- явные прикладные ошибки не заданы
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка:
- пагинации нет
- сортировка по `name ASC`

### GET `/api/skills`

- Модуль: `skills`
- Route: `/api/skills`
- HTTP method: `GET`
- Назначение: получить список навыков
- Auth / roles: не требуется
- Params: нет
- Query: нет
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается `Skill[]`
- Возможные ошибки:
- явные прикладные ошибки не заданы
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка:
- пагинации нет
- сортировка по `name ASC`

### GET `/api/specializations`

- Модуль: `specializations`
- Route: `/api/specializations`
- HTTP method: `GET`
- Назначение: получить список специализаций
- Auth / roles: не требуется
- Params: нет
- Query: нет
- Body DTO: нет
- Response DTO:
- явного response DTO нет
- по факту возвращается `Specialization[]`
- Возможные ошибки:
- явные прикладные ошибки не заданы
- `500 Internal Server Error`
- Пагинация / фильтрация / сортировка:
- пагинации нет
- сортировка по `name ASC`

## Нестабильные и частично оформленные части контракта

- во многих endpoint отсутствуют отдельные response DTO
- форма ответа часто определяется текущими entity и `QueryBuilder`
- из-за этого контракт ответа сейчас нельзя считать полностью стабилизированным
- составные операции `me/*`, `vacancies`, `applications` выполняются без транзакций
- в проекте есть технический долг по единообразию исключений
- контракт сортировки сообщений внутри откликов стоит считать чувствительным к реализации запроса
