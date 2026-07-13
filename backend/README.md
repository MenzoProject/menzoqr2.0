# MENZO QR v2.0 — Backend

Полноценный, готовый к запуску проект Laravel 12 / PHP 8.4+ — со всей стандартной структурой (`artisan`, `public/`, `storage/`, `resources/`, `bootstrap/`, `config/`, `tests/`). Ничего накладывать на другой каркас не нужно — это самодостаточный проект.

## Установка

1. Установите зависимости:
   ```bash
   composer install
   ```
2. Скопируйте `.env` и сгенерируйте ключ приложения:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
3. Заполните в `.env` настройки БД (PostgreSQL) и Redis. Оставьте `TELEGRAM_BOT_TOKEN` и `TELEGRAM_WEBHOOK_SECRET` пустыми, если ещё не дошли до Telegram-интеграции — см. раздел «Telegram Bot» ниже.
4. Создайте базу данных (например, `createdb menzo_qr`) и накатите миграции с сидами:
   ```bash
   php artisan migrate --seed
   php artisan storage:link
   ```
5. Запустите сервер разработки:
   ```bash
   php artisan serve
   ```
   API будет доступно на `http://localhost:8000/api/v1`.

6. **Запустите обработчик очереди** — без него уведомления в Telegram никогда не отправятся, так как `SendOrderNotificationJob` и `SyncTelegramMessageOnStatusChange` — асинхронные (`ShouldQueue`) и просто копятся в таблице `jobs`, ничего не делая, пока не запущен воркер:
   ```bash
   php artisan queue:work --tries=3
   ```
   В production используйте Supervisor (или `laravel/horizon`, уже включён в зависимости) для постоянной работы воркера, а не разовый запуск команды.

   Генерация QR-кода — **синхронная** (`QrCodeService`, вызывается напрямую из `QrCodeController::store()`), она не зависит от воркера очереди и работает, даже если его никто не запустил.

## Деплой на Railway (backend) + Vercel (frontend) — чеклист

Если после деплоя QR-коды/фото блюд не отображаются или нет публичного меню, почти всегда причина — одно из следующего:

1. **Переменные окружения не заполнены в панели Railway.** `.env`, который лежит в репозитории, — только для локальной разработки и указывает на `localhost`. В Railway (Variables) обязательно задайте:
   - `APP_URL` — публичный домен backend'а (например `https://menzo-backend.up.railway.app`), **без слэша на конце**. От него зависят все `image_url` (фото блюд, лого, QR-коды).
   - `APP_FRONTEND_URL` и `FRONTEND_URL` — публичный домен Vercel-фронтенда. От первого зависит, куда ведёт QR-код; от второго — CORS.
   - `NEXT_PUBLIC_API_URL` (в Vercel, для фронтенда) — публичный домен backend'а + `/api/v1`.
   - `APP_ENV=production`, `APP_DEBUG=false`.
2. **Файловое хранилище на Railway эфемерно.** Без подключённого Volume (или без переключения на S3/R2 через `FILESYSTEM_DISK=s3`) загруженные фото и QR-коды пропадают при каждом передеплое. См. комментарий в `config/filesystems.php`.
3. **`storage:link`.** Railway (Railpack) создаёт эту симлинку автоматически при деплое Laravel-проекта; `AppServiceProvider::boot()` также подстраховывает это на случай другого способа деплоя (Docker, другой PaaS).
4. Проверьте `php artisan config:cache` не закешировал старые локальные значения — после смены переменных в Railway передеплойте сервис (Railway делает `config:cache` в рамках билда автоматически).

## Что реализовано в этом этапе

- Полная схема БД (18 миграций): роли, пользователи, кафе, персонал, категории, блюда с вариантами и допами, столы, QR-коды, заказы со статусами и историей, платежи, привязка Telegram, лог уведомлений.
- Модели Eloquent со всеми связями и enum-кастами.
- Service Layer + Repository Pattern + DTO для Cafe, Category, Dish, Order.
- Machine состояний заказа (`OrderStatus::canTransitionTo()`), защищённая на уровне сервиса.
- Policies для разграничения доступа Owner / Manager / Staff.
- REST API (Sanctum): авторизация, управление кафе/меню/QR/заказами/персоналом/настройками, публичное меню и оформление заказа.
- Архитектурно готовый `NotificationDispatcher` + `TelegramChannel`, реализующий интерфейс `NotificationChannel` — на Этапе 6 останется только подключить реальный Bot Token и вебхук; для WhatsApp/Push/Email/SMS в будущем достаточно добавить новый класс-канал, не трогая `OrderService`.
- Jobs для асинхронной отправки уведомлений и генерации QR-кода в очереди.

## Что осознанно не реализовано на этом этапе

- Обработка Telegram-вебхука (прием `/start`, callback-кнопок) — Этап 6, так как требует реального Bot Token от вас.
- Реальный провайдер онлайн-эквайринга — архитектура (`payments`, `payment_method`) заложена, интеграция с конкретным провайдером будет добавлена, когда вы укажете, каким пользоваться.
- Frontend — Этап 3.

Жду **«Продолжай»** для перехода к Этапу 3 (Frontend).

---

## Обновления из Этапа 4 (варианты/допы блюда)

- `app/Services/Menu/DishService.php` — `syncVariants()`, `syncAddons()`.
- `app/Http/Requests/Dish/{Store,Update}DishRequest.php` — валидация вложенных `variants[]`/`addons[]`.
- `app/Http/Controllers/Api/Owner/DishController.php` — вызывает синхронизацию после сохранения блюда.

## Обновления из Этапа 5 (публичное меню)

- **Новые миграции**: `2025_01_02_000001_add_tags_and_availability_to_dishes_table.php` (поля `dishes.is_available`, `dishes.tags`), `2025_01_02_000002_make_orders_customer_phone_nullable.php` (телефон необязателен для заказа в заведении).
- `app/Enums/DishTag.php` — допустимые бейджи блюда (new/hit/spicy/halal/vegetarian).
- `app/Models/Dish.php`, `app/DTO/DishData.php`, `app/Http/Resources/DishResource.php`, `app/Http/Requests/Dish/{Store,Update}DishRequest.php` — поддержка `is_available`/`tags`.
- `app/DTO/OrderData.php`, `app/Http/Requests/Order/StorePublicOrderRequest.php` — `customer_phone` обязателен только при `type=takeaway`.
- `app/Services/Notification/Channels/TelegramChannel.php` — не выводит строку «Телефон» в уведомлении, если он не указан.
- `app/Services/QrCode/QrCodeService.php` — публичная ссылка QR стола теперь содержит `table_id` и `table_number`.

Запустите `php artisan migrate` после обновления файлов, чтобы применить новые миграции.

---

## Этап 6: Telegram Bot

### Что реализовано

- **`app/Http/Controllers/Api/Webhooks/TelegramWebhookController.php`** — принимает вебхук от Telegram:
  - сообщение `/start <код>` — привязывает чат к кафе (ищет `TelegramAccount` по `link_token`, проставляет `chat_id`, статус `connected`);
  - `callback_query` от inline-кнопок (`order:{id}:{status}`) — меняет статус заказа через `OrderStatusService`, отвечает на callback, проверяет, что чат действительно привязан к кафе этого заказа.
- **`app/Services/Telegram/OrderKeyboardBuilder.php`** — единая логика построения inline-клавиатуры под текущий статус заказа (переиспользуется и при первом уведомлении, и при последующих обновлениях).
- **`app/Listeners/SyncTelegramMessageOnStatusChange.php`** — при любом изменении статуса заказа (из панели владельца **или** из чата) редактирует исходное Telegram-сообщение: обновляет текст статуса и клавиатуру. Это значит, что сообщение в Telegram всегда отражает актуальный статус, откуда бы его ни поменяли.
- **`app/Console/Commands/TelegramWebhookCommand.php`** — команда `php artisan telegram:webhook set --url=...` / `telegram:webhook delete` для регистрации/удаления вебхука.
- Секрет вебхука (`TELEGRAM_WEBHOOK_SECRET`) проверяется через заголовок `X-Telegram-Bot-Api-Secret-Token`, чтобы никто посторонний не мог слать боту фиктивные события.

### Что нужно сделать вам

1. Добавьте в `.env` (не в `.env.example`, не коммитьте в git):
   ```
   TELEGRAM_BOT_TOKEN=ваш_токен_бота
   TELEGRAM_WEBHOOK_SECRET=любая-случайная-строка
   ```
   Сгенерировать случайную строку: `php -r "echo bin2hex(random_bytes(32));"`

2. Примените миграции: `php artisan migrate`

3. Задеплойте backend на HTTPS-домен (Telegram не примет вебхук на http:// или localhost без туннеля).

4. Зарегистрируйте вебхук:
   ```
   php artisan telegram:webhook set --url=https://ваш-домен.ru/api/webhooks/telegram
   ```

5. В панели владельца откройте раздел «Telegram» → «Получить код» → отправьте показанную команду `/start <код>` вашему боту в Telegram. Чат привяжется автоматически, и уведомления о заказах начнут приходить с кнопками управления статусом.

Никакие Bot Token, Chat ID или другие секреты не были придуманы — всё, что нужно ввести, явно помечено в `.env.example` и в этом README.
