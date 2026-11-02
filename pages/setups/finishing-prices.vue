<script setup lang="ts">
import { LAMINATION_TYPES, SPOT_TYPES, emptyFinishingPrices, finishingPricesFromApi, buildFinishingPricesRequest, toFinishingPricesPayload, laminationRows, laminationFromRows } from '~/utils/finishingPricing'
import { getFinishingPrices } from '~/services/finishingPrices'
definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: 'Finishing price setup' })
const prices = ref(emptyFinishingPrices())
const laminateRows = ref(laminationRows(prices.value))
const saved = ref(false)
const isSaving = ref(false)
const saveError = ref('')
const isLoading = ref(true)
const loadError = ref('')
const hasRecord = ref(false)

const loadPrices = async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    const result = await getFinishingPrices()
    const setup = finishingPricesFromApi(result)
    hasRecord.value = setup !== null
    prices.value = setup ?? emptyFinishingPrices()
    laminateRows.value = laminationRows(prices.value)
    saved.value = false
  } catch (error) {
    console.error('Unable to load finishing prices:', error)
    loadError.value = 'Unable to load finishing prices. Please try again.'
  } finally {
    isLoading.value = false
  }
}
onMounted(loadPrices)
const fields = [
  { key: 'collate', label: 'Collate', hint: 'Per piece' },
  { key: 'perfectBind', label: 'Perfect bind', hint: 'Per page × job quantity' },
  { key: 'saddleStitch', label: 'Saddle stitch', hint: 'Per piece' },
  { key: 'caseBind', label: 'Case bind', hint: 'Per piece' },
] as const
const save = async () => {
  isSaving.value = true
  saved.value = false
  saveError.value = ''
  try {
    const setup = { ...prices.value, lamination: laminationFromRows(laminateRows.value) }
    buildFinishingPricesRequest(setup)
    const success = await createFinishingPrice(toFinishingPricesPayload(setup))
    if (!success) throw new Error('The server did not save the finishing prices.')
    saved.value = true
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Unable to save finishing prices.'
  } finally {
    isSaving.value = false
  }
}
const title = (value: string) => value.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
</script>
<template>
  <div class="mx-auto max-w-5xl space-y-6 pb-12">
    <div><p class="text-xs font-bold uppercase tracking-widest text-[#8b9890]">Setups / Estimating</p><h1 class="mt-2 text-3xl font-bold text-[#23312a]">Finishing prices</h1><p class="mt-2 text-sm text-gray-500">Set the unit prices used when creating bookwork estimates. Leave unknown prices blank.</p></div>
    <div v-if="isLoading" role="status" class="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading finishing prices…</div>
    <div v-else-if="loadError" role="alert" class="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{{ loadError }} <button type="button" class="ml-2 font-semibold underline" @click="loadPrices">Try again</button></div>
    <template v-else>
      <p v-if="!hasRecord" class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">No saved finishing prices found. You can create a setup below.</p>

    <form class="space-y-6" @submit.prevent="save" @input="saved = false">
      <section class="rounded-xl border border-gray-200 bg-white p-6"><h2 class="text-lg font-bold">Binding &amp; preparation</h2><p class="mt-1 text-sm text-gray-500">Enter prices in GHS for each operation.</p><div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><label v-for="field in fields" :key="field.key" class="space-y-1"><span class="block text-sm font-semibold text-gray-700">{{ field.label }}</span><span class="block text-xs text-gray-500">{{ field.hint }}</span><input v-model.number="prices[field.key]" type="number" min="0" step="any" class="w-full border border-gray-300 px-3 py-2" placeholder="Not set" /></label></div></section>
      <section class="rounded-xl border border-gray-200 bg-white p-6">
        <h2 class="text-lg font-bold">Folding price bands</h2><p class="mt-1 text-sm text-gray-500">Enter non-overlapping job quantity ranges. The matching band charges one flat amount for the entire job. Leave maximum blank for no upper limit; quantities outside the bands are unpriced.</p>
        <div v-for="(tier, index) in prices.foldingTiers" :key="index" class="mt-4 grid items-end gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <label class="text-sm font-semibold text-gray-700">Minimum job quantity<input v-model.number="tier.minQuantity" type="number" required min="0" step="1" :aria-label="`Band ${index + 1} minimum job quantity`" class="mt-1 w-full border border-gray-300 px-3 py-2" /></label>
          <label class="text-sm font-semibold text-gray-700">Maximum job quantity<input v-model.number="tier.maxQuantity" type="number" min="0" step="1" placeholder="No maximum" :aria-label="`Band ${index + 1} maximum job quantity`" class="mt-1 w-full border border-gray-300 px-3 py-2" /></label>
          <label class="text-sm font-semibold text-gray-700">Flat price (GHS)<input v-model.number="tier.price" type="number" min="0" step="any" placeholder="Not set" :aria-label="`Band ${index + 1} flat price`" class="mt-1 w-full border border-gray-300 px-3 py-2" /></label>
          <button type="button" class="px-3 py-2 text-sm text-red-700 hover:bg-red-50" :aria-label="`Remove folding band ${index + 1}`" @click="prices.foldingTiers.splice(index, 1); saved = false">Remove</button>
        </div>
        <button type="button" class="mt-4 text-sm font-semibold text-[#315b40] hover:underline" @click="prices.foldingTiers.push({ minQuantity: 0, maxQuantity: null, price: null }); saved = false">+ Add price band</button>
      </section>
      <section class="rounded-xl border border-gray-200 bg-white p-6">
        <h2 class="text-lg font-bold">Lamination</h2>
        <p class="mt-1 text-sm text-gray-500">Add sizes and prices for each lamination type. Sizes are in millimetres; leave a price blank if it is not set.</p>
        <div v-for="type in LAMINATION_TYPES" :key="type" class="mt-5 border-t border-gray-200 pt-4">
          <h3 class="font-semibold text-gray-800">{{ title(type) }}</h3>
          <p v-if="!laminateRows[type].length" class="mt-2 text-sm text-gray-500">No sizes configured.</p>
          <div v-for="(row, index) in laminateRows[type]" :key="index" class="mt-3 grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <label class="text-sm font-semibold text-gray-700">Size (mm)<input v-model.number="row.size" type="number" min="0.000001" step="any" required :aria-label="`${title(type)} size ${index + 1} in mm`" class="mt-1 w-full border border-gray-300 px-3 py-2" /></label>
            <label class="text-sm font-semibold text-gray-700">Unit price (GHS)<input v-model.number="row.price" type="number" min="0" step="any" placeholder="Not set" :aria-label="`${title(type)} size ${index + 1} price`" class="mt-1 w-full border border-gray-300 px-3 py-2" /></label>
            <button type="button" :aria-label="`Remove ${title(type)} size ${index + 1}`" class="px-3 py-2 text-sm text-red-700 hover:bg-red-50" @click="laminateRows[type].splice(index, 1); saved = false">Remove</button>
          </div>
          <button type="button" class="mt-3 text-sm font-semibold text-[#315b40] hover:underline" @click="laminateRows[type].push({ size: '', price: null }); saved = false">+ Add {{ title(type) }} size</button>
        </div>
      </section>
      <section class="rounded-xl border border-gray-200 bg-white p-6"><h2 class="text-lg font-bold">Spot finish</h2><p class="mt-1 text-sm text-gray-500">Set a unit price for each finish.</p><div class="mt-5 grid gap-4 sm:grid-cols-3"><label v-for="type in SPOT_TYPES" :key="type" class="space-y-1"><span class="block text-sm font-semibold text-gray-700">{{ title(type) }}</span><input v-model.number="prices.spot[type]" type="number" min="0" step="any" placeholder="Not set" class="w-full border border-gray-300 px-3 py-2" /></label></div></section>
      <div class="flex flex-wrap items-center gap-4"><button type="submit" :disabled="isSaving" class="btn-primary">{{ isSaving ? 'Saving…' : 'Save prices' }}</button><span v-if="saved" role="status" class="text-sm text-green-700">Price setup saved.</span><span v-if="saveError" role="alert" class="text-sm text-red-700">{{ saveError }}</span></div>
    </form>
    </template>
  </div>
</template>
