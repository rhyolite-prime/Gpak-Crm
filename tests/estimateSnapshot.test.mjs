import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ESTIMATE_SNAPSHOT_KEY, buildEstimateSnapshot, readEstimateSnapshot, isNewEstimate, readComplexVariable } from '../utils/estimateSnapshot.ts'

test('snapshot round-trips complete form values and row relationships without losing null or zero', () => {
  const form = {
    templateType: 'bookwork', date: '2026-11-02', noOfCoverSides: '2', client: 'Client', jobName: 'Job', quantity: 200, size: 'A4', pages: 32, pagesToView: 8, pagesOut: 2,
    noOfColoursCover: 4, noOfColoursText: 0, noOfCoversPerSheet: 2, noOfInsidePlates: 16, noOfCoverPlates: 1, wasteFactor: 0.1, marginPercentage: 0, taxPercentage: 20,
    summaries: [{ label: 'Custom', value: 'Preserve me' }],
    tableRows: [
      { id: 'paper', category: 'Paper info', description: 'Cover', quantity: 100, unitPrice: null, inventoryItemId: 'i', variantName: 'v', optionName: 'o' },
      { id: 'overs', category: 'Paper info', description: '10% added', isPercentagePlugin: true, percentageTarget: 'paper', quantity: 9, quantityManuallyEdited: true, percentageRate: 10, computedTotal: 0 },
      { id: 'laminate', category: 'Finishing', isFinishingOption: true, finishingOptionValue: 'lamination:gloss', laminateSize: '825.5', description: 'Lamination: Gloss (825.5 mm)', quantity: 180, unitPrice: 0 },
      { id: 'fold', category: 'Finishing', description: 'Folding', finishingKind: 'folding', quantity: 8, unitPrice: 20 },
    ],
  }
  const selection = { binding: 'perfect-bind', surface: 'lamination', laminateType: 'gloss', laminateSize: '825.5', spotType: '3d-matt', spotOvers: 0 }
  const prices = { foldingTiers: [{ minQuantity: 100, maxQuantity: null, price: 20 }], lamination: { gloss: { '825.5': 0 } } }
  const request = { requestNumber: 'PR-1', customerName: 'Client' }
  const value = buildEstimateSnapshot(form, selection, prices, request, 'request-1')
  const restored = readEstimateSnapshot([{ systemName: ESTIMATE_SNAPSHOT_KEY, value }])
  assert.deepEqual(restored, { version: 1, form, finishingSelection: selection, finishingPrices: prices, productionRequest: request, productionRequestId: 'request-1' })
  assert.equal(typeof value, 'object')
  assert.deepEqual(readEstimateSnapshot([{ systemName: ESTIMATE_SNAPSHOT_KEY, value: JSON.stringify(value) }]), restored)
  assert.deepEqual(readComplexVariable(form.tableRows), form.tableRows)
  assert.deepEqual(readComplexVariable(JSON.stringify(form.tableRows)), form.tableRows)
  assert.equal(isNewEstimate([{ systemName: ESTIMATE_SNAPSHOT_KEY, value }]), true)
  assert.equal(isNewEstimate([{ systemName: 'estimateRows', value: '[]' }]), true)
  assert.equal(isNewEstimate([{ systemName: 'unrelated', value: '' }]), false)
})

test('missing snapshots permit legacy fallback but corrupt, incomplete or newer snapshots do not', () => {
  assert.equal(readEstimateSnapshot([]), null)
  assert.throws(() => readEstimateSnapshot([{ systemName: ESTIMATE_SNAPSHOT_KEY, value: '{' }]), /invalid or truncated/)
  assert.throws(() => readEstimateSnapshot([{ systemName: ESTIMATE_SNAPSHOT_KEY, value: '{"version":2}' }]), /not supported/)
  assert.throws(() => readEstimateSnapshot([{ systemName: ESTIMATE_SNAPSHOT_KEY, value: '{"version":1}' }]), /incomplete/)
})


test('estimate save passes native complex values instead of JSON strings', async () => {
  const { readFile } = await import('node:fs/promises')
  const page = await readFile(new URL('../pages/estimates/new.vue', import.meta.url), 'utf8')
  const variables = page.slice(page.indexOf('const headerVars = ['), page.indexOf('// ── Map tableRows'))
  assert.doesNotMatch(variables, /JSON\.stringify/)
  assert.match(variables, /'summaries',\s*form\.summaries/)
  assert.match(variables, /'estimateRows',\s*form\.tableRows/)
  assert.match(variables, /ESTIMATE_SNAPSHOT_KEY, buildEstimateSnapshot\(/)
})
