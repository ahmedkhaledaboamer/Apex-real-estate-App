import { ARTICLE_DETAILS } from '@/mocks/insights'
import type { ArticleDetail } from '@/types'

/* Same logic as website/src/features/insights/components/helpers.ts (ported: website feature components are not importable here). */

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export function articleTime(a: Pick<ArticleDetail, 'date'>) {
  const [d, m, y] = a.date.split(' ')
  return Date.UTC(Number(y), MONTHS.indexOf(m.slice(0, 3).toLowerCase()), Number(d))
}

/** Newest first. */
export const ARTICLES_BY_DATE: ArticleDetail[] = [...ARTICLE_DETAILS].sort((a, b) => articleTime(b) - articleTime(a))

export function relatedArticles(current: ArticleDetail, count = 3) {
  const rest = ARTICLES_BY_DATE.filter((a) => a.slug !== current.slug)
  const same = rest.filter((a) => a.category === current.category)
  const others = rest.filter((a) => a.category !== current.category)
  return [...same, ...others].slice(0, count)
}

export function adjacentArticles(current: ArticleDetail) {
  const i = ARTICLES_BY_DATE.findIndex((a) => a.slug === current.slug)
  return { older: ARTICLES_BY_DATE[i + 1], newer: i > 0 ? ARTICLES_BY_DATE[i - 1] : undefined }
}

export const articleHref = (a: Pick<ArticleDetail, 'slug'>) => `/article/${a.slug}` as const
export const articleWebUrl = (a: Pick<ArticleDetail, 'slug'>) => `https://apexaura.ae/insights/${a.slug}`
