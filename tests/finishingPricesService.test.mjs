import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getFinishingPrices, createFinishingPrice } from '../services/finishingPrices.ts'

test('service retrieves the single setup and sends create requests', async () => {
  const calls = []
  const setup = { collate: 0.075, foldingTiers: [] }
  globalThis.httpClient = async (path, options) => {
    calls.push({ path, options })
    return { success: true, result: setup }
  }
  try {
    assert.deepEqual(await getFinishingPrices(), setup)
    assert.equal(await createFinishingPrice(setup), true)
    assert.deepEqual(calls, [
      { path: 'FinishingOptionPrice/ListAll', options: undefined },
      { path: 'FinishingOptionPrice/create', options: { method: 'post', body: setup } },
    ])
  } finally { delete globalThis.httpClient }
})

test('service distinguishes API failure from an empty setup', async () => {
  globalThis.httpClient = async () => ({ success: true, result: null })
  try {
    assert.equal(await getFinishingPrices(), null)
    globalThis.httpClient = async () => ({ success: false, result: null, error: { message: 'Load failed' } })
    await assert.rejects(getFinishingPrices(), /Load failed/)
    globalThis.httpClient = async () => { throw new Error('network failure') }
    await assert.rejects(getFinishingPrices(), /network failure/)
  } finally { delete globalThis.httpClient }
})
