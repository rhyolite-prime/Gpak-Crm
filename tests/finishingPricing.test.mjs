import { test } from 'node:test'
import assert from 'node:assert/strict'
import { defaultFinishingPrices, bookworkQuantities, foldingPrice } from '../utils/finishingPricing.ts'

test('bookwork quantities use pages in section, job quantity, cover overs and width', () => {
  assert.deepEqual(bookworkQuantities(4, 1200, 48, 20, 5, 2, 460, 30), {
    collate: 4800, folding: 5, perfectBind: 57600, binding: 1200, lamination: 23, spot: 1230,
  })
})
test('folding tier boundaries and unspecified rates', () => {
  const prices = defaultFinishingPrices()
  assert.equal(foldingPrice(99, prices), null)
  assert.equal(foldingPrice(100, prices), 20)
  assert.equal(foldingPrice(1000, prices), 20)
  assert.equal(foldingPrice(1001, prices), 15)
  assert.equal(prices.perfectBind, null)
  assert.equal(prices.lamination.gloss['460'], 1.3)
  assert.equal(prices.lamination.matt['460'], null)
})

test('save request includes complete, distinct price records and preserves blank versus zero', async () => {
  const { buildFinishingPricesRequest } = await import('../utils/finishingPricing.ts')
  const config = defaultFinishingPrices()
  config.perfectBind = 0
  config.spot['3d-gloss'] = ''
  const payload = buildFinishingPricesRequest(config)
  assert.equal(payload.currency, 'GHS')
  assert.equal(payload.prices.length, 29)
  assert.equal(payload.prices.find(p => p.option === 'perfect-bind').unitPrice, 0)
  assert.equal(payload.prices.find(p => p.option === '3d-gloss').unitPrice, null)
  assert.deepEqual(payload.prices.filter(p => p.category === 'folding').map(p => [p.minQuantity, p.maxQuantity]), [[100, 1000], [1001, null]])
  assert.equal(payload.prices.find(p => p.category === 'lamination' && p.option === 'gloss' && p.sizeMm === 460).unitPrice, 1.3)
  config.collate = -1
  assert.throws(() => buildFinishingPricesRequest(config), /non-negative/)
})

test('editable folding bands return the flat price for the matching piece count', async () => {
  const { buildFinishingPricesRequest, getFoldingTiers } = await import('../utils/finishingPricing.ts')
  const config = defaultFinishingPrices()
  config.foldingTiers = [
    { minQuantity: 10, maxQuantity: 200, price: 7 },
    { minQuantity: 300, maxQuantity: null, price: 25 },
  ]
  assert.equal(foldingPrice(200, config), 7)
  assert.equal(foldingPrice(201, config), null)
  assert.equal(foldingPrice(300, config), 25)
  assert.equal(foldingPrice(10000, config), 25)
  assert.deepEqual(buildFinishingPricesRequest(config).prices.filter(p => p.category === 'folding').map(p => [p.minQuantity, p.maxQuantity, p.unitPrice]), [[10, 200, 7], [300, null, 25]])
  assert.deepEqual(getFoldingTiers({ foldingUpTo1000: 18, foldingAbove1000: 12 }).map(t => t.price), [18, 12])
  config.foldingTiers[1].minQuantity = 200
  assert.throws(() => buildFinishingPricesRequest(config), /overlap/)
  config.foldingTiers[1].minQuantity = 300
  config.foldingTiers[0].maxQuantity = null
  assert.throws(() => buildFinishingPricesRequest(config), /overlap/)
  config.foldingTiers[0].maxQuantity = 2
  assert.throws(() => buildFinishingPricesRequest(config), /maximum/)
})

test('current setup payload excludes legacy folding properties, including migrated values', async () => {
  const { toFinishingPricesPayload } = await import('../utils/finishingPricing.ts')
  const oldSetup = { ...defaultFinishingPrices(), foldingUpTo1000: 99, foldingAbove1000: 88 }
  delete oldSetup.foldingTiers
  const result = toFinishingPricesPayload(oldSetup)
  assert.equal('foldingUpTo1000' in result, false)
  assert.equal('foldingAbove1000' in result, false)
  assert.deepEqual(result.foldingTiers.map(tier => tier.price), [99, 88])
  assert.equal('foldingUpTo1000' in toFinishingPricesPayload({ ...oldSetup, foldingTiers: [] }), false)
  assert.deepEqual(toFinishingPricesPayload({ ...oldSetup, foldingTiers: [] }).foldingTiers, [])
})

test('API setup is a single object and empty responses produce a blank template', async () => {
  const { finishingPricesFromApi, emptyFinishingPrices } = await import('../utils/finishingPricing.ts')
  assert.equal(finishingPricesFromApi(null), null)
  assert.equal(finishingPricesFromApi({}), null)
  const blank = emptyFinishingPrices()
  assert.equal(blank.collate, null)
  assert.equal(blank.saddleStitch, null)
  assert.deepEqual(blank.lamination.gloss, {})
  assert.deepEqual(blank.foldingTiers, [])
  const loaded = finishingPricesFromApi({ collate: 0, foldingTiers: [{ minQuantity: 1, maxQuantity: null, price: 23 }], lamination: { gloss: { '460': 7 } } })
  assert.equal(loaded.collate, 0)
  assert.equal(loaded.saddleStitch, null)
  assert.equal(loaded.lamination.gloss['460'], 7)
  assert.equal(loaded.lamination.gloss['510'], undefined)
  assert.equal(loaded.foldingTiers[0].price, 23)
  assert.throws(() => finishingPricesFromApi([]), /Unexpected/)
  assert.throws(() => finishingPricesFromApi({ error: true }), /Unexpected/)
})

test('folding band uses job quantity, not collated pieces or folding batches', () => {
  const prices = defaultFinishingPrices()
  prices.foldingTiers = [
    { minQuantity: 100, maxQuantity: 1000, price: 20 },
    { minQuantity: 1001, maxQuantity: null, price: 15 },
  ]
  const jobQuantity = 200
  const quantities = bookworkQuantities(8, jobQuantity, 64, 0, 0, 0, 0, 0)
  assert.equal(quantities.collate, 1600)
  assert.equal(quantities.folding, 2)
  assert.equal(foldingPrice(jobQuantity, prices), 20)
  assert.equal(foldingPrice(1000, prices), 20)
  assert.equal(foldingPrice(1001, prices), 15)
})

test('new estimate selects the folding band using form job quantity', async () => {
  const { readFile } = await import('node:fs/promises')
  const page = await readFile(new URL('../pages/estimates/new.vue', import.meta.url), 'utf8')
  assert.match(page, /folding:\s*\[qty\.folding,\s*foldingPrice\(Number\(form\.quantity\)\s*\|\|\s*0,\s*prices\)\]/)
})

test('lamination uses printing cover, selected width and cover paper overs', async () => {
  const { laminationQuantity, laminationUnitPrice, coverMaterialOvers } = await import('../utils/finishingPricing.ts')
  const rows = [
    { id: 'inside', category: 'Paper info', quantity: 100 },
    { id: 'cover', category: 'Paper info', quantity: 80 },
    { id: 'inside-overs', category: 'Paper info', isPercentagePlugin: true, percentageTarget: 'inside', quantity: 10 },
    { id: 'cover-overs', category: 'Paper info', isPercentagePlugin: true, percentageTarget: 'cover', quantity: 8 },
    { id: 'extra-cover-overs', category: 'Paper info', isPercentagePlugin: true, percentageTarget: 'cover', quantity: 2 },
  ]
  assert.equal(coverMaterialOvers(rows, 'bookwork'), 10)
  assert.equal(coverMaterialOvers(rows, 'labels'), 10)
  assert.equal(coverMaterialOvers([], 'bookwork'), 0)
  assert.equal(laminationQuantity(20, coverMaterialOvers(rows, 'bookwork'), 2, 510), 30.6)
  const prices = defaultFinishingPrices()
  prices.lamination.matt['510'] = 2.5
  prices.lamination.gloss['510'] = 0
  assert.equal(laminationUnitPrice(prices, 'matt', '510'), 2.5)
  assert.equal(laminationUnitPrice(prices, 'gloss', '510'), 0)
  assert.equal(laminationUnitPrice(prices, 'matt', '381'), null)
  assert.equal(laminationUnitPrice(prices, 'unknown', '510'), null)
})

test('custom lamination widths round trip without restoring deleted defaults', async () => {
  const { emptyFinishingPrices, finishingPricesFromApi, laminationRows, laminationFromRows, laminationSizes, toFinishingPricesPayload, buildFinishingPricesRequest, laminationUnitPrice, laminationQuantity } = await import('../utils/finishingPricing.ts')
  const setup = finishingPricesFromApi({ lamination: { gloss: { '460': 1.3, '825.5': 3.2 }, matt: { '600': 0 } } })
  const rows = laminationRows(setup)
  rows.gloss = rows.gloss.filter(row => Number(row.size) !== 460)
  rows.gloss.push({ size: 700, price: null })
  const lamination = laminationFromRows(rows)
  const payload = toFinishingPricesPayload({ ...setup, lamination })
  assert.deepEqual(payload.lamination.gloss, { '825.5': 3.2, '700': null })
  assert.deepEqual(payload.lamination.matt, { '600': 0 })
  const reloaded = finishingPricesFromApi(payload)
  assert.deepEqual(laminationSizes(reloaded, 'gloss'), ['700', '825.5'])
  assert.deepEqual(laminationSizes(reloaded, 'matt'), ['600'])
  assert.deepEqual(laminationSizes(emptyFinishingPrices(), 'saudy'), [])
  assert.equal(laminationUnitPrice(reloaded, 'gloss', '825.5'), 3.2)
  assert.equal(laminationUnitPrice(reloaded, 'gloss', '460'), null)
  assert.equal(laminationQuantity(20, 5, 2, 825.5), 41.275)
  assert.deepEqual(buildFinishingPricesRequest(reloaded).prices.filter(p => p.category === 'lamination').map(p => [p.option, p.sizeMm, p.unitPrice]), [['gloss', 700, null], ['gloss', 825.5, 3.2], ['matt', 600, 0]])
  rows.gloss.push({ size: '700.0', price: 2 })
  assert.throws(() => laminationFromRows(rows), /duplicate size/)
  rows.gloss.pop()
  rows.gloss.push({ size: 0, price: 2 })
  assert.throws(() => laminationFromRows(rows), /positive size/)
  rows.gloss.pop()
  rows.gloss.push({ size: 500, price: -1 })
  assert.throws(() => laminationFromRows(rows), /non-negative/)
})
