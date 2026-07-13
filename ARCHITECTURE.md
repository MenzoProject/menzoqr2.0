# MENZO QR v2.0 — Этап 1: Архитектура проекта

**Тип продукта:** мультитенантный SaaS
**Backend:** Laravel 12 (PHP 8.4+), PostgreSQL, Sanctum
**Frontend:** Next.js (App Router), TypeScript, Tailwind, shadcn/ui
**Оплата:** наличные/на месте + онлайн-эквайринг (провайдер подключается позже через отдельный PaymentGateway-слой)

---

## 1. Общая архитектура

```
┌─────────────────────┐        ┌──────────────────────┐
│   Next.js Frontend   │◄──────►│   Laravel API (REST)  │
│  (Admin + Public)    │  HTTPS │   Sanctum + Policies  │
└─────────────────────┘        └──────────┬────────────┘
                                            │
                     ┌──────────────────────┼───────────────────────┐
                     │                      │                       │
             ┌───────▼──────┐      ┌────────▼────────┐     ┌────────▼────────┐
             │  PostgreSQL   │      │  Queue (Redis)   │     │  NotificationBus │
             │  (мультитен.  │      │  Jobs / Events   │     │  Telegram/…      │
             │  по tenant_id)│      └──────────────────┘     └──────────────────┘
             └───────────────┘
```

**Мультитенантность:** row-based (единая БД, каждая таблица, зависящая от кафе, содержит `cafe_id`, кафе привязаны к `tenant_id` владельца). Это проще в поддержке, чем схемы-на-тенанта, и достаточно для текущего масштаба. Изоляция обеспечивается через **глобальный Scope** в Eloquent-моделях + Policies.

**Ключевой принцип:** вся бизнес-логика — в Service Layer, контроллеры — тонкие. Уведомления (Telegram, а в будущем WhatsApp/Push/Email/SMS) идут через единый `NotificationDispatcher`, который вызывает нужный `Channel`-класс, реализующий общий интерфейс.

---

## 2. Структура папок — Backend (Laravel)

```
app/
├── Console/
├── Events/
│   ├── OrderCreated.php
│   ├── OrderStatusChanged.php
│   └── TelegramAccountLinked.php
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── Auth/AuthController.php
│   │   │   ├── Owner/CafeController.php
│   │   │   ├── Owner/CategoryController.php
│   │   │   ├── Owner/DishController.php
│   │   │   ├── Owner/QrCodeController.php
│   │   │   ├── Owner/OrderController.php
│   │   │   ├── Owner/StaffController.php
│   │   │   ├── Owner/TelegramController.php
│   │   │   ├── Owner/SettingsController.php
│   │   │   ├── Public/PublicMenuController.php
│   │   │   ├── Public/PublicOrderController.php
│   │   │   └── Webhooks/TelegramWebhookController.php
│   ├── Middleware/
│   │   ├── EnsureCafeOwnership.php
│   │   └── ResolveTenant.php
│   ├── Requests/
│   │   ├── Auth/…
│   │   ├── Cafe/StoreCafeRequest.php
│   │   ├── Dish/StoreDishRequest.php
│   │   ├── Order/StorePublicOrderRequest.php
│   │   └── Telegram/LinkTelegramRequest.php
│   └── Resources/
│       ├── CafeResource.php
│       ├── CategoryResource.php
│       ├── DishResource.php
│       ├── OrderResource.php
│       ├── QrCodeResource.php
│       └── UserResource.php
├── Models/
│   ├── User.php
│   ├── Cafe.php
│   ├── Category.php
│   ├── Dish.php
│   ├── DishAddon.php
│   ├── DishVariant.php
│   ├── Table.php
│   ├── QrCode.php
│   ├── Order.php
│   ├── OrderItem.php
│   ├── OrderItemAddon.php
│   ├── Payment.php
│   ├── TelegramAccount.php
│   └── Role.php
├── Policies/
│   ├── CafePolicy.php
│   ├── DishPolicy.php
│   ├── OrderPolicy.php
│   └── UserPolicy.php
├── Services/
│   ├── Cafe/CafeService.php
│   ├── Menu/CategoryService.php
│   ├── Menu/DishService.php
│   ├── QrCode/QrCodeService.php
│   ├── Order/OrderService.php
│   ├── Order/OrderStatusService.php
│   ├── Payment/PaymentGatewayInterface.php
│   ├── Payment/CashPaymentHandler.php
│   ├── Notification/NotificationDispatcher.php
│   ├── Notification/Contracts/NotificationChannel.php
│   ├── Notification/Channels/TelegramChannel.php
│   └── Telegram/TelegramService.php
├── Repositories/
│   ├── Contracts/CafeRepositoryInterface.php
│   ├── Contracts/DishRepositoryInterface.php
│   ├── Contracts/OrderRepositoryInterface.php
│   ├── Eloquent/CafeRepository.php
│   ├── Eloquent/DishRepository.php
│   └── Eloquent/OrderRepository.php
├── DTO/
│   ├── CafeData.php
│   ├── DishData.php
│   ├── OrderData.php
│   └── TelegramMessageData.php
├── Jobs/
│   ├── SendOrderNotificationJob.php
│   └── GenerateQrCodeImageJob.php
├── Notifications/
│   └── OwnerOrderNotification.php
└── Enums/
    ├── OrderStatus.php
    ├── OrderType.php
    ├── UserRole.php
    └── TelegramConnectionStatus.php
```

---

## 3. Структура папок — Frontend (Next.js App Router)

```
src/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (auth)/register/page.tsx
│   ├── (owner)/
│   │   ├── dashboard/page.tsx
│   │   ├── cafes/[cafeId]/menu/page.tsx
│   │   ├── cafes/[cafeId]/categories/page.tsx
│   │   ├── cafes/[cafeId]/dishes/page.tsx
│   │   ├── cafes/[cafeId]/qr-codes/page.tsx
│   │   ├── cafes/[cafeId]/orders/page.tsx
│   │   ├── cafes/[cafeId]/staff/page.tsx
│   │   ├── cafes/[cafeId]/telegram/page.tsx
│   │   └── cafes/[cafeId]/settings/page.tsx
│   ├── (public)/
│   │   └── menu/[cafeSlug]/[tableCode]?/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/            (shadcn/ui примитивы)
│   ├── menu/
│   ├── orders/
│   ├── qr/
│   └── shared/
├── features/
│   ├── auth/
│   ├── cafes/
│   ├── dishes/
│   ├── orders/
│   └── telegram/
├── lib/
│   ├── api/client.ts
│   ├── api/endpoints.ts
│   └── validation/ (zod-схемы)
├── hooks/
└── types/
```

---

## 4. Структура базы данных (PostgreSQL)

| Таблица | Ключевые поля | Назначение |
|---|---|---|
| `users` | id, name, email, phone, password, role_id, cafe_id (nullable для owner с несколькими кафе — через pivot) | Владельцы и персонал |
| `roles` | id, name (`owner`, `manager`, `staff`) | Роли доступа |
| `cafe_user` | cafe_id, user_id, role_id | Пивот: доступ пользователей к кафе (мультикафе на владельца) |
| `cafes` | id, owner_id, name, slug, logo, address, phone, is_active, currency | Заведения |
| `categories` | id, cafe_id, name, sort_order, is_active | Категории меню |
| `dishes` | id, category_id, name, description, price, image, is_active, sort_order | Блюда |
| `dish_variants` | id, dish_id, name, price_modifier | Варианты (размер, объём) |
| `dish_addons` | id, dish_id, name, price | Дополнения |
| `tables` | id, cafe_id, name/number, qr_code_id | Столы заведения |
| `qr_codes` | id, cafe_id, table_id (nullable), type (`takeaway`/`table`), code (uuid), image_path, scans_count | QR-коды |
| `orders` | id, cafe_id, table_id (nullable), order_number, type (enum), status (enum), customer_name, customer_phone, comment, total_amount, payment_method, created_at | Заказы |
| `order_items` | id, order_id, dish_id, dish_variant_id, quantity, unit_price, comment | Позиции заказа |
| `order_item_addons` | id, order_item_id, dish_addon_id, price | Дополнения к позиции |
| `order_status_histories` | id, order_id, status, changed_by, created_at | История статусов |
| `payments` | id, order_id, provider, status, amount, transaction_id, paid_at | Онлайн/офлайн платежи |
| `telegram_accounts` | id, cafe_id, chat_id, status (enum: pending/connected/disconnected), connected_at | Привязка Telegram владельца |
| `notification_logs` | id, order_id, channel, status, payload, sent_at | Лог отправленных уведомлений (для будущих каналов) |

Все таблицы, привязанные к кафе, содержат `cafe_id` с foreign key + индексом для изоляции тенантов.

---

## 5. Структура API (REST, префикс `/api/v1`)

**Auth**
`POST /auth/register` · `POST /auth/login` · `POST /auth/logout` · `GET /auth/me`

**Owner — управление**
`GET|POST /owner/cafes` · `GET|PATCH|DELETE /owner/cafes/{cafe}`
`GET|POST /owner/cafes/{cafe}/categories` · `PATCH|DELETE /owner/categories/{category}`
`GET|POST /owner/cafes/{cafe}/dishes` · `PATCH|DELETE /owner/dishes/{dish}`
`GET|POST /owner/cafes/{cafe}/qr-codes` · `DELETE /owner/qr-codes/{qrCode}`
`GET /owner/cafes/{cafe}/orders` · `PATCH /owner/orders/{order}/status`
`GET|POST /owner/cafes/{cafe}/staff` · `PATCH|DELETE /owner/staff/{user}`
`GET /owner/cafes/{cafe}/telegram` · `POST /owner/cafes/{cafe}/telegram/connect`
`GET|PATCH /owner/cafes/{cafe}/settings`

**Public (без авторизации, по slug кафе)**
`GET /public/menu/{cafeSlug}` — меню + категории + блюда
`POST /public/menu/{cafeSlug}/orders` — оформление заказа (самовывоз/стол)
`GET /public/orders/{orderNumber}/status` — статус для клиента

**Webhooks**
`POST /webhooks/telegram` — приём callback от Telegram-бота (inline-кнопки, привязка chat_id)

---

## 6. Роли и доступ

| Роль | Доступ |
|---|---|
| **Owner** | Полный доступ ко всем своим кафе, персоналу, настройкам, Telegram |
| **Manager** | Управление меню, заказами, QR-кодами конкретного кафе (без удаления кафе/персонала) |
| **Staff** | Только просмотр и смена статуса заказов |

Реализация — через `roles`/`cafe_user` + Laravel Policies (`CafePolicy`, `OrderPolicy` и т.д.), проверяющие принадлежность к кафе.

---

## 7. Зависимости

**Backend (composer.json)**
- `laravel/framework: ^12.0`
- `laravel/sanctum`
- `spatie/laravel-data` (DTO)
- `spatie/laravel-query-builder`
- `simplesoftwareio/simple-qrcode` (генерация QR)
- `guzzlehttp/guzzle` (Telegram Bot API)
- `laravel/horizon` (мониторинг очередей)

**Frontend (package.json)**
- `next`, `react`, `typescript`
- `tailwindcss`, `shadcn/ui`
- `framer-motion`
- `@tanstack/react-query`
- `react-hook-form`, `zod`, `@hookform/resolvers`
- `lucide-react`
- `axios`

---

## Итог Этапа 1

Определены: общая архитектура (мультитенант, row-based изоляция), структура папок backend/frontend, схема БД, REST API, роли доступа и зависимости. Архитектура заранее рассчитана на расширение каналов уведомлений (Telegram → WhatsApp/Push/Email/SMS) и подключение онлайн-эквайринга через `PaymentGatewayInterface` без изменения бизнес-логики заказов.

Жду сообщения **«Продолжай»** для перехода к Этапу 2 (Backend).
