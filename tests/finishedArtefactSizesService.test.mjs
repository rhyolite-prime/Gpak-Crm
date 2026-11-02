import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getFinishedArtefactSizes, createFinishedArtefactSize, updateFinishedArtefactSize, deleteFinishedArtefactSize } from '../services/finishedArtefactSizes.ts'

test('finished size service uses dimensions and safely passes IDs', async () => {
  const calls = []
  const result = { data: [{ id: 'size/1', length: 210, width: 148, unit: 'mm' }], totalCount: 1, totalPages: 1 }
  globalThis.httpClient = async (path, options) => { calls.push({ path, options }); return { success: true, result } }
  try {
    const payload = { length: 210, width: 148, unit: 'mm' }
    assert.deepEqual(await getFinishedArtefactSizes({ query: '', pageNo: 1, pageSize: 10 }), result)
    assert.equal(await createFinishedArtefactSize(payload), true)
    assert.equal(await updateFinishedArtefactSize({ ...payload, id: 'size/1' }), true)
    assert.equal(await deleteFinishedArtefactSize('size/1'), true)
    assert.deepEqual(calls, [
      { path: 'FinishedArtefactSize/getall', options: { query: { query: '', pageNo: 1, pageSize: 10 } } },
      { path: 'FinishedArtefactSize/create', options: { method: 'post', body: payload } },
      { path: 'FinishedArtefactSize/update', options: { method: 'post', body: { ...payload, id: 'size/1' } } },
      { path: 'FinishedArtefactSize/delete', options: { method: 'delete', query: { id: 'size/1' } } },
    ])
  } finally { delete globalThis.httpClient }
})
test('failed loads are not treated as an empty list', async () => {
  globalThis.httpClient = async () => ({ success: false, error: { message: 'Server error' } })
  try { await assert.rejects(getFinishedArtefactSizes({}), /Server error/) }
  finally { delete globalThis.httpClient }
})
