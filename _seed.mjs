import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { Client } = require("pg");

const c = new Client({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});
await c.connect();

const existing = await c.query("SELECT COUNT(*) FROM help_page");
if (parseInt(existing.rows[0].count) > 0) {
  await c.query("DELETE FROM help_page_hero_search_tags");
  await c.query("DELETE FROM help_page_urgent_section_cards_locales");
  await c.query("DELETE FROM help_page_urgent_section_cards");
  await c.query("DELETE FROM help_page_what_happened_section_cards_locales");
  await c.query("DELETE FROM help_page_what_happened_section_cards");
  await c.query("DELETE FROM help_page_faq_section_items_locales");
  await c.query("DELETE FROM help_page_faq_section_items");
  await c.query("DELETE FROM help_page_card_block1_cards_locales");
  await c.query("DELETE FROM help_page_card_block1_cards");
  await c.query("DELETE FROM help_page_card_block2_items_locales");
  await c.query("DELETE FROM help_page_card_block2_items");
  await c.query("DELETE FROM help_page_locales");
  await c.query("DELETE FROM help_page");
  console.log("Cleared existing data");
}

const RU = "ru", EN = "en";

await c.query("INSERT INTO help_page (id, status) VALUES (1, 'published')");

await c.query(
  `INSERT INTO help_page_locales (_locale, _parent_id, hero_title, hero_description, hero_intro, hero_search_placeholder, urgent_section_title, what_happened_section_title, faq_section_title, card_block1_title, card_block2_title, card_block2_badge, card_block2_positive_title, card_block2_warning_title) VALUES ($1, 1, 'Помощь на Фукуоке', 'Быстрые ответы и полезные сервисы', 'Такси, аптеки, интернет, магазины, медицина, документы.', 'Что найти: такси, аптека...', 'Срочно нужно', 'Что случилось?', 'Популярные вопросы', 'Полезные сервисы', 'Что проверить перед поездкой', 'Практично', 'Что нужно знать', 'Чего не стоит делать'), ($2, 1, 'Help in Phu Quoc', 'Quick answers and useful services', 'Taxis, pharmacies, internet, shops, healthcare, documents.', 'What to find: taxi, pharmacy...', 'Urgently needed', 'What happened?', 'Popular questions', 'Useful services', 'Pre-trip checklist', 'Practical', 'Dos', 'Donts')`,
  [RU, EN]
);

const tags = [
  { title: "Такси", icon: "bus" }, { title: "Аптека", icon: "lifeBuoy" }, { title: "Интернет", icon: "waves" },
  { title: "Магазины", icon: "map" }, { title: "Медицина", icon: "lifeBuoy" }, { title: "Документы", icon: "fileText" },
  { title: "Безопасность", icon: "lifeBuoy" }, { title: "Связаться", icon: "lifeBuoy" },
];
for (let i = 0; i < tags.length; i++) {
  await c.query("INSERT INTO help_page_hero_search_tags (_order, _parent_id, id, title, icon) VALUES ($1, 1, $2, $3, $4)", [i, `tag_${i}`, tags[i].title, tags[i].icon]);
}

const urgentCards = [
  { icon: "Car", lru: "Такси", dru: "Как заказать машину.", len: "Taxi", den: "How to order a car.", link: "Найти такси", href: "/help/taxi" },
  { icon: "Pill", lru: "Аптека", dru: "Где искать аптеки.", len: "Pharmacy", den: "Where to find pharmacies.", link: "Найти аптеку", href: "/help/pharmacy" },
  { icon: "Wifi", lru: "Интернет", dru: "SIM-карты, eSIM.", len: "Internet", den: "SIM cards, eSIM.", link: "Подключиться", href: "/help/internet" },
  { icon: "ShoppingBag", lru: "Магазины", dru: "Супермаркеты, рынки.", len: "Shops", den: "Supermarkets, markets.", link: "Смотреть", href: "/help/shops" },
];
for (let i = 0; i < urgentCards.length; i++) {
  const id = `urg_${i}`; const cr = urgentCards[i];
  await c.query("INSERT INTO help_page_urgent_section_cards (_order, _parent_id, id, icon, link_label, link_link_type, link_external_url) VALUES ($1, 1, $2, $3, $4, 'external', $5)", [i, id, cr.icon, cr.link, cr.href]);
  await c.query("INSERT INTO help_page_urgent_section_cards_locales (_locale, _parent_id, label, description) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)", [RU, id, cr.lru, cr.dru, EN, id, cr.len, cr.den]);
}

const whatCards = [
  { icon: "FileText", lru: "Потеряли документы", dru: "Что делать.", len: "Lost documents", den: "What to do.", link: "Что делать", href: "/help/documents-lost" },
  { icon: "Stethoscope", lru: "Нужен врач", dru: "Как найти помощь.", len: "Need a doctor", den: "How to find help.", link: "Что делать", href: "/help/doctor" },
  { icon: "WifiOff", lru: "Нет интернета", dru: "Где купить SIM.", len: "No internet", den: "Where to buy SIM.", link: "Что делать", href: "/help/no-internet" },
  { icon: "Plane", lru: "Не можете уехать", dru: "Варианты маршрута.", len: "Can't leave", den: "Route options.", link: "Что делать", href: "/help/cant-leave" },
  { icon: "Wallet", lru: "Обменять деньги", dru: "Где менять.", len: "Exchange money", den: "Where to exchange.", link: "Что делать", href: "/help/exchange" },
  { icon: "Map", lru: "Совет по району", dru: "Где жить.", len: "Area advice", den: "Where to stay.", link: "Что делать", href: "/help/districts" },
];
for (let i = 0; i < whatCards.length; i++) {
  const id = `what_${i}`; const cr = whatCards[i];
  await c.query("INSERT INTO help_page_what_happened_section_cards (_order, _parent_id, id, icon, link_label, link_link_type, link_external_url) VALUES ($1, 1, $2, $3, $4, 'external', $5)", [i, id, cr.icon, cr.link, cr.href]);
  await c.query("INSERT INTO help_page_what_happened_section_cards_locales (_locale, _parent_id, label, description) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)", [RU, id, cr.lru, cr.dru, EN, id, cr.len, cr.den]);
}

const faq = [
  { qr: "Как вызвать такси?", ar: "Используйте Grab.", qe: "How to call a taxi?", ae: "Use Grab." },
  { qr: "Где купить SIM?", ar: "В аэропорту.", qe: "Where to buy SIM?", ae: "At the airport." },
];
for (let i = 0; i < faq.length; i++) {
  const id = `faq_${i}`; const f = faq[i];
  await c.query("INSERT INTO help_page_faq_section_items (_order, _parent_id, id) VALUES ($1, 1, $2)", [i, id]);
  await c.query("INSERT INTO help_page_faq_section_items_locales (_locale, _parent_id, question, answer) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)", [RU, id, f.qr, f.ar, EN, id, f.qe, f.ae]);
}

const svc = [
  { icon: "Car", lru: "Grab", dru: "Такси.", len: "Grab", den: "Taxi app.", link: "Скачать", href: "https://grab.com" },
  { icon: "Map", lru: "Google Maps", dru: "Навигация.", len: "Google Maps", den: "Navigation.", link: "Открыть", href: "https://maps.google.com" },
];
for (let i = 0; i < svc.length; i++) {
  const id = `svc_${i}`; const cr = svc[i];
  await c.query("INSERT INTO help_page_card_block1_cards (_order, _parent_id, id, icon, link_label, link_link_type, link_external_url) VALUES ($1, 1, $2, $3, $4, 'external', $5)", [i, id, cr.icon, cr.link, cr.href]);
  await c.query("INSERT INTO help_page_card_block1_cards_locales (_locale, _parent_id, label, description) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)", [RU, id, cr.lru, cr.dru, EN, id, cr.len, cr.den]);
}

const chk = [
  { tru: "Страховка", ten: "Insurance", type: "positive" },
  { tru: "SIM-карта", ten: "SIM card", type: "warning" },
];
for (let i = 0; i < chk.length; i++) {
  const id = `chk_${i}`; const cr = chk[i];
  await c.query("INSERT INTO help_page_card_block2_items (_order, _parent_id, id, type) VALUES ($1, 1, $2, $3)", [i, id, cr.type]);
  await c.query("INSERT INTO help_page_card_block2_items_locales (_locale, _parent_id, text) VALUES ($1, $2, $3), ($4, $5, $6)", [RU, id, cr.tru, EN, id, cr.ten]);
}

console.log("✅ Re-seeded");
await c.end();
