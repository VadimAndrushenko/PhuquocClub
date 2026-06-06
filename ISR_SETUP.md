# 🔥 ISR Настройка (Incremental Static Regeneration)

## 📋 Обзор

Все страницы теперь используют **статическую генерацию** с автоматическим обновлением каждые **30 секунд** через ISR.

## ⚙️ Как это работает

1. **При первом запросе** → Генерируется статическая страница
2. **Каждые 30 секунд** → Next.js автоматически обновляет кэш в фоне
3. **При изменениях в CMS** → Webhook触发ет мгновенную ревалидацию
4. **Search Input** → Автообновление данных каждые 30 секунд на клиенте

## 📁 Обновлённые файлы

### Страницы (все с ISR)
- `src/app/(frontend)/page.tsx` - Главная
- `src/app/(frontend)/layout.tsx` - Layout
- `src/app/(frontend)/(content)/[section]/page.tsx` - Разделы
- `src/app/(frontend)/(content)/[section]/[subSection]/page.tsx` - Подборки
- `src/app/(frontend)/(content)/[section]/[subSection]/[article]/page.tsx` - Статьи
- `src/app/(frontend)/collections/page.tsx` - Подборки (все)
- `src/app/(frontend)/help/page.tsx` - Помощь

### API Endpoints
- `src/app/api/revalidate-search/route.ts` - Ручная ревалидация через `revalidatePath`
- `src/app/api/webhook/revalidate/route.ts` - Webhook для Payload CMS
- `src/app/api/articles/route.ts` - API статей с ISR

### Данные и Контекст
- `src/lib/getSearchData.ts` - Данные поиска с кэшем 30с
- `src/contexts/SearchContext.tsx` - Автообновление поиска
- `src/lib/payload/payload.ts` - Добавлена `getCollectionsPage`

## 🚀 Развёртывание

### Vercel (рекомендуется)

ISR работает **автоматически** на Vercel. Ничего дополнительно настраивать не нужно.

```bash
# Деплой
vercel deploy --prod
```

### Docker / Свой сервер

Для работы ISR нужен следующий конфиг:

```bash
# .env.production
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
REVALIDATE_SECRET=your-secret-key-change-me
WEBHOOK_SECRET=your-webhook-secret-change-me
```

## 🔁 Автоматическое обновление

### 1. ISR (каждые 30 секунд)
Next.js автоматически обновляет страницы в фоне при запросах.

### 2. Webhook (мгновенно при изменениях)
Настройте в Payload CMS:
- **URL**: `https://your-domain.com/api/webhook/revalidate`
- **Метод**: POST
- **Header**: `x-webhook-secret: your-webhook-secret-change-me`
- **Collections**: Articles, sections, subsections, media
- **Trigger**: After Change

### 3. Ручная ревалидация
```bash
# Через API
curl "https://your-domain.com/api/revalidate-search?secret=your-secret-key"

# Или с указанием путей
curl -X POST "https://your-domain.com/api/revalidate-search?secret=your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"paths": ["/", "/collections"], "tags": ["articles"]}'
```

## 🔍 Search Input

Поиск теперь:
- ✅ **Статичный** - данные загружаются на сервере
- ✅ **Автообновление** - каждые 30 секунд на клиенте
- ✅ **Кэширование** - умный кэш с TTL 30 секунд

## 📊 Cache-Control Headers

Все страницы возвращают:
```
Cache-Control: public, s-maxage=30, stale-while-revalidate=60
```

- `s-maxage=30` - CDN кэширует на 30 секунд
- `stale-while-revalidate=60` - Показывать старое пока обновляется (ещё 60с)

## 🛠️ Переменные окружения

```bash
# .env.production
NEXT_PUBLIC_SERVER_URL=https://your-domain.com

# Для API ревалидации
REVALIDATE_SECRET=your-secret-key-change-me
WEBHOOK_SECRET=your-webhook-secret-change-me

# Payload CMS
PAYLOAD_SECRET=your-payload-secret
DATABASE_URL=postgresql://...
POSTGRES_URL=postgresql://...

# Vercel Blob (опционально)
BLOB_READ_WRITE_TOKEN=...
```

## ✅ Проверка работы

1. Откройте любую страницу
2. Посмотрите заголовок ответа:
   ```
   x-next-cache-tags: ...
   cache-control: public, s-maxage=30, stale-while-revalidate=60
   ```
3. Измените данные в Payload CMS
4. Через 30 секунд страница обновится автоматически

## 🎯 Преимущества

- ⚡ **Быстрая загрузка** - статические страницы
- 🔄 **Автообновление** - без ручного деплоя
- 💰 **Дешевле** - меньше запросов к базе
- 📈 **Масштабируемость** - CDN кэширование
- 🔍 **SEO** - статический контент индексируется лучше

## 🐛 Troubleshooting

### Страницы не обновляются
1. Проверьте `REVALIDATE_SECRET` в .env
2. Проверьте логи API ревалидации
3. Убедитесь что `revalidate = 30` на страницах

### Search Input не работает
1. Проверьте `NEXT_PUBLIC_SERVER_URL`
2. Проверьте консоль на ошибки fetch
3. Очистите кэш браузера

### Ошибки ISR на Vercel
1. Проверьте `vercel.json` (если есть)
2. Убедитесь что используется Next.js 14+
3. Проверьте лимиты Vercel
