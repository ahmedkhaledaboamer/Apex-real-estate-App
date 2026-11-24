/**
 * Native image registry — overrides the website's `@/assets/images` (see metro.config.js), so the shared
 * mock data (properties, communities, agents…) uses these bundled files in the app.
 *
 * Same optimised WebP files as the website (~960px variants), bundled into the app — no network needed.
 * Values are Metro asset ids (numbers); the shared types call them `string`, so they are cast here and
 * every image goes through `toSource()` (src/ui/Img.tsx). Add a line here when a photo is added.
 */
const native = {
  hero: require('../../../../website/src/assets/images/photos/hero-960.webp'),
  coastBand: require('../../../../website/src/assets/images/photos/coastBand-960.webp'),
  marina: require('../../../../website/src/assets/images/photos/marina-960.webp'),
  downtown: require('../../../../website/src/assets/images/photos/downtown-896.webp'),
  palm: require('../../../../website/src/assets/images/photos/palm-960.webp'),
  businessBay: require('../../../../website/src/assets/images/photos/businessBay-960.webp'),
  jvc: require('../../../../website/src/assets/images/photos/jvc-960.webp'),
  dubaiHills: require('../../../../website/src/assets/images/photos/dubaiHills-896.webp'),
  creekHarbour: require('../../../../website/src/assets/images/photos/creekHarbour-960.webp'),
  damacLagoons: require('../../../../website/src/assets/images/photos/damacLagoons-960.webp'),
  villa: require('../../../../website/src/assets/images/photos/villa-960.webp'),
  living: require('../../../../website/src/assets/images/photos/living-960.webp'),
  kitchen: require('../../../../website/src/assets/images/photos/kitchen-960.webp'),
  bedroom: require('../../../../website/src/assets/images/photos/bedroom-960.webp'),
  pool: require('../../../../website/src/assets/images/photos/pool-960.webp'),
  balcony: require('../../../../website/src/assets/images/photos/balcony-960.webp'),
  offplanTower: require('../../../../website/src/assets/images/photos/offplanTower-960.webp'),
  offplanWaterfront: require('../../../../website/src/assets/images/photos/offplanWaterfront-960.webp'),
  offplanVillas: require('../../../../website/src/assets/images/photos/offplanVillas-960.webp'),
  layla: require('../../../../website/src/assets/images/photos/layla-960.webp'),
  daniel: require('../../../../website/src/assets/images/photos/daniel-960.webp'),
  omar: require('../../../../website/src/assets/images/photos/omar-960.webp'),
  sofia: require('../../../../website/src/assets/images/photos/sofia-960.webp'),
  report: require('../../../../website/src/assets/images/photos/report-960.webp'),
  couple: require('../../../../website/src/assets/images/photos/couple-960.webp'),
}

export const IMG = native as unknown as Record<keyof typeof native, string>

export const LOGO_URL = require('../../../../website/src/assets/logo-mark.webp') as unknown as string

/** Website-only helper (responsive srcSet); not needed natively. */
export const srcSetOf = (_src?: string): string | undefined => undefined
