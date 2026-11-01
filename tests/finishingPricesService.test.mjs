import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getFinishingPrices, getFinishingPrice, createFinishingPrice, updateFinishingPrice, deleteFinishingPrice } from '../services/finishingPrices.ts'

test('CRUD service passes IDs, query and payload to the expected routes', async () => {
  const calls = []
  globalThis.httpClient = async (path, options) => {
    calls.push({ path, options })
    return { success: true, result: { id: 'id/1', data: [] } }
  }
  try {
    const query = { pageNo: 1, pageSize: 10, category: 'binding' }
    const payload = { currency: 'GHS', category: 'binding', option: 'case-bind', sizeMm: null, minQuantity: null, maxQuantity: null, unitPrice: 0.4 }
    assert.deepEqual(await getFinishingPrices(query), { id: 'id/1', data: [] })
    assert.deepEqual(await getFinishingPrice('id/1'), { id: 'id/1', data: [] })
    assert.equal(await createFinishingPrice(payload), true)
    assert.equal(await updateFinishingPrice({ ...payload, id: 'id/1' }), true)
    assert.equal(await deleteFinishingPrice('id/1'), true)
    assert.deepEqual(calls, [
      { path: 'finishingprice/getall', options: { query } },
      { path: 'finishingprice/getdetails', options: { query: { id: 'id/1' } } },
      { path: 'finishingprice/create', options: { method: 'post', body: payload } },
      { path: 'finishingprice/update', options: { method: 'post', body: { ...payload, id: 'id/1' } } },
      { path: 'finishingprice/delete', options: { method: 'delete', query: { id: 'id/1' } } },
    ])
  } finally { delete globalThis.httpClient }
})

test('service propagates request failures', async () => {
  globalThis.httpClient = async () => { throw new Error('network failure') }
  try { await assert.rejects(deleteFinishingPrice('id'), /network failure/) }
  finally { delete globalThis.httpClient }
})
