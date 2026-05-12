# Deploy на VPS

Этот репозиторий подготовлен для запуска через `docker compose` на одном VPS:

- `postgres` для базы данных;
- `backend` на `NestJS`;
- `frontend` на `Next.js`;
- `nginx` как reverse proxy на `itrabota.lleballex.ru`.

## 1. Что нужно на сервере

- VPS с Linux и публичным IPv4-адресом.
- Открытый входящий порт `80/tcp`.
- Установленные `docker` и `docker compose`.
- DNS-запись `A` для `itrabota.lleballex.ru`, указывающая на IP VPS.

Пример для Ubuntu:

```bash
sudo apt update
sudo apt install -y ca-certificates curl
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

## 2. Подготовка env

В корне репозитория нужен файл `.env` для `docker compose`.

```bash
cp .env.example .env
```

Минимум, что нужно изменить в `.env`:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`

Для текущего запуска без SSL оставь:

- `COOKIE_SECURE=false`

Если позже подключишь HTTPS, поменяй:

- `COOKIE_SECURE=true`

Текущие production-значения под твой домен уже заготовлены:

- `CORS_ORIGINS=http://itrabota.lleballex.ru`
- `NEXT_PUBLIC_API_URL=http://itrabota.lleballex.ru/api`
- `NEXT_PUBLIC_ATTACHMENT_HOST=itrabota.lleballex.ru`
- `NEXT_PUBLIC_ATTACHMENT_URL=http://itrabota.lleballex.ru/api/attachments/:id/content`
- `INTERNAL_API_URL=http://backend:8000/api`

## 3. Запуск

На сервере из корня репозитория:

```bash
docker compose up -d --build
```

Проверить состояние контейнеров:

```bash
docker compose ps
docker compose logs -f nginx backend frontend postgres
```

После этого сайт должен открываться по адресу:

`http://itrabota.lleballex.ru`

Swagger backend будет доступен по адресу:

`http://itrabota.lleballex.ru/api`

## 4. Демо-данные

Если нужен проект не только "пустым", а сразу с наполнением, после первого успешного старта запусти:

```bash
docker compose exec backend yarn db:seed:demo
```

Если демо-пользователи не нужны, этот шаг можно пропустить.

## 5. Обновление после изменений

```bash
git pull
docker compose up -d --build
```

## 6. Полезные команды

Остановить:

```bash
docker compose down
```

Остановить и удалить volume базы:

```bash
docker compose down -v
```

Перезапустить только backend:

```bash
docker compose up -d --build backend
```

## 7. DNS и привязка домена

У регистратора или в DNS-панели домена `lleballex.ru` создай запись:

- тип: `A`
- имя: `itrabota`
- значение: `IP_ТВОЕГО_VPS`

После обновления DNS проверь:

```bash
dig +short itrabota.lleballex.ru
```

Ответ должен вернуть IP твоего VPS.

## 8. Что важно знать

- Сейчас backend использует `TypeORM synchronize: true`, поэтому схема базы создаётся автоматически при старте.
- Для запуска без HTTPS cookie авторизации специально переведены на env-настройку `COOKIE_SECURE=false`.
- Без SSL трафик и cookie идут по обычному HTTP. Для реального production это временный вариант; позже лучше подключить HTTPS и перевести `COOKIE_SECURE=true`.
