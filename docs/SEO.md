# 🔍 SEO Документация

## ✅ Реализованные функции

### 1. Meta Teги
Все страницы автоматически генерируют meta-теги через `generateMetadata`:

- **title** — из SEO-поля или заголовка
- **description** — из SEO-поля или описания
- **keywords** — из SEO-поля
- **canonical** — канонический URL страницы
- **Open Graph** — для превью в соцсетях
- **Twitter Card** — для Twitter

### 2. Schema.org (JSON-LD)

#### 📄 Article (для статей)
```json
{
  "@type": "Article",
  "headline": "SEO-заголовок",
  "description": "SEO-описание",
  "image": "URL картинки",
  "author": { "@type": "Organization", "name": "Phuquoc.Club" },
  "datePublished": "2024-01-01",
  "dateModified": "2024-01-02",
  "publisher": { "@type": "Organization", "name": "Phuquoc.Club" }
}
```

#### 🍞 BreadcrumbList (хлебные крошки)
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Главная",
      "item": "https://site.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Раздел",
      "item": "https://site.com/section"
    }
  ]
}
```

#### 🏠 WebSite (главная страница)
```json
{
  "@type": "WebSite",
  "name": "Фукуок.Гид",
  "url": "https://site.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://site.com/?q={search_term_string}"
  }
}
```

#### 📚 CollectionPage (разделы и подборки)
```json
{
  "@type": "CollectionPage",
  "headline": "Название",
  "description": "Описание",
  "url": "https://site.com/section"
}
```

### 3. Хлебные крошки (Breadcrumbs)
Компонент `<Breadcrumbs />` отображается на всех страницах контента:
- Главная → Раздел → Подборка → Статья
- Использует `aria-label="breadcrumb"` для доступности

### 4. Robots.txt
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Sitemap: https://site.com/sitemap.xml
```

### 5. Sitemap.xml
Автоматически генерируется из:
- Главная страница (priority: 1.0)
- Страница помощи (priority: 0.8)
- Страница подборок (priority: 0.8)
- Разделы (priority: 0.7)
- Подборки (priority: 0.6)
- Статьи (priority: 0.5)

---

## 🛠️ Как использовать

### В Payload CMS

Для каждой статьи/раздела/подборки заполняй SEO-поля:

1. **SEO-заголовок** — до 60 символов
2. **SEO-описание** — до 160 символов
3. **Ключевые слова** — через запятую

### Проверка

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Google Search Console**: отправка sitemap.xml
3. **Open Graph Checker**: https://www.opengraph.xyz/

---

## 📁 Файловая структура

```
src/
├── components/seo/
│   └── StructuredData.tsx    # Компоненты Schema.org
├── lib/seo/
│   └── breadcrumbs.ts        # Утилиты для хлебных крошек
├── app/(frontend)/
│   ├── robots.ts             # Генерация robots.txt
│   ├── sitemap.ts            # Генерация sitemap.xml
│   └── [section]/[subSection]/[article]/page.tsx  # Пример с SEO
```

---

## 🎯 Рекомендации

1. **Уникальные заголовки** — каждая страница должна иметь уникальный title
2. **Описание 150-160 символов** — оптимально для сниппетов в Google
3. **Картинки для OG** — добавь `og:image` для красивых превью
4. **Обновляй sitemap** — при добавлении статей sitemap обновляется автоматически
5. **Мониторь в Search Console** — отслеживай индексацию и ошибки
