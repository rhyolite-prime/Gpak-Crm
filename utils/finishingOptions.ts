/** Convert a displayed selection (including an "Other" value) to its API form. */
export const finishingSlug = (value: string) => value.trim().toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '')

type FinishingForm = {
  binding: string; bindingCustom: string; addons: string[]; addonsCustom: string
  laminate: string; laminateCustom: string; vanish: string; vanishCustom: string
  spot: string; spotCustom: string; windowPatching: string; windowPatchingCustom: string
}

const selection = (value: string, custom: string) => finishingSlug(value === 'custom' ? custom : value)

export function serializeFinishingOptions(form: FinishingForm) {
  const groups = [
    { category: 'lamination', value: form.laminate, custom: form.laminateCustom },
    { category: 'varnish', value: form.vanish, custom: form.vanishCustom },
    { category: 'spot-finish', value: form.spot, custom: form.spotCustom },
    { category: 'window-patching', value: form.windowPatching, custom: form.windowPatchingCustom },
  ]
  const selected = groups.find(group => selection(group.value, group.custom))
  return {
    Binding: selection(form.binding, form.bindingCustom),
    AdditionalOptions: form.addons.map(value => selection(value, form.addonsCustom)).filter(Boolean),
    SurfaceFinish: selected ? `${selected.category}:${selection(selected.value, selected.custom)}` : '',
  }
}

/** Translate API surface categories back to the form's existing fields. */
export function parseSurfaceFinish(value: string) {
  const separator = value.indexOf(':')
  if (separator < 0) return null
  const category = value.slice(0, separator).trim().toLowerCase()
  const selected = value.slice(separator + 1).trim()
  const fields: Record<string, string> = {
    lamination: 'laminate', varnish: 'vanish', 'spot-finish': 'spot', 'window-patching': 'windowPatching',
  }
  return fields[category] && selected ? { field: fields[category], value: selected } : null
}
