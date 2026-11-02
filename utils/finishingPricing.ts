export type FoldingTier = { minQuantity: number; maxQuantity: number | null; price: number | null }
export type FinishingPrices = {
  collate: number | null; foldingTiers: FoldingTier[]
  perfectBind: number | null; saddleStitch: number | null; caseBind: number | null
  lamination: Record<string, Record<string, number | null>>
  spot: Record<string, number | null>
}
export const LAMINATION_TYPES = ['gloss', 'matt', 'soft-touch', 'saudy'] as const
export const LAMINATION_SIZES = ['381', '460', '510', '640', '740'] as const
export const SPOT_TYPES = ['3d-matt', '3d-gloss', '3d-pattern'] as const
export function defaultFinishingPrices(): FinishingPrices {
  return {
    collate: 0.075, foldingTiers: [{ minQuantity: 100, maxQuantity: 1000, price: 20 }, { minQuantity: 1001, maxQuantity: null, price: 15 }], perfectBind: null, saddleStitch: 0.004, caseBind: 0.4,
    lamination: Object.fromEntries(LAMINATION_TYPES.map(type => [type, Object.fromEntries(LAMINATION_SIZES.map(size => [size, type === 'gloss' && size === '460' ? 1.3 : null]))])),
    spot: Object.fromEntries(SPOT_TYPES.map(type => [type, null])),
  }
}
/** Blank setup for first-time entry; unlike estimate defaults, no prices are assumed. */
export function emptyFinishingPrices(): FinishingPrices {
  return {
    collate: null, foldingTiers: [], perfectBind: null, saddleStitch: null, caseBind: null,
    lamination: Object.fromEntries(LAMINATION_TYPES.map(type => [type, {}])),
    spot: Object.fromEntries(SPOT_TYPES.map(type => [type, null])),
  }
}

/** API returns one setup or null. Merge only values actually supplied by the API. */
export function finishingPricesFromApi(value: unknown): FinishingPrices | null {
  if (value == null) return null
  if (typeof value !== 'object' || Array.isArray(value)) throw new Error('Unexpected finishing prices response')
  const data = value as Record<string, any>
  if (!Object.keys(data).length) return null
  const keys = ['collate', 'perfectBind', 'saddleStitch', 'caseBind', 'foldingTiers', 'lamination', 'spot', 'foldingUpTo1000', 'foldingAbove1000']
  if (!keys.some(key => Object.prototype.hasOwnProperty.call(data, key))) throw new Error('Unexpected finishing prices response')
  const blank = emptyFinishingPrices()
  const tiers = data.foldingTiers == null
    ? (('foldingUpTo1000' in data || 'foldingAbove1000' in data) ? getFoldingTiers(data) : [])
    : data.foldingTiers
  if (!Array.isArray(tiers)) throw new Error('Unexpected folding price bands')
  for (const key of ['lamination', 'spot']) {
    if (data[key] != null && (typeof data[key] !== 'object' || Array.isArray(data[key]))) throw new Error('Unexpected finishing prices response')
  }
  return {
    collate: data.collate ?? null, perfectBind: data.perfectBind ?? null,
    saddleStitch: data.saddleStitch ?? null, caseBind: data.caseBind ?? null,
    foldingTiers: tiers.map(tier => ({ minQuantity: tier.minQuantity, maxQuantity: tier.maxQuantity ?? null, price: tier.price ?? null })),
    lamination: Object.fromEntries(LAMINATION_TYPES.map(type => [type, { ...blank.lamination[type], ...data.lamination?.[type] }])),
    spot: { ...blank.spot, ...data.spot },
  }
}
export type LaminationSizeRow = { size: number | string; price: number | string | null }

/** Transform editable rows to the existing type-to-width-to-price API shape. */
export function laminationFromRows(rows: Record<string, LaminationSizeRow[]>): FinishingPrices['lamination'] {
  return Object.fromEntries(LAMINATION_TYPES.map(type => {
    const sizes: Record<string, number | null> = {}
    for (const row of rows[type] ?? []) {
      const width = Number(row.size)
      if (row.size === '' || !Number.isFinite(width) || width <= 0) throw new Error(`${type}: enter a positive size in millimetres.`)
      const key = String(width)
      if (Object.hasOwn(sizes, key)) throw new Error(`${type}: duplicate size ${key} mm.`)
      const value = row.price
      if (value === '' || value == null) sizes[key] = null
      else if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error(`${type}: prices must be non-negative numbers or blank.`)
      else sizes[key] = value
    }
    return [type, sizes]
  }))
}

export function laminationRows(prices: FinishingPrices): Record<string, LaminationSizeRow[]> {
  return Object.fromEntries(LAMINATION_TYPES.map(type => [type, Object.entries(prices.lamination?.[type] ?? {}).map(([size, price]) => ({ size, price }))]))
}

export function laminationSizes(prices: FinishingPrices, type: string): string[] {
  return Object.keys(prices.lamination?.[type] ?? {}).filter(size => Number.isFinite(Number(size)) && Number(size) > 0).sort((a, b) => Number(a) - Number(b))
}

/** Lamination is measured in metres using the printing cover quantity and cover paper overs. */
export function laminationQuantity(coverQuantity: number, coverOvers: number, outs: number, size: number): number {
  return (coverQuantity + coverOvers) * outs * size / 1000
}

export function coverMaterialOvers(rows: { id: string; category: string; isPercentagePlugin?: boolean; percentageTarget?: string; quantity?: number | null }[], templateType: string): number {
  const paperRows = rows.filter(row => row.category === 'Paper info' && !row.isPercentagePlugin)
  const cover = paperRows[templateType === 'bookwork' ? 1 : 0]
  return cover ? rows.filter(row => row.isPercentagePlugin && row.percentageTarget === cover.id)
    .reduce((sum, row) => sum + (Number(row.quantity) || 0), 0) : 0
}

export function laminationUnitPrice(prices: FinishingPrices, type: string, size: string): number | null {
  const price = prices.lamination?.[type]?.[size]
  return typeof price === 'number' && Number.isFinite(price) && price >= 0 ? price : null
}

export function bookworkQuantities(pagesInSection: number, jobQuantity: number, pages: number, coverQuantity: number, coverOvers: number, outs: number, size: number, spotOvers: number) {
  const collate = pagesInSection * jobQuantity
  const foldingQuantity = Math.max(jobQuantity, 1000)
  return { collate, folding: Math.ceil(pagesInSection * foldingQuantity / 1000), perfectBind: pages * jobQuantity, binding: jobQuantity, lamination: laminationQuantity(coverQuantity, coverOvers, outs, size), spot: jobQuantity + spotOvers }
}
/** Migrate setups and estimate snapshots saved before configurable bands existed. */
export function getFoldingTiers(prices: Partial<FinishingPrices> & { foldingUpTo1000?: number | null; foldingAbove1000?: number | null }): FoldingTier[] {
  if (Array.isArray(prices.foldingTiers)) return prices.foldingTiers
  if ('foldingUpTo1000' in prices || 'foldingAbove1000' in prices) return [
    { minQuantity: 100, maxQuantity: 1000, price: prices.foldingUpTo1000 ?? null },
    { minQuantity: 1001, maxQuantity: null, price: prices.foldingAbove1000 ?? null },
  ]
  return defaultFinishingPrices().foldingTiers
}

/** Build the current setup shape without carrying legacy properties into API requests. */
export function toFinishingPricesPayload(prices: Partial<FinishingPrices> & { foldingUpTo1000?: number | null; foldingAbove1000?: number | null }): FinishingPrices {
  const defaults = defaultFinishingPrices()
  return {
    collate: prices.collate === undefined ? defaults.collate : prices.collate,
    foldingTiers: getFoldingTiers(prices).map(tier => ({ minQuantity: tier.minQuantity, maxQuantity: (tier.maxQuantity as unknown) === '' ? null : tier.maxQuantity, price: tier.price })),
    perfectBind: prices.perfectBind === undefined ? defaults.perfectBind : prices.perfectBind,
    saddleStitch: prices.saddleStitch === undefined ? defaults.saddleStitch : prices.saddleStitch,
    caseBind: prices.caseBind === undefined ? defaults.caseBind : prices.caseBind,
    lamination: Object.fromEntries(LAMINATION_TYPES.map(type => [type, { ...prices.lamination?.[type] }])),
    spot: { ...defaults.spot, ...prices.spot },
  }
}

/** Flat charge selected by the job quantity, independently of the folding batch quantity. */
export function foldingPrice(jobQuantity: number, prices: FinishingPrices): number | null {
  if (!Number.isFinite(jobQuantity) || jobQuantity <= 0) return null
  const tier = getFoldingTiers(prices).find(t => jobQuantity >= t.minQuantity && (t.maxQuantity == null || jobQuantity <= t.maxQuantity))
  return typeof tier?.price === 'number' && Number.isFinite(tier.price) && tier.price >= 0 ? tier.price : null
}

export function validateFoldingTiers(tiers: FoldingTier[]): void {
  const sorted = [...tiers].sort ( (a, b) => a.minQuantity - b.minQuantity )
  sorted.forEach((tier, index) => {
    if (!Number.isSafeInteger(tier.minQuantity) || tier.minQuantity < 0) throw new Error('Each folding band needs a non-negative whole-number minimum.')
    if (tier.maxQuantity !== null && (!Number.isSafeInteger(tier.maxQuantity) || tier.maxQuantity < tier.minQuantity)) throw new Error('Each folding maximum must be a whole number at least as large as its minimum, or blank.')
    if (index && (sorted[index - 1].maxQuantity === null || sorted[index - 1].maxQuantity! >= tier.minQuantity)) throw new Error('Folding bands must not overlap.')
  })
}

/** A complete replacement of the finishing price setup for the authenticated tenant. */
export type FinishingPriceRecord = {
  category: 'collate' | 'folding' | 'binding' | 'lamination' | 'spot-finish'
  option: string
  sizeMm: number | null
  minQuantity: number | null
  maxQuantity: number | null
  unitPrice: number | null
}
export type FinishingPricesSaveRequest = { currency: 'GHS'; prices: FinishingPriceRecord[] }

/** Blank prices are sent as null (unset), not as zero. Zero is a valid price. */
export function buildFinishingPricesRequest(prices: FinishingPrices): FinishingPricesSaveRequest {
  const price = (value: unknown): number | null => {
    if (value === '' || value === null || value === undefined) return null
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      throw new Error('Finishing prices must be non-negative numbers or blank.')
    }
    return value
  }
  const record = (category: FinishingPriceRecord['category'], option: string, unitPrice: unknown, sizeMm: number | null = null, minQuantity: number | null = null, maxQuantity: number | null = null): FinishingPriceRecord => ({
    category, option, sizeMm, minQuantity, maxQuantity, unitPrice: price(unitPrice),
  })
  const tiers = getFoldingTiers(prices).map(tier => ({ ...tier, maxQuantity: tier.maxQuantity === ('' as unknown) ? null : tier.maxQuantity }))
  validateFoldingTiers(tiers)
  return {
    currency: 'GHS',
    prices: [
      record('collate', 'collate', prices.collate),
      ...tiers.map(tier => record('folding', 'folding', tier.price, null, tier.minQuantity, tier.maxQuantity)),
      record('binding', 'perfect-bind', prices.perfectBind),
      record('binding', 'saddle-stitch', prices.saddleStitch),
      record('binding', 'case-bind', prices.caseBind),
      ...LAMINATION_TYPES.flatMap(type => Object.entries(prices.lamination?.[type] ?? {}).map(([size, value]) => {
        if (!Number.isFinite(Number(size)) || Number(size) <= 0) throw new Error('Lamination sizes must be positive numbers in millimetres.')
        return record('lamination', type, value, Number(size))
      })),
      ...SPOT_TYPES.map(type => record('spot-finish', type, prices.spot?.[type])),
    ],
  }
}
