<script setup lang="ts">
import { Search, Plus, Pencil, Trash2, X, Ruler } from 'lucide-vue-next'
import type { FinishedArtefactSize } from '~/models'
import { getFinishedArtefactSizes, createFinishedArtefactSize, updateFinishedArtefactSize, deleteFinishedArtefactSize } from '~/services/finishedArtefactSizes'

definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: 'Finished Artefact Sizes' })

const { $toast } = useNuxtApp()
const sizes = ref<FinishedArtefactSize[]>([])
const filters = reactive({ query: '', pageNo: 1, pageSize: 10 })
const totalPages = ref(0)
const totalCount = ref(0)
const isLoading = ref(true)
const loadError = ref('')
const showForm = ref(false)
const editingId = ref<string | null>(null)
const form = reactive<{ length: number | null; width: number | null; unit: string }>({ length: null, width: null, unit: '' })
const formError = ref('')
const isSaving = ref(false)
const deleteTarget = ref<FinishedArtefactSize | null>(null)
const isDeleting = ref(false)
const deleteError = ref('')
let requestSequence = 0
let searchTimer: ReturnType<typeof setTimeout> | undefined

const loadSizes = async () => {
  const sequence = ++requestSequence
  isLoading.value = true
  loadError.value = ''
  try {
    const result = await getFinishedArtefactSizes({ ...filters })
    if (!result || !Array.isArray(result.data)) throw new Error('Invalid response')
    if (sequence !== requestSequence) return
    sizes.value = result.data
    totalPages.value = result.totalPages ?? 0
    totalCount.value = result.totalCount ?? 0
    // If the last item on a page was removed, return to the last available page.
    if (filters.pageNo > 1 && filters.pageNo > Math.max(totalPages.value, 1)) {
      filters.pageNo = Math.max(totalPages.value, 1)
      await loadSizes()
    }
  } catch (error) {
    if (sequence === requestSequence) {
      console.error('Unable to load finished artefact sizes:', error)
      loadError.value = 'Unable to load finished artefact sizes. Please try again.'
    }
  } finally {
    if (sequence === requestSequence) isLoading.value = false
  }
}
watch(() => filters.query, () => {
  clearTimeout(searchTimer)
  // Invalidate in-flight results immediately, rather than after the debounce.
  requestSequence++
  isLoading.value = true
  searchTimer = setTimeout(() => { filters.pageNo = 1; loadSizes() }, 300)
})
onMounted(loadSizes)
onBeforeUnmount(() => { clearTimeout(searchTimer); requestSequence++ })

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value || isLoading.value) return
  filters.pageNo = page
  loadSizes()
}
const openCreate = () => {
  editingId.value = null
  Object.assign(form, { length: null, width: null, unit: '' })
  formError.value = ''
  showForm.value = true
}
const openEdit = (size: FinishedArtefactSize) => {
  editingId.value = size.id
  Object.assign(form, { length: size.length, width: size.width, unit: size.unit })
  formError.value = ''
  showForm.value = true
}
const closeForm = () => { if (!isSaving.value) showForm.value = false }
const save = async () => {
  if (isSaving.value) return
  formError.value = ''
  if (typeof form.length !== 'number' || !Number.isFinite(form.length) || form.length <= 0 || typeof form.width !== 'number' || !Number.isFinite(form.width) || form.width <= 0 || !form.unit.trim()) {
    formError.value = 'Enter a length and width greater than zero and a unit of measurement.'
    return
  }
  isSaving.value = true
  try {
    const payload = { length: form.length, width: form.width, unit: form.unit.trim() }
    const success = editingId.value
      ? await updateFinishedArtefactSize({ ...payload, id: editingId.value })
      : await createFinishedArtefactSize(payload)
    if (!success) throw new Error('The server did not save the size.')
    showForm.value = false
    $toast.success(editingId.value ? 'Finished artefact size updated.' : 'Finished artefact size created.')
    await loadSizes()
  } catch (error) {
    console.error('Unable to save finished artefact size:', error)
    formError.value = 'Unable to save the size. Please try again.'
  } finally { isSaving.value = false }
}
const closeDelete = () => { if (!isDeleting.value) { deleteTarget.value = null; deleteError.value = '' } }
const remove = async () => {
  if (!deleteTarget.value || isDeleting.value) return
  isDeleting.value = true
  deleteError.value = ''
  try {
    const success = await deleteFinishedArtefactSize(deleteTarget.value.id)
    if (!success) throw new Error('The server did not delete the size.')
    deleteTarget.value = null
    $toast.success('Finished artefact size deleted.')
    await loadSizes()
  } catch (error) {
    console.error('Unable to delete finished artefact size:', error)
    deleteError.value = 'Unable to delete the size. Please try again.'
  } finally { isDeleting.value = false }
}
</script>

<template>
  <div class="space-y-6 pb-10">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div><p class="text-xs font-bold uppercase tracking-[0.16em] text-[#98a59c]">Setups / Production</p><h1 class="mt-2 text-2xl font-bold tracking-tight text-[#23312a]">Finished artefact sizes</h1><p class="mt-1 text-sm text-gray-500">Manage the dimensions available for finished print and packaging jobs.</p></div>
      <button type="button" class="btn-primary" @click="openCreate"><Plus class="h-4 w-4" /> Add size</button>
    </div>
    <section class="overflow-hidden rounded-xl border border-[#e8ece8] bg-white">
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5"><div><h2 class="font-semibold text-[#34443a]">Size library</h2><p class="mt-1 text-xs text-gray-500">{{ totalCount }} {{ totalCount === 1 ? 'size' : 'sizes' }}</p></div><div class="relative w-full sm:w-64"><Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input v-model="filters.query" aria-label="Search finished artefact sizes" type="search" placeholder="Search sizes..." class="w-full border border-gray-300 py-2 pl-9 pr-3 text-sm" /></div></div>
      <div v-if="isLoading" role="status" class="p-12 text-center text-sm text-gray-500">Loading sizes…</div>
      <div v-else-if="loadError" role="alert" class="p-12 text-center text-sm text-red-700">{{ loadError }} <button type="button" class="font-semibold underline" @click="loadSizes">Try again</button></div>
      <div v-else-if="!sizes.length" class="p-12 text-center"><Ruler class="mx-auto h-8 w-8 text-[#a9bbae]" /><p class="mt-3 text-sm font-semibold text-gray-700">No sizes found</p><p class="mt-1 text-xs text-gray-500">{{ filters.query ? 'Try a different search.' : 'Add a size to get started.' }}</p></div>
      <div v-else class="overflow-x-auto"><table class="w-full whitespace-nowrap text-left"><thead class="bg-[#fafbfa] text-xs uppercase tracking-wide text-gray-500"><tr><th class="px-6 py-4">Length</th><th class="px-6 py-4">Width</th><th class="px-6 py-4">Unit</th><th class="px-6 py-4 text-right">Actions</th></tr></thead><tbody class="divide-y divide-gray-100"><tr v-for="size in sizes" :key="size.id" class="hover:bg-[#fafcfa]"><td class="px-6 py-4 text-sm font-medium text-gray-800">{{ size.length }}</td><td class="px-6 py-4 text-sm text-gray-700">{{ size.width }}</td><td class="px-6 py-4 text-sm text-gray-700">{{ size.unit }}</td><td class="px-6 py-4 text-right"><div class="flex justify-end gap-2"><button type="button" :aria-label="`Edit ${size.length} by ${size.width} ${size.unit}`" class="rounded-lg p-2 text-[#52765d] hover:bg-[#eff6f0]" @click="openEdit(size)"><Pencil class="h-4 w-4" /></button><button type="button" :aria-label="`Delete ${size.length} by ${size.width} ${size.unit}`" class="rounded-lg p-2 text-red-600 hover:bg-red-50" @click="deleteTarget = size; deleteError = ''"><Trash2 class="h-4 w-4" /></button></div></td></tr></tbody></table></div>
      <div v-if="!loadError && totalPages > 1" class="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-xs text-gray-500"><span>Page {{ filters.pageNo }} of {{ totalPages }}</span><div class="flex gap-2"><button type="button" :disabled="isLoading || filters.pageNo <= 1" class="btn-secondary" @click="changePage(filters.pageNo - 1)">Previous</button><button type="button" :disabled="isLoading || filters.pageNo >= totalPages" class="btn-secondary" @click="changePage(filters.pageNo + 1)">Next</button></div></div>
    </section>

    <div v-if="showForm" class="modal-overlay" @click.self="closeForm"><div class="modal-content max-w-lg" role="dialog" aria-modal="true" aria-labelledby="size-form-title"><div class="flex items-center justify-between border-b border-gray-100 p-6"><div><h2 id="size-form-title" class="text-lg font-bold">{{ editingId ? 'Edit size' : 'Add finished size' }}</h2><p class="mt-1 text-xs text-gray-500">Enter the finished dimensions of the artefact.</p></div><button type="button" aria-label="Close" :disabled="isSaving" class="text-gray-400 hover:text-gray-700" @click="closeForm"><X class="h-5 w-5" /></button></div><form class="space-y-4 p-6" @submit.prevent="save"><div class="grid gap-4 sm:grid-cols-2"><label class="space-y-1 text-sm font-medium text-gray-700"><span>Length</span><input v-model.number="form.length" type="number" min="0.000001" step="any" required class="w-full border border-gray-300 px-3 py-2" placeholder="e.g. 210" /></label><label class="space-y-1 text-sm font-medium text-gray-700"><span>Width</span><input v-model.number="form.width" type="number" min="0.000001" step="any" required class="w-full border border-gray-300 px-3 py-2" placeholder="e.g. 148" /></label></div><label class="block space-y-1 text-sm font-medium text-gray-700"><span>Unit</span><input v-model="form.unit" type="text" required class="w-full border border-gray-300 px-3 py-2" placeholder="e.g. mm" /></label><p v-if="formError" role="alert" class="text-sm text-red-700">{{ formError }}</p><div class="flex justify-end gap-3 pt-3"><button type="button" class="btn-secondary" :disabled="isSaving" @click="closeForm">Cancel</button><button type="submit" class="btn-primary" :disabled="isSaving">{{ isSaving ? 'Saving…' : 'Save size' }}</button></div></form></div></div>
    <div v-if="deleteTarget" class="modal-overlay" @click.self="closeDelete"><div class="modal-content max-w-md p-6" role="alertdialog" aria-modal="true" aria-labelledby="delete-size-title"><h2 id="delete-size-title" class="text-lg font-bold text-gray-900">Delete size?</h2><p class="mt-3 text-sm text-gray-600">Are you sure you want to delete <strong>{{ deleteTarget.length }} × {{ deleteTarget.width }} {{ deleteTarget.unit }}</strong>? This cannot be undone.</p><p v-if="deleteError" role="alert" class="mt-3 text-sm text-red-700">{{ deleteError }}</p><div class="mt-6 flex justify-end gap-3"><button type="button" class="btn-secondary" :disabled="isDeleting" @click="closeDelete">Cancel</button><button type="button" class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700" :disabled="isDeleting" @click="remove">{{ isDeleting ? 'Deleting…' : 'Delete size' }}</button></div></div></div>
  </div>
</template>
