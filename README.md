,

# MENZO QR v2.0

Полный проект — SaaS для управления QR-меню, заказами и Telegram-уведомлениями кафе и ресторанов.

## Структура репозитория

```
menzo-qr/
├── backend/    Laravel 12 / PHP 8.4+ — REST API (полноценный, самодостаточный проект)
├── frontend/   Next.js 15 / TypeScript — панель владельца + публичное меню
├── ARCHITECTURE.md      Архитектура, схема БД, структура API (Этап 1)
└── AUDIT-STAGE-7.md     Отчёт аудита production-ready (Этап 7)
```

Backend и frontend — два независимых проекта в одном репозитории (монорепо), каждый со своим `README.md` с подробной инструкцией по установке. Они не имеют общих зависимостей и запускаются отдельно.

## Быстрый старт

### 1. Backend (Laravel API)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# заполните .env: БД (PostgreSQL), Redis
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Подробности, включая настройку очередей и Telegram-бота — в `backend/README.md`.

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
# укажите NEXT_PUBLIC_API_URL, если backend не на localhost:8000
npm run dev
```

Подробности по дизайн-системе и структуре экранов — в `frontend/README.md`.

### 3. Откройте в VS Code

```bash
code menzo-qr
```

Рекомендуется открывать `backend/` и `frontend/` как отдельные workspace-папки (либо через мультирутовый workspace VS Code), так как это два независимых проекта с разными языками и линтерами.

## Порядок запуска для полноценной работы

1. Поднимите PostgreSQL и Redis.
2. Запустите backend (`php artisan serve`) — API на `http://localhost:8000`.
3. Запустите обработчик очереди (`php artisan queue:work`) — без него не будут отправляться уведомления в Telegram и генерироваться QR-коды.
4. Запустите frontend (`npm run dev`) — панель на `http://localhost:3000`.
5. Зарегистрируйте владельца через `/register`, создайте кафе, категории и блюда.
6. Настройте Telegram-бота (см. `backend/README.md`, раздел «Telegram Bot»), если нужны уведомления о заказах.

## Документация по этапам

Проект разрабатывался поэтапно; история решений и находок аудита сохранена в `ARCHITECTURE.md` (Этап 1) и `AUDIT-STAGE-7.md` (Этап 7). Более подробные примечания по каждому этапу — в README соответствующей папки (`backend/README.md`, `frontend/README.md`).
