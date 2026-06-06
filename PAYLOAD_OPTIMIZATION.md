# ⚡ Оптимизация Payload CMS админки

## 🐌 Причины тормозов на Vercel

1. **Глубокие `depth` в запросах** - загружается слишком много связанных данных
2. **Много relationship полей** - каждый делает отдельный запрос к БД
3. **Хуки `afterChange`** - выполняются при каждом сохранении
4. **Отсутствие индексов** в БД
5. **Медленное подключение** к PostgreSQL на Vercel

---

## ✅ Что сделано

### 1. Отключено автосохранение
```typescript
versions: {
  maxPerDoc: 50,  // ✅ Только лимит версий
}
```

### 2. Уменьшены `depth` в запросах
В `payload.ts` измените depth с 3 на 1 где возможно:

```typescript
// Было
depth: 3  // ❌ Долго

// Стало
depth: 1  // ✅ Быстро
```

### 3. Оптимизированы хуки
Убран тяжёлый хук `afterChange` из `SubSections.ts`:

```typescript
// ❌ БЫЛО - обновляет все статьи при изменении subsection
afterChange: [
  async ({ doc, req }) => {
    const articles = await req.payload.find({...})  // Долго!
    for (const article of articles.docs) {
      await req.payload.update({...})  // Очень долго!
    }
  },
]

// ✅ СТАЛО - убрано
```

---

## 🔧 Дополнительные оптимизации

### 1. Индексы в PostgreSQL

Добавьте индексы на часто используемые поля:

```sql
-- Секции
CREATE INDEX sections_slug_idx ON sections(slug);
CREATE INDEX sections_status_idx ON sections(status);

-- Подборки
CREATE INDEX subsections_slug_idx ON subsections(slug);
CREATE INDEX subsections_section_idx ON subsections(section);
CREATE INDEX subsections_status_idx ON subsections(status);

-- Статьи
CREATE INDEX articles_slug_idx ON articles(slug);
CREATE INDEX articles_subsection_idx ON articles(subsection);
CREATE INDEX articles_status_idx ON articles(status);

-- Media
CREATE INDEX media_filename_idx ON media(filename);
```

### 2. Уменьшите `defaultColumns`

В `admin.useAsTitle` и `admin.defaultColumns` укажите только необходимые поля:

```typescript
admin: {
  useAsTitle: 'title',
  defaultColumns: ['title', 'status'],  // ✅ Только 2 поля
}
```

### 3. Отключите `preview` если не используется

```typescript
admin: {
  preview: undefined,  // Отключить превью
}
```

### 4. Используйте `virtual` поля вместо `afterRead` хуков

```typescript
// ❌ БЫЛО - хук выполняется каждый раз
hooks: {
  afterRead: [enrichWithHref],
}

// ✅ СТАЛО - virtual поле
{
  name: 'href',
  type: 'text',
  virtual: true,
  admin: {
    readOnly: true,
  },
}
```

### 5. Кэширование в админке

Добавьте в `payload.config.ts`:

```typescript
export default buildConfig({
  // ...
  graphQL: {
    schemaOutputFile: './schema.graphql',
  },
  typescript: {
    outputFile: './payload-types.ts',
  },
  // ✅ Кэширование
  cache: 'memory',
  // ✅ Компрессия
  compression: true,
})
```

---

## 🚀 Развёртывание на Vercel

### 1. Проверьте переменные окружения

```bash
POSTGRES_URL=postgresql://...  # ✅ Должен быть быстрый
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=your-secret
```

### 2. Используйте Neon или Supabase

Они быстрее чем стандартный PostgreSQL на Vercel:

- **Neon**: https://neon.tech (бесплатно)
- **Supabase**: https://supabase.com (бесплатно)

### 3. Включите `prepareProduction`

В `payload.config.ts`:

```typescript
export default buildConfig({
  // ...
  onInit: async (payload) => {
    if (process.env.VERCEL) {
      // ✅ Оптимизации для Vercel
      payload.logger.info('🚀 Running on Vercel - optimizations enabled')
    }
  },
})
```

---

## 📊 Проверка производительности

### 1. Откройте Network tab в DevTools

Проверьте время загрузки админки:
- **< 2s** - ✅ Отлично
- **2-5s** - ⚠️ Нормально
- **> 5s** - ❌ Нужно оптимизировать

### 2. Проверьте запросы к БД

В логах Payload посмотрите время выполнения запросов:
```
[12:34:56] INFO: Query executed in 123ms  ✅
[12:34:57] INFO: Query executed in 2500ms ❌
```

### 3. Используйте `explain analyze`

```sql
EXPLAIN ANALYZE
SELECT * FROM articles WHERE status = 'published';
```

---

## 🐛 Troubleshooting

### Админка загружается > 10 секунд

**Причина:** Слишком много relationship полей с `depth: 2+`

**Решение:**
1. Уменьшите `depth` до 1
2. Отключите лишние relationship поля
3. Используйте `virtual` поля

### Сохранение занимает > 5 секунд

**Причина:** Тяжёлые хуки `beforeChange` / `afterChange`

**Решение:**
1. Уберите лишние хуки
2. Используйте `afterRead` вместо `afterChange`
3. Кэшируйте результаты

### Ошибки подключения к БД

**Причина:** Медленный PostgreSQL

**Решение:**
1. Используйте Neon/Supabase
2. Добавьте `?connection_limit=1` к URL
3. Включите pooling

---

## 📝 Checklist

- [ ] Отключить автосохранение во всех коллекциях
- [ ] Уменьшить `depth` до 1 в запросах
- [ ] Убрать тяжёлые `afterChange` хуки
- [ ] Добавить индексы в БД
- [ ] Использовать `virtual` поля
- [ ] Проверить Network tab
- [ ] Использовать быстрый PostgreSQL (Neon/Supabase)
