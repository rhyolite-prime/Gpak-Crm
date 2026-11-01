export type FinishingPrices = {
  collate: number | null; foldingUpTo1000: number | null; foldingAbove1000: number | null
  perfectBind: number | null; saddleStitch: number | null; caseBind: number | null
  lamination: Record<string, Record<string, number | null>>
  spot: Record<string, number | null>
}
export const LAMINATION_TYPES = ['gloss', 'matt', 'soft-touch', 'saudy'] as const
export const LAMINATION_SIZES = ['381', '460', '510', '640', '740'] as const
export const SPOT_TYPES = ['3d-matt', '3d-gloss', '3d-pattern'] as const
export const PRICING_KEY = 'gpak.finishing-prices.v1'
export function defaultFinishingPrices(): FinishingPrices {
  return {
    collate: 0.075, foldingUpTo1000: 20, foldingAbove1000: 15, perfectBind: null, saddleStitch: 0.004, caseBind: 0.4,
    lamination: Object.fromEntries(LAMINATION_TYPES.map(type => [type, Object.fromEntries(LAMINATION_SIZES.map(size => [size, type === 'gloss' && size === '460' ? 1.3 : null]))])),
    spot: Object.fromEntries(SPOT_TYPES.map(type => [type, null])),
  }
}
export function loadFinishingPrices(): FinishingPrices {
  const defaults = defaultFinishingPrices()
  if (typeof localStorage === 'undefined') return defaults
  try {
    const saved = JSON.parse(localStorage.getItem(PRICING_KEY) || 'null')
    if (!saved || typeof saved !== 'object') return defaults
    return { ...defaults, ...saved, lamination: Object.fromEntries(LAMINATION_TYPES.map(t => [t, { ...defaults.lamination[t], ...saved.lamination?.[t] }])), spot: { ...defaults.spot, ...saved.spot } }
  } catch { return defaults }
}
export function bookworkQuantities(pagesInSection: number, jobQuantity: number, pages: number, coverQuantity: number, coverOvers: number, outs: number, size: number, spotOvers: number) {
  const collate = pagesInSection * jobQuantity
  return { collate, folding: Math.ceil(collate / 1000), perfectBind: pages * jobQuantity, binding: jobQuantity, lamination: (coverQuantity + coverOvers) * outs * size / 1000, spot: jobQuantity + spotOvers }
}
// The supplied ranges overlap at 1,000. Treat 1,000 as the upper end of the first tier.
export function foldingPrice(pieces: number, prices: FinishingPrices) {
  if (pieces < 100) return null
  return pieces <= 1000 ? prices.foldingUpTo1000 : prices.foldingAbove1000
}
