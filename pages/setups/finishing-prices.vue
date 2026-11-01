<script setup lang="ts">
import { LAMINATION_TYPES, LAMINATION_SIZES, SPOT_TYPES, PRICING_KEY, loadFinishingPrices, defaultFinishingPrices, buildFinishingPricesRequest } from '~/utils/finishingPricing'
definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: 'Finishing price setup' })
const prices = ref(defaultFinishingPrices())
const saved = ref(false)
onMounted(() => { prices.value = loadFinishingPrices() })
const fields = [
  { key: 'collate', label: 'Collate', hint: 'Per piece' },
  { key: 'perfectBind', label: 'Perfect bind', hint: 'Per page × job quantity' },
  { key: 'saddleStitch', label: 'Saddle stitch', hint: 'Per piece' },
  { key: 'caseBind', label: 'Case bind', hint: 'Per piece' },
] as const
const save = () => {
  try {
    // Construct and validate the database request contract before saving locally.
    // No pricing endpoint exists yet; do not claim the payload was sent.
    buildFinishingPricesRequest(prices.value)
    prices.value.foldingTiers.forEach(tier => { if ((tier.maxQuantity as unknown) === '') tier.maxQuantity = null })
    localStorage.setItem(PRICING_KEY, JSON.stringify(prices.value))
    saved.value = true
  } catch (error) { alert(error instanceof Error ? error.message : 'Unable to save prices in this browser.') }
}
const title = (value: string) => value.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
</script>
<template>
  <div class="mx-auto max-w-5xl space-y-6 pb-12">
    <div><p class="text-xs font-bold uppercase tracking-widest text-[#8b9890]">Setups / Estimating</p><h1 class="mt-2 text-3xl font-bold text-[#23312a]">Finishing prices</h1><p class="mt-2 text-sm text-gray-500">Set the unit prices used when creating bookwork estimates. Leave unknown prices blank.</p></div>
    <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Prices are saved in this browser only. They are not shared across users or devices; a pricing API is needed for shared settings.</div>
    <form class="space-y-6" @submit.prevent="save" @input="saved = false">
      <section class="rounded-xl border border-gray-200 bg-white p-6"><h2 class="text-lg font-bold">Binding &amp; preparation</h2><p class="mt-1 text-sm text-gray-500">Enter prices in GHS for each operation.</p><div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><label v-for="field in fields" :key="field.key" class="space-y-1"><span class="block text-sm font-semibold text-gray-700">{{ field.label }}</span><span class="block text-xs text-gray-500">{{ field.hint }}</span><input v-model.number="prices[field.key]" type="number" min="0" step="any" class="w-full border border-gray-300 px-3 py-2" placeholder="Not set" /></label></div></section>
      <section class="rounded-xl border border-gray-200 bg-white p-6">
        <h2 class="text-lg font-bold">Folding price bands</h2><p class="mt-1 text-sm text-gray-500">Enter non-overlapping piece ranges. The matching band charges one flat amount for the entire job. Leave maximum blank for no upper limit; quantities outside the bands are unpriced.</p>
        <div v-for="(tier, index) in prices.foldingTiers" :key="index" class="mt-4 grid items-end gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <label class="text-sm font-semibold text-gray-700">Minimum pieces<input v-model.number="tier.minQuantity" type="number" required min="0" step="1" :aria-label="`Band ${index + 1} minimum pieces`" class="mt-1 w-full border border-gray-300 px-3 py-2" /></label>
          <label class="text-sm font-semibold text-gray-700">Maximum pieces<input v-model.number="tier.maxQuantity" type="number" min="0" step="1" placeholder="No maximum" :aria-label="`Band ${index + 1} maximum pieces`" class="mt-1 w-full border border-gray-300 px-3 py-2" /></label>
          <label class="text-sm font-semibold text-gray-700">Flat price (GHS)<input v-model.number="tier.price" type="number" min="0" step="any" placeholder="Not set" :aria-label="`Band ${index + 1} flat price`" class="mt-1 w-full border border-gray-300 px-3 py-2" /></label>
          <button type="button" class="px-3 py-2 text-sm text-red-700 hover:bg-red-50" :aria-label="`Remove folding band ${index + 1}`" @click="prices.foldingTiers.splice(index, 1); saved = false">Remove</button>
        </div>
        <button type="button" class="mt-4 text-sm font-semibold text-[#315b40] hover:underline" @click="prices.foldingTiers.push({ minQuantity: 0, maxQuantity: null, price: null }); saved = false">+ Add price band</button>
      </section>
      <section class="rounded-xl border border-gray-200 bg-white p-6"><h2 class="text-lg font-bold">Lamination</h2><p class="mt-1 text-sm text-gray-500">Set a price per type and width in millimetres.</p><div class="mt-5 overflow-x-auto"><table class="w-full min-w-[600px] text-left text-sm"><thead><tr><th class="p-2">Type</th><th v-for="size in LAMINATION_SIZES" :key="size" class="p-2">{{ size }} mm</th></tr></thead><tbody><tr v-for="type in LAMINATION_TYPES" :key="type" class="border-t border-gray-100"><th class="p-2 font-medium">{{ title(type) }}</th><td v-for="size in LAMINATION_SIZES" :key="size" class="p-2"><input v-model.number="prices.lamination[type][size]" :aria-label="`${title(type)} ${size} mm price`" type="number" min="0" step="any" placeholder="Not set" class="w-full min-w-20 border border-gray-300 px-2 py-2" /></td></tr></tbody></table></div></section>
      <section class="rounded-xl border border-gray-200 bg-white p-6"><h2 class="text-lg font-bold">Spot finish</h2><p class="mt-1 text-sm text-gray-500">Set a unit price for each finish.</p><div class="mt-5 grid gap-4 sm:grid-cols-3"><label v-for="type in SPOT_TYPES" :key="type" class="space-y-1"><span class="block text-sm font-semibold text-gray-700">{{ title(type) }}</span><input v-model.number="prices.spot[type]" type="number" min="0" step="any" placeholder="Not set" class="w-full border border-gray-300 px-3 py-2" /></label></div></section>
      <div class="flex items-center gap-4"><button type="submit" class="btn-primary">Save prices</button><span v-if="saved" role="status" class="text-sm text-green-700">Prices saved in this browser.</span></div>
    </form>
  </div>
</template>
