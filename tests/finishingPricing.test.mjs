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
