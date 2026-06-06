# 🔑 Настройка переменных окружения для Vercel

## ⚠️ Важно!

Без этих переменных **сборка на Vercel упадёт** с ошибкой подключения к базе данных.

---

## 📋 Переменные окружения

Добавьте в **Vercel Dashboard → Settings → Environment Variables**:

### 🔴 Обязательные

| Variable | Value | Где взять |
|----------|-------|-----------|
| `POSTGRES_URL` | `postgresql://user:password@host:5432/dbname` | Ваш PostgreSQL провайдер |
| `DATABASE_URL` | `postgresql://user:password@host:5432/dbname` | Тот же что и POSTGRES_URL |
| `PAYLOAD_SECRET` | `любой-секретный-ключ` | Сгенерируйте случайную строку |
| `NEXT_PUBLIC_SERVER_URL` | `https://your-app.vercel.app` | Vercel Domain |

### 🟡 Опциональные

| Variable | Value | Где взять |
|----------|-------|-----------|
| `BLOB_READ_WRITE_TOKEN` | `vercel_blob_...` | Vercel Storage |
| `WEBHOOK_SECRET` | `любой-секретный-ключ` | Для webhook CMS |

---

## 🚀 Как добавить переменные

### Способ 1: Через Vercel Dashboard

1. Откройте [vercel.com](https://vercel.com)
2. Выберите ваш проект
3. **Settings → Environment Variables**
4. Нажмите **Add New**
5. Введите имя и значение
6. Выберите окружения (**Production**, **Preview**, **Development**)
7. **Save**

Повторите для всех переменных!

### Способ 2: Через Vercel CLI

```bash
# Логин
vercel login

# Добавить переменные
vercel env add POSTGRES_URL
vercel env add DATABASE_URL
vercel env add PAYLOAD_SECRET
vercel env add NEXT_PUBLIC_SERVER_URL

# Задеплоить
vercel --prod
```

### Способ 3: Через `.env` файл (локально)

```bash
# .env.production
POSTGRES_URL=postgresql://user:password@host:5432/dbname
DATABASE_URL=postgresql://user:password@host:5432/dbname
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=https://your-app.vercel.app
```

⚠️ **Не коммитьте `.env.production` в Git!** Добавьте в `.gitignore`

---

## 📊 Пример значений

```bash
# PostgreSQL (Neon, Supabase, Railway, etc.)
POSTGRES_URL=postgresql://myuser:mypassword@ep-cool-forest-123456.us-east-2.aws.neon.tech/mydb?sslmode=require

DATABASE_URL=postgresql://myuser:mypassword@ep-cool-forest-123456.us-east-2.aws.neon.tech/mydb?sslmode=require

# Payload Secret (любая случайная строка)
PAYLOAD_SECRET=super-secret-key-change-me-12345

# Production URL (ваш домен Vercel)
NEXT_PUBLIC_SERVER_URL=https://phuquoc-club.vercel.app

# Vercel Blob (опционально, для медиа)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

---

## ✅ Проверка после добавления

1. **Vercel Dashboard → Deployments**
2. Нажмите **Redeploy** на последнем деплое
3. Откройте **Build Logs**
4. Убедитесь что нет ошибок `ENOTFOUND` или `cannot connect to Postgres`

---

## 🐛 Troubleshooting

### Ошибка: `getaddrinfo ENOTFOUND host`

**Причина:** Не настроен `POSTGRES_URL` или `DATABASE_URL`

**Решение:**
1. Проверьте что переменные добавлены в Vercel
2. Убедитесь что URL правильный
3. Сделайте Redeploy

### Ошибка: `Missing required environment variable PAYLOAD_SECRET`

**Причина:** Не добавлен `PAYLOAD_SECRET`

**Решение:**
1. Добавьте переменную в Vercel
2. Сделайте Redeploy

### Ошибка: `BLOB_READ_WRITE_TOKEN is required`

**Причина:** Используется Vercel Blob но токен не настроен

**Решение:**
1. Добавьте `BLOB_READ_WRITE_TOKEN` или
2. Отключите Vercel Blob в `payload.config.ts`

---

## 🔒 Безопасность

- ✅ Переменные в Vercel **зашифрованы**
- ✅ Не видны в логах
- ✅ Не попадают в билд
- ⚠️ **Не коммитьте `.env` файлы в Git!**

Добавьте в `.gitignore`:
```
.env
.env.local
.env.production
```

---

## 📝 После настройки

После добавления всех переменных:

```bash
git push origin main
```

Vercel автоматически:
1. ✅ Получит переменные окружения
2. ✅ Подключится к базе данных
3. ✅ Сгенерирует статические страницы
4. ✅ Включит ISR (30 секунд)
