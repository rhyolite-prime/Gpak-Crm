<script setup lang="ts">
type Option = { id: string; name: string }
const props = defineProps<{
  model: any
  namePrefix: string
  bindingOptions: Option[]
  addOptions: Option[]
  laminateOptions: Option[]
  vanishOptions: Option[]
  spotOptions: Option[]
}>()
const emit = defineEmits<{ (event: 'surface-change', category: string): void }>()

const surfaceGroups = computed(() => [
  { key: 'laminate', label: 'Lamination', options: props.laminateOptions },
  { key: 'vanish', label: 'Varnish', options: props.vanishOptions.map(option => ({ ...option, name: option.name.replace(/Vanish/g, 'varnish') })) },
  { key: 'spot', label: 'Spot finish', options: props.spotOptions },
  { key: 'windowPatching', label: 'Window patching', options: [{ id: 'window-patching', name: 'Window patching' }] },
])
const clearSurface = () => {
  for (const group of surfaceGroups.value) {
    props.model[group.key] = ''
    props.model[`${group.key}Custom`] = ''
  }
}
</script>

<template>
  <section class="mt-6 border-t border-gray-200 pt-7" aria-label="Finishing options">
    <h4 class="mb-7 text-lg font-bold text-gray-900">Finishing options</h4>

    <fieldset class="border-b border-gray-200 pb-7">
      <legend class="text-lg font-semibold text-gray-900">Binding</legend>
      <p class="mb-4 mt-1 text-sm text-gray-500">How should the pages be held together?</p>
      <div class="flex flex-wrap gap-2">
        <label v-for="option in bindingOptions" :key="option.id" class="option-label">
          <input v-model="model.binding" class="option-input" type="radio" :name="`${namePrefix}-binding`" :value="option.id" />
          <span class="option-tile">{{ option.name }}</span>
        </label>
        <label class="option-label"><input v-model="model.binding" class="option-input" type="radio" :name="`${namePrefix}-binding`" value="custom" /><span class="option-tile">Other</span></label>
        <label class="option-label"><input v-model="model.binding" class="option-input" type="radio" :name="`${namePrefix}-binding`" value="" /><span class="option-tile">Decide later</span></label>
      </div>
      <input v-if="model.binding === 'custom'" v-model="model.bindingCustom" aria-label="Other binding" type="text" placeholder="Describe the binding" class="mt-3 w-full max-w-sm border border-gray-300 px-3 py-2 text-sm" />
    </fieldset>

    <fieldset class="border-b border-gray-200 py-7">
      <legend class="sr-only">Additional options</legend>
      <h5 class="text-lg font-semibold text-gray-900">Additional options</h5>
      <p class="mb-4 mt-1 text-sm text-gray-500">Choose as many as you need.</p>
      <div class="flex flex-wrap gap-2">
        <label v-for="option in addOptions" :key="option.id" class="option-label">
          <input v-model="model.addons" class="option-input" type="checkbox" :value="option.id" /><span class="option-tile">{{ option.name }}</span>
        </label>
        <label class="option-label"><input v-model="model.addons" class="option-input" type="checkbox" value="custom" /><span class="option-tile">Other</span></label>
      </div>
      <input v-if="model.addons.includes('custom')" v-model="model.addonsCustom" aria-label="Other additional option" type="text" placeholder="Describe the additional option" class="mt-3 w-full max-w-sm border border-gray-300 px-3 py-2 text-sm" />
    </fieldset>

    <fieldset class="pt-7">
      <legend class="sr-only">Surface finish</legend>
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div><h5 class="text-lg font-semibold text-gray-900">Surface finish</h5><p class="mt-1 text-sm text-gray-500">Choose just one of the following, or skip it for now.</p></div>
        <button v-if="surfaceGroups.some(group => model[group.key])" type="button" class="text-sm font-medium text-red-700 hover:text-red-900" @click="clearSurface">Clear selection</button>
      </div>
      <div v-for="group in surfaceGroups" :key="group.key" class="mt-6">
        <p class="mb-3 text-sm font-semibold text-gray-500">{{ group.label }}</p>
        <div class="flex flex-wrap gap-2">
          <label v-for="option in group.options" :key="option.id" class="option-label">
            <input v-model="model[group.key]" class="option-input" type="radio" :name="`${namePrefix}-${group.key}`" :value="option.id" @change="emit('surface-change', group.key)" />
            <span class="option-tile">{{ option.name }}</span>
          </label>
          <label class="option-label"><input v-model="model[group.key]" class="option-input" type="radio" :name="`${namePrefix}-${group.key}`" value="custom" @change="emit('surface-change', group.key)" /><span class="option-tile">Other</span></label>
        </div>
        <input v-if="model[group.key] === 'custom'" v-model="model[`${group.key}Custom`]" :aria-label="`Other ${group.label.toLowerCase()}`" type="text" :placeholder="`Describe the ${group.label.toLowerCase()}`" class="mt-3 w-full max-w-sm border border-gray-300 px-3 py-2 text-sm" />
      </div>
    </fieldset>
  </section>
</template>

<style scoped>
.option-label { position: relative; display: inline-flex; cursor: pointer; }
.option-input { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.option-tile { display: inline-flex; min-height: 43px; align-items: center; justify-content: center; border: 1px solid #d7dfd8; background: #fff; padding: 10px 16px; color: #526059; font-size: 14px; line-height: 1.3; transition: border-color .15s, color .15s, background-color .15s; }
.option-label:hover .option-tile { border-color: #be3644; color: #a82736; }
.option-input:checked + .option-tile { border-color: #bb2c3c; background: #fff5f5; color: #b12738; }
.option-input:focus-visible + .option-tile { outline: 2px solid #b12738; outline-offset: 2px; }
</style>
