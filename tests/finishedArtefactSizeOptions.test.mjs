import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatFinishedArtefactSize, fetchAllFinishedArtefactSizes } from '../utils/finishedArtefactSizeOptions.ts'

test('labels preserve alias and dimensions for the string-based estimate size', () => {
  assert.equal(formatFinishedArtefactSize({ alias: ' A5 ', length: 210, width: 148, unit: 'mm' }), 'A5 (210 × 148 mm)')
  assert.equal(formatFinishedArtefactSize({ alias: '', length: 21, width: 14.8, unit: 'cm' }), '21 × 14.8 cm')
})
test('loads every page and preserves an empty list', async () => {
  const calls = []
  const all = await fetchAllFinishedArtefactSizes(async query => {
    calls.push(query)
    return { data: [{ id: String(query.pageNo) }], totalPages: 2 }
  })
  assert.deepEqual(calls, [{ pageNo: 1, pageSize: 100 }, { pageNo: 2, pageSize: 100 }])
  assert.deepEqual(all.map(item => item.id), ['1', '2'])
  assert.deepEqual(await fetchAllFinishedArtefactSizes(async () => ({ data: [], totalPages: 0 })), [])
  await assert.rejects(fetchAllFinishedArtefactSizes(async () => ({ data: null })), /Invalid/)
})
