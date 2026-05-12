COMPOSE ?= docker compose
PARALLEL_LIMIT ?= 1
BUILD_ENV ?= COMPOSE_PARALLEL_LIMIT=$(PARALLEL_LIMIT)

.PHONY: build up down restart logs ps seed backend-build backend-up backend-restart frontend-build frontend-up frontend-restart

build:
	$(BUILD_ENV) $(COMPOSE) build --progress=plain

up:
	$(BUILD_ENV) $(COMPOSE) build --progress=plain
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart: down up

logs:
	$(COMPOSE) logs -f nginx backend frontend postgres

ps:
	$(COMPOSE) ps

seed:
	$(COMPOSE) exec backend sh -lc 'corepack enable && yarn db:seed:demo'

backend-build:
	$(COMPOSE) build backend --progress=plain

backend-up:
	$(COMPOSE) up -d backend

backend-restart:
	$(COMPOSE) up -d --build backend

frontend-build:
	$(COMPOSE) build frontend --progress=plain

frontend-up:
	$(COMPOSE) up -d frontend nginx

frontend-restart:
	$(COMPOSE) up -d --build frontend nginx
