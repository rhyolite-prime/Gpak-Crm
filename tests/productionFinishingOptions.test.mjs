import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bindingOptions, addOptions, laminateOptions, vanishOptions, spotOptions, finishingOptionGroups, findFinishingOption } from '../utils/productionFinishingOptions.ts'

test('estimate options are grouped from the production request options', () => {
  assert.deepEqual(finishingOptionGroups.map(group => group.name), ['Binding', 'Additional options', 'Lamination', 'Varnish', 'Spot finish', 'Window patching'])
  assert.equal(finishingOptionGroups[0].options, bindingOptions)
  assert.equal(finishingOptionGroups[1].options, addOptions)
  assert.equal(finishingOptionGroups[2].options, laminateOptions)
  assert.deepEqual(finishingOptionGroups[3].options.map(option => option.id), vanishOptions.map(option => option.id))
  assert.equal(finishingOptionGroups[4].options, spotOptions)
  assert.deepEqual(findFinishingOption('lamination:gloss'), { group: 'Lamination', name: 'Gloss', value: 'lamination:gloss' })
  assert.equal(findFinishingOption('varnish:waterbase-varnish').name, 'Waterbase varnish')
  assert.equal(findFinishingOption('missing:gloss'), null)
})

test('lamination selections retain their identity and display the selected size', async () => {
  const { findLaminationOption, laminationDescription } = await import('../utils/productionFinishingOptions.ts')
  for (const option of laminateOptions) {
    const description = laminationDescription(option.name, '510')
    assert.equal(description, `Lamination: ${option.name} (510 mm)`)
    assert.equal(findLaminationOption(`lamination:${option.id}`, description).name, option.name)
    assert.equal(findLaminationOption(undefined, `Lamination: ${option.name}`).name, option.name)
    assert.equal(findLaminationOption(undefined, description).name, option.name)
    assert.equal(laminationDescription(option.name, ''), `Lamination: ${option.name}`)
  }
  assert.equal(findLaminationOption('binding:wire-o', 'Binding: Wire O'), null)
})
