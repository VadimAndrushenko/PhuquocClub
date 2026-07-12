# 🚀 Деплой на Vercel

## 1. База данных (PostgreSQL)

SQLite **не подходит** для Vercel — данные будут удаляться после каждого деплоя.

### Варианты PostgreSQL:

#### Vercel Postgres (рекомендуется)
1. В панели Vercel: **Storage** → **Create Database** → **Vercel Postgres**
2. Подключи базу к проекту
3. Переменные окружения добавятся автоматически

#### Neon (бесплатно)
1. Зайди на https://neon.tech
2. Создай проект и получи строку подключения
3. Формат: `postgresql://user:password@host.region.aws.neon.tech/mydb`

#### Supabase (бесплатно)
1. Зайди на https://supabase.com
2. Создай проект → **Settings** → **Database**
3. Скопируй **Connection String** (URI mode)

---

## 2. Переменные окружения в Vercel

В панели проекта: **Settings** → **Environment Variables**

| Переменная | Значение |
|------------|----------|
| `NEXT_PUBLIC_SERVER_URL` | `https://phuquocclub.com` (твой домен) |
| `PAYLOAD_SECRET` | Сгенерируй: `openssl rand -hex 32` |
| `DATABASE_URL` | Строка подключения PostgreSQL |

---

## 3. Подключение репозитория

1. Зайди на https://vercel.com
2. **Add New Project**
3. Импортируй GitHub репозиторий **PhuQuocClub**
4. Настрой:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `pnpm run build`
   - **Install Command:** `pnpm install`
5. Добавь переменные окружения (см. выше)
6. **Deploy**

---

## 4. После деплоя

- **Сайт:** `https://phuquocclub.com` (или твой домен Vercel)
- **Admin:** `https://phuquocclub.com/admin`
- **API:** `https://phuquocclub.com/api`

---

## 5. Проверка

- [ ] Сайт загружается без ошибок
- [ ] Admin панель доступна
- [ ] Медиа-файлы загружаются
- [ ] Данные сохраняются в базе
- [ ] Поиск работает

---

## 🔧 Локальная проверка перед деплоем

```bash
# Продакшен билд
pnpm run build

# Проверка билда
pnpm run start
```
