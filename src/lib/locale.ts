export function withLocale(path: string, locale: string): string {
  if (locale === 'ru') return path
  return `/en${path}`
}
