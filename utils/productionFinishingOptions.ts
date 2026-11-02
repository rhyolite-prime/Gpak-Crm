// ── Static finishing options ──────────────────────────────────────────────────
export const bindingOptions = [
  { id: 'saddle-stitch', name: 'Saddle stitch' },
  { id: 'perfect-bind', name: 'Perfect bind' },
  { id: 'case-bind', name: 'Case bind' },
  { id: 'wire-o', name: 'Wire O' },
  { id: 'spiral-bind', name: 'Spiral bind' },
  { id: 'side-stab', name: 'Side Stab' },
  { id: 'padding', name: 'Padding' },
];

export const addOptions = [
  { id: 'die-cutting', name: 'Die cutting' },
  { id: 'embossing', name: 'Embossing' },
  { id: 'folding', name: 'Folding' },
  { id: 'numbering', name: 'Numbering' },
  { id: 'perforating', name: 'Perforating' },
  { id: 'punching', name: 'Punching' },
  { id: 'cutting', name: 'Cutting' },
  { id: 'sewing', name: 'Sewing' },
  { id: 'fold-glue', name: 'Fold/Glue' },
  { id: 'glue', name: 'Glue' },
];

export const laminateOptions = [
  { id: 'gloss', name: 'Gloss' },
  { id: 'matt', name: 'Matt' },
  { id: 'soft-touch', name: 'Soft Touch' },
  { id: 'saudy', name: 'Saudy' },
];

export const vanishOptions = [
  { id: 'uv-varnish', name: 'UV Vanish' },
  { id: 'waterbase-varnish', name: 'Waterbase Vanish' },
  { id: 'oil-varnish', name: 'Oil Vanish' },
];

export const spotOptions = [
  { id: '3d-matt', name: '3D Matt' },
  { id: '3d-gloss', name: '3D Gloss' },
  { id: '3d-pattern', name: '3D Pattern' },
];


// Use the same named options in production requests and estimates.
export const finishingOptionGroups = [
  { id: 'binding', name: 'Binding', options: bindingOptions },
  { id: 'additional', name: 'Additional options', options: addOptions },
  { id: 'lamination', name: 'Lamination', options: laminateOptions },
  { id: 'varnish', name: 'Varnish', options: vanishOptions.map(option => ({ ...option, name: option.name.replace(/Vanish/g, 'varnish') })) },
  { id: 'spot', name: 'Spot finish', options: spotOptions },
  { id: 'window', name: 'Window patching', options: [{ id: 'window-patching', name: 'Window patching' }] },
]

export function findFinishingOption(value: string) {
  for (const group of finishingOptionGroups) {
    const option = group.options.find(item => `${group.id}:${item.id}` === value)
    if (option) return { group: group.name, name: option.name, value }
  }
  return null
}

// Older estimate snapshots only have the original option description.
export function findLaminationOption(value: string | undefined, description: string) {
  const option = value ? findFinishingOption(value) : null
  if (option?.value.startsWith('lamination:')) return option
  const legacy = laminateOptions.find(item => description === `Lamination: ${item.name}` || description.startsWith(`Lamination: ${item.name} (`))
  return legacy ? findFinishingOption(`lamination:${legacy.id}`) : null
}

export function laminationDescription(name: string, size: string) {
  return `Lamination: ${name}${size ? ` (${size} mm)` : ''}`
}
