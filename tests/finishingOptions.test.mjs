import { test } from 'node:test'
import assert from 'node:assert/strict'
import { serializeFinishingOptions, parseSurfaceFinish } from '../utils/finishingOptions.ts'

const empty = () => ({ binding: '', bindingCustom: '', addons: [], addonsCustom: '', laminate: '', laminateCustom: '', vanish: '', vanishCustom: '', spot: '', spotCustom: '', windowPatching: '', windowPatchingCustom: '' })

test('serializes binding, multiple additional options, and lamination', () => {
  assert.deepEqual(serializeFinishingOptions({ ...empty(), binding: 'saddle-stitch', addons: ['die-cutting', 'fold-glue'], laminate: 'gloss' }), {
    Binding: 'saddle-stitch', AdditionalOptions: ['die-cutting', 'fold-glue'], SurfaceFinish: 'lamination:gloss',
  })
})
test('serializes varnish and custom values in lowercase hyphenated form', () => {
  assert.deepEqual(serializeFinishingOptions({ ...empty(), binding: 'custom', bindingCustom: '  My Binding ', addons: ['custom'], addonsCustom: 'Gold Foil', vanish: 'waterbase-varnish' }), {
    Binding: 'my-binding', AdditionalOptions: ['gold-foil'], SurfaceFinish: 'varnish:waterbase-varnish',
  })
})
test('leaves unselected options empty and handles remaining surface categories', () => {
  assert.deepEqual(serializeFinishingOptions(empty()), { Binding: '', AdditionalOptions: [], SurfaceFinish: '' })
  assert.equal(serializeFinishingOptions({ ...empty(), spot: '3d-matt' }).SurfaceFinish, 'spot-finish:3d-matt')
  assert.equal(serializeFinishingOptions({ ...empty(), windowPatching: 'window-patching' }).SurfaceFinish, 'window-patching:window-patching')
  assert.equal(serializeFinishingOptions({ ...empty(), laminate: 'custom', laminateCustom: '' }).SurfaceFinish, '')
})
test('parses surface selections for edit', () => {
  assert.deepEqual(parseSurfaceFinish('varnish:waterbase-varnish'), { field: 'vanish', value: 'waterbase-varnish' })
  assert.deepEqual(parseSurfaceFinish('lamination:gloss'), { field: 'laminate', value: 'gloss' })
  assert.equal(parseSurfaceFinish(''), null)
  assert.equal(parseSurfaceFinish('unknown:value'), null)
})
