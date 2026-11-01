<template>
  <div class="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200 min-h-screen">

    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8 pb-4 border-b">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Create Estimate</h2>
        <p v-if="productionRequest" class="text-sm text-blue-600 mt-1">
          Linked to Production Request
          <span class="font-bold">#{{ productionRequest.requestNumber || prodRequestId }}</span>
        </p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/production-requests" v-if="productionRequest" class="px-4 py-2 border border-blue-300 rounded text-blue-700 hover:bg-blue-50 text-sm">← Back to Requests</NuxtLink>
        <NuxtLink to="/estimates" class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-2">Back to List</NuxtLink>
      </div>
    </div>

    <!-- Production Request Banner (read-only, loaded from URL) -->
    <div v-if="productionRequest" class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-900">
        <div>
          <span class="block text-xs font-bold text-blue-600 uppercase mb-1">Customer</span>
          {{ productionRequest.customerName || productionRequest.customer || '—' }}
        </div>
        <div>
          <span class="block text-xs font-bold text-blue-600 uppercase mb-1">Job Name</span>
          {{ productionRequest.jobName || '—' }}
        </div>
        <div>
          <span class="block text-xs font-bold text-blue-600 uppercase mb-1">Category / Template</span>
          {{ productionRequest.requestCategory || '—' }}
        </div>
      </div>
    </div>
    <div v-else-if="isLoadingRequest" class="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3 text-sm text-gray-500">
      <span class="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
      Loading production request...
    </div>

    <form @submit.prevent="saveEstimate">
      <!-- BASIC INFO -->
      <section class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-gray-700">Estimate Type <span class="text-red-500">*</span></label>
            <select v-model="form.templateType" @change="onTemplateChange" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white">
              <option value="labels">Labels</option>
              <option value="bookwork">Bookwork</option>
              <option value="packaging">Packaging</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-gray-700">Date</label>
            <input v-model="form.date" type="date" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-gray-700">Client / Business Name</label>
            <input v-model="form.client" type="text" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-gray-700">Job Name</label>
              <input v-model="form.jobName" type="text" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-gray-700">Quantity</label>
              <input v-model.number="form.quantity" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-gray-700">Size</label>
              <input v-model="form.size" type="text" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-gray-700">Pages</label>
              <input v-model.number="form.pages" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-gray-700">Pages to View</label>
              <input v-model.number="form.pagesToView" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-gray-700">No. Of Outs</label>
              <input v-model.number="form.pagesOut" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-gray-700">No. of Colours (Inside)</label>
              <input v-model.number="form.noOfColoursText" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-gray-700">No. of Colours (Cover)</label>
              <input v-model.number="form.noOfColoursCover" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-gray-700">No. of Outs Cover</label>
              <input v-model.number="form.noOfCoversPerSheet" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-gray-700">No. Of Inside Plates</label>
              <input v-model.number="form.noOfInsidePlates" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-gray-700">No. of Cover Plates</label>
              <input v-model.number="form.noOfCoverPlates" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="0" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-semibold text-gray-700">No. of Cover Sides</label>
               <select v-model="form.noOfCoverSides" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white">
                <option value="1">1 Side Only</option>
                <option value="2">2 Sides (F&B)</option>
              </select>
            </div>
          </div>
           
        </div>
      </section>

      <!-- SUMMARY -->
      <section class="mb-8">
        <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 border-b-2 border-red-600 pb-2 mb-4 inline-block">Summary</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 border border-gray-200 rounded-lg">
          <div v-for="(summary, index) in form.summaries" :key="index" class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-gray-500">{{ summary.label || `Summary Field ${index + 1}` }}</label>
            <input v-model="summary.value" type="text" class="w-full border border-gray-300 rounded p-2 text-sm focus:ring-red-500 focus:border-red-500 bg-white" placeholder="Enter summary detail..." />
          </div>
        </div>
      </section>

      <!-- ESTIMATE TABLE -->
      <section class="mb-8">
        <div class="flex justify-between items-end mb-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 border-b-2 border-red-600 pb-2 inline-block">Estimation Sheet</h3>
        </div>
        <div class="overflow-x-auto border border-gray-200 rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-5/12">Description</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider w-2/12">Qty</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider w-1/12">Unit Price</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider w-1/12">Total</th>
                <th scope="col" class="relative px-4 py-3 w-10"><span class="sr-only">Remove</span></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="category in categories" :key="category">
                <!-- Section Header -->
                <tr class="border-t-2 border-gray-300">
                  <td colspan="5" class="px-6 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100">
                    {{ category }}
                  </td>
                </tr>

                <!-- PAPER INFO: special rows with inventory picker + percentage plugin -->
                <template v-if="category === 'Paper info'">
                  <template v-for="row in getRowsByCategory(category)" :key="row.id">

                    <!-- Percentage plugin row -->
                    <tr v-if="row.isPercentagePlugin" class="bg-blue-50">
                      <td class="px-4 py-2">
                        <div class="flex items-center gap-2">
                          <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 flex-shrink-0">%</span>
                          <input v-model="row.description" type="text" class="flex-1 border-transparent bg-transparent rounded p-1 focus:border-blue-400 focus:ring-blue-400 text-sm font-medium" placeholder="Label (e.g. 10% added)" />
                        </div>
                      </td>
                      <td class="px-4 py-2">
                        <input v-model.number="row.quantity" @input="row.quantityManuallyEdited = true" type="number" min="0" step="any" aria-label="Percentage quantity" class="w-full border border-gray-300 rounded p-1 text-right text-sm focus:ring-blue-400 focus:border-blue-400" />
                      </td>
                      <td class="px-4 py-2">
                        <div class="flex items-center justify-end gap-1">
                          <input v-model.number="row.percentageRate" @input="recalcPercentageRow(row)" type="number" step="0.1" class="w-14 border border-blue-200 bg-white rounded p-1 text-right text-xs focus:ring-blue-400 focus:border-blue-400" />
                          <span class="text-xs text-blue-600">%</span>
                        </div>
                      </td>
                      <td class="px-4 py-2 text-right text-sm font-medium text-blue-700">
                        {{ formatCurrency(row.computedTotal || 0) }}
                      </td>
                      <td class="px-4 py-2 text-right">
                        <button type="button" @click="removeTableRow(row.id)" class="text-red-400 hover:text-red-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                    <!-- Percentage plugin target config row -->
                    <tr v-if="row.isPercentagePlugin" class="bg-blue-50 border-t-0">
                      <td colspan="5" class="px-10 pb-3 pt-0">
                        <div class="bg-white border border-blue-200 rounded p-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                          <span class="font-semibold text-blue-700">Applies to:</span>
                          <select v-model="row.percentageTarget" @change="recalcPercentageRow(row)" class="border border-gray-300 rounded px-2 py-1 text-xs focus:ring-blue-400 focus:border-blue-400 bg-white">
                            <option value="">— Select target row —</option>
                            <option v-for="target in getPaperTargetRows(row.id)" :key="target.id" :value="target.id">
                              {{ target.description || '(untitled)' }}
                            </option>
                          </select>
                          <button v-if="row.quantityManuallyEdited" type="button" class="font-medium text-blue-700 hover:text-blue-900" @click="row.quantityManuallyEdited = false; recalcPercentageRow(row)">Use calculated quantity</button>
                        </div>
                      </td>
                    </tr>

                    <!-- Standard paper row with inventory picker -->
                    <tr v-if="!row.isPercentagePlugin" class="hover:bg-gray-50">
                      <td class="px-4 py-2">
                        <div class="flex flex-col gap-1.5">
                          <input v-if="!row.inventoryItemId" v-model="row.description" type="text" class="w-full border-transparent bg-transparent rounded p-1 focus:border-red-500 focus:ring-red-500 text-sm" placeholder="Item description" />
                          <span v-else class="text-sm font-medium text-gray-800 py-1">{{ row.description }}</span>
                          <div class="flex flex-wrap items-center gap-2">
                            <select v-model="row.inventoryItemId" @change="onInventoryItemChange(row)" class="border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 bg-gray-50 focus:ring-red-400 focus:border-red-400 max-w-[180px]">
                              <option value="">— Pick from inventory —</option>
                              <option v-for="item in inventoryItems" :key="item.id" :value="item.id">{{ item.name }}</option>
                            </select>
                            <select v-if="row.inventoryItemId && getVariantsForItem(row.inventoryItemId).length" v-model="row.variantName" @change="onVariantChange(row)" class="border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 bg-gray-50 focus:ring-red-400 focus:border-red-400 max-w-[140px]">
                              <option value="">— Variant —</option>
                              <option v-for="v in getVariantsForItem(row.inventoryItemId)" :key="v.name" :value="v.name">{{ v.name }}</option>
                            </select>
                            <select v-if="row.inventoryItemId && row.variantName && getOptionsForVariant(row.inventoryItemId, row.variantName).length" v-model="row.optionName" @change="onOptionChange(row)" class="border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 bg-gray-50 focus:ring-red-400 focus:border-red-400 max-w-[120px]">
                              <option value="">— Size —</option>
                              <option v-for="o in getOptionsForVariant(row.inventoryItemId, row.variantName)" :key="o.name" :value="o.name">{{ o.name }}</option>
                            </select>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-2">
                        <input v-model.number="row.quantity" type="number" class="w-full border border-gray-300 rounded p-1 text-right text-sm focus:ring-red-500 focus:border-red-500" step="0.01" />
                      </td>
                      <td class="px-4 py-2">
                        <input v-model.number="row.unitPrice" type="number" class="w-full border border-gray-300 rounded p-1 text-right text-sm focus:ring-red-500 focus:border-red-500" step="0.01" />
                      </td>
                      <td class="px-4 py-2 text-right text-sm font-medium text-gray-900">
                        {{ formatCurrency((row.quantity || 0) * (row.unitPrice || 0)) }}
                      </td>
                      <td class="px-4 py-2 text-right">
                        <button type="button" @click="removeTableRow(row.id)" class="text-red-500 hover:text-red-700">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  </template>

                  <!-- Add buttons for Paper info -->
                  <tr>
                    <td colspan="5" class="px-6 py-2">
                      <div class="flex items-center gap-4">
                        <button type="button" @click="addTableRow(category)" class="text-xs text-red-600 hover:text-red-800 font-medium flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                          Add paper row
                        </button>
                        <button type="button" @click="addPercentageRow()" class="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                          Add % markup
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>

                <!-- ALL OTHER CATEGORIES: standard rows -->
                <template v-else>
                  <tr v-for="row in getRowsByCategory(category)" :key="row.id" class="hover:bg-gray-50">
                    <td class="px-4 py-2">
                      <input v-model="row.description" type="text" class="w-full border-transparent bg-transparent rounded p-1 focus:border-red-500 focus:ring-red-500 text-sm" placeholder="Item description" />
                    </td>
                    <td class="px-4 py-2">
                      <input v-model.number="row.quantity" type="number" class="w-full border border-gray-300 rounded p-1 text-right text-sm focus:ring-red-500 focus:border-red-500" step="0.01" />
                    </td>
                    <td class="px-4 py-2">
                      <input v-model.number="row.unitPrice" type="number" class="w-full border border-gray-300 rounded p-1 text-right text-sm focus:ring-red-500 focus:border-red-500" step="0.01" />
                    </td>
                    <td class="px-4 py-2 text-right text-sm font-medium text-gray-900">
                      {{ formatCurrency((row.quantity || 0) * (row.unitPrice || 0)) }}
                    </td>
                    <td class="px-4 py-2 text-right">
                      <button type="button" @click="removeTableRow(row.id)" class="text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="5" class="px-6 py-2">
                      <button type="button" @click="addTableRow(category)" class="text-xs text-red-600 hover:text-red-800 font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        Add item
                      </button>
                    </td>
                  </tr>
                </template>
              </template>

              <tr v-if="form.tableRows.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500 text-sm italic">No items in the estimate.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- TOTALS -->
      <section class="flex justify-end mt-8 border-t border-gray-200 pt-8">
        <div class="w-full max-w-md bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <div class="space-y-3">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Direct Labour</span>
              <input v-model.number="form.directLabour" type="number" step="0.01" class="w-24 border border-gray-300 rounded p-1 text-right text-sm focus:ring-red-500 focus:border-red-500" />
            </div>
            <div class="flex justify-between text-sm text-gray-600 font-medium border-b border-gray-200 pb-2">
              <span>Total Value (Sub Total)</span>
              <span>{{ formatCurrency(subTotal) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-600 pt-2">
              <span class="flex items-center gap-2">
                Margin (%)
                <input v-model.number="form.marginPercentage" type="number" step="0.1" class="w-16 border border-gray-300 rounded p-1 text-right text-sm focus:ring-red-500 focus:border-red-500" />
              </span>
              <span>{{ formatCurrency(marginAmount) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span>Unit Cost</span>
              <span class="font-medium">{{ formatCurrency(unitCost) }}</span>
            </div>
            <div class="flex justify-between text-sm font-semibold text-gray-800 border-t border-gray-200 pt-2">
              <span>Total Value Exc.</span>
              <span>{{ formatCurrency(totalExclVat) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-600">
              <span class="flex items-center gap-2">
                NHIS/GETFUND/VAT (%)
                <input v-model.number="form.taxPercentage" type="number" step="0.1" class="w-16 border border-gray-300 rounded p-1 text-right text-sm focus:ring-red-500 focus:border-red-500" />
              </span>
              <span>{{ formatCurrency(taxAmount) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold text-gray-900 border-t-2 border-gray-300 pt-4 mt-4">
              <span>GRAND TOTAL</span>
              <span>{{ formatCurrency(grandTotal) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Actions -->
      <div class="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
        <NuxtLink to="/estimates" class="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cancel</NuxtLink>
        <button type="submit" :disabled="isSubmitting" class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
          <span v-if="isSubmitting" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ isSubmitting ? 'Saving...' : 'Save Estimate' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter, useNuxtApp } from '#app';
import { getProductionRequestDetails } from '~/services/productionRequests';
import { getRawMaterials } from '~/services/rawMaterials';
import { createProductionEstimate, updateProductionEstimate, getEstimateDetails } from '~/services/estimates';

const { $toast } = useNuxtApp();
const router = useRouter();
const route = useRoute();

// ── State ─────────────────────────────────────────────────────────────────────
const isSubmitting = ref(false);
const isLoadingRequest = ref(false);
const prodRequestId = ref('');
const estimateId = ref('');        // populated when editing an existing estimate
const productionRequest = ref<any>(null);
const inventoryItems = ref<any[]>([]);

const getTodayFormatted = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

interface TableRow {
  id: string;
  description: string;
  quantity: number | null;
  unitPrice: number | null;
  category: string;
  // Inventory picker (Paper info rows)
  inventoryItemId?: string;
  variantName?: string;
  optionName?: string;
  // Percentage plugin
  isPercentagePlugin?: boolean;
  percentageRate?: number;
  percentageTarget?: string;
  computedTotal?: number;
  quantityManuallyEdited?: boolean;
}

interface SummaryField {
  value: string;
  label?: string;
  key?: string;
}

const categories = [
  'Paper info',
  'Settings',
  'Plate',
  'Printing',
  'Finishing',
  'Logistics & Misc'
];

const form = reactive({
  templateType: 'labels' as 'labels' | 'bookwork' | 'packaging',
  date: getTodayFormatted(),
  noOfCoverSides: '1',
  client: '',
  jobName: '',
  quantity: null as number | null,
  size: '',
  pages: null as number | null,
  pagesToView: null as number | null,
  pagesOut: null as number | null,
  noOfColoursCover: null as number | null,
  noOfColoursText: null as number | null,
  noOfCoversPerSheet: null as number | null,
  noOfInsidePlates: null as number | null,
  noOfCoverPlates: null as number | null,
  wasteFactor: 0.1 as number,
  summaries: [] as SummaryField[],
  tableRows: [] as TableRow[],
  directLabour: 0.05,
  marginPercentage: 35.00,
  taxPercentage: 20.0,
});

// ── Templates Config ──────────────────────────────────────────────────────────
const templateConfigs = {
  labels: {
    summaries: [
      { label: 'Summary 1', value: '88 up, 2out' },
      { label: 'Summary 2', value: '2-colors- 1 side print' },
      { label: 'Summary 3', value: '' }
    ],
    rows: [
      { description: 'Sticker paper (508 x 700mm)', quantity: null, unitPrice: null, category: 'Paper info', inventoryItemId: '', variantName: '', optionName: '' },
      { description: '% added', quantity: null, unitPrice: null, category: 'Paper info', isPercentagePlugin: true, percentageRate: 10, percentageTarget: '', computedTotal: 0 },
      { description: 'Setting: Design Required', quantity: 1, unitPrice: 500, category: 'Settings' },
      { description: 'Plate', quantity: null, unitPrice: null, category: 'Plate' },
      { description: 'Printing Inside', quantity: null, unitPrice: null, category: 'Printing' },
      { description: 'Printing Cover', quantity: null, unitPrice: null, category: 'Printing' },
      { description: 'One off cost f die', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Delivery', quantity: null, unitPrice: null, category: 'Logistics & Misc' },
      { description: 'Cost Of Sample', quantity: null, unitPrice: null, category: 'Logistics & Misc' },
      { description: 'Die cutting', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Trimming/ Stripping', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Sorting & Parcelling', quantity: null, unitPrice: null, category: 'Logistics & Misc' },
    ]
  },
  bookwork: {
    summaries: [
      { label: 'Pages Info', value: '8pages to view, 2 out', key: 'pagesInfo' },
      { label: 'Colours Info', value: '4-Color inside, 4-colour cover', key: 'coloursInfo' },
      { label: 'Actual Sections', value: '', key: 'actualSections' },
      { label: 'Pages In a Section', value: '', key: 'pagesInaSection' }
    ],
    rows: [
      { description: 'Bond Paper 70gsm(30x40)', quantity: null, unitPrice: null, category: 'Paper info', inventoryItemId: '', variantName: '', optionName: '' },
      { description: '10% added', quantity: null, unitPrice: null, category: 'Paper info', isPercentagePlugin: true, percentageRate: 10, percentageTarget: '', computedTotal: 0 },
      { description: 'Art Card 300gsm (580)', quantity: null, unitPrice: null, category: 'Paper info', inventoryItemId: '', variantName: '', optionName: '' },
      { description: '10% added', quantity: null, unitPrice: null, category: 'Paper info', isPercentagePlugin: true, percentageRate: 10, percentageTarget: '', computedTotal: 0 },
      { description: 'Setting: Design Required', quantity: 1, unitPrice: 500, category: 'Settings' },
      { description: 'Plate', quantity: null, unitPrice: null, category: 'Plate' },
      { description: 'Printing Inside', quantity: null, unitPrice: null, category: 'Printing' },
      { description: 'Printing Cover', quantity: null, unitPrice: null, category: 'Printing' },
      { description: 'Sewing', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Folding', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Collate', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Gloss Laminate (460)', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Perfect bind', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Cost of Sample', quantity: null, unitPrice: null, category: 'Logistics & Misc' },
      { description: 'Delivery', quantity: null, unitPrice: null, category: 'Logistics & Misc' },
      { description: 'Parcelling and sorting', quantity: null, unitPrice: null, category: 'Logistics & Misc' },
    ]
  },
  packaging: {
    summaries: [
      { label: 'Summary 1', value: 'Glico General Size' },
      { label: 'Summary 2', value: '1 up, 2out' },
      { label: 'Summary 3', value: 'Full Colour- 1 side' }
    ],
    rows: [
      { description: 'Art Card 300gsm (30x40) paper', quantity: null, unitPrice: null, category: 'Paper info', inventoryItemId: '', variantName: '', optionName: '' },
      { description: '50% added', quantity: null, unitPrice: null, category: 'Paper info', isPercentagePlugin: true, percentageRate: 50, percentageTarget: '', computedTotal: 0 },
      { description: 'Setting: Design Required', quantity: 1, unitPrice: 500, category: 'Settings' },
      { description: 'Plate', quantity: null, unitPrice: null, category: 'Plate' },
      { description: 'Printing Inside Impression', quantity: null, unitPrice: null, category: 'Printing' },
      { description: 'Folding and glueing', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Delivery', quantity: null, unitPrice: null, category: 'Logistics & Misc' },
      { description: 'Matt Laminate (510mm) lamination', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Rope', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Die-cutting', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Stripping', quantity: null, unitPrice: null, category: 'Finishing' },
      { description: 'Cost of sample', quantity: null, unitPrice: null, category: 'Logistics & Misc' },
      { description: 'Parcelling and sorting', quantity: null, unitPrice: null, category: 'Logistics & Misc' },
    ]
  }
};

const onTemplateChange = () => {
  const config = templateConfigs[form.templateType];
  form.summaries = JSON.parse(JSON.stringify(config.summaries));
  
  const generatedRows = JSON.parse(JSON.stringify(config.rows)).map((r: any) => ({ ...r, id: generateId() }));
  
  // Auto-assign percentageTarget for percentage plugins to the immediately preceding paper row
  for (let i = 1; i < generatedRows.length; i++) {
    if (generatedRows[i].isPercentagePlugin && generatedRows[i-1].category === 'Paper info' && !generatedRows[i-1].isPercentagePlugin) {
      generatedRows[i].percentageTarget = generatedRows[i-1].id;
    }
  }
  
  form.tableRows = generatedRows;
};

// Watch basic info to auto-compute summary fields for bookwork
watch([() => form.pages, () => form.pagesToView, () => form.pagesOut, () => form.noOfColoursCover, () => form.noOfColoursText, () => form.quantity, () => form.noOfCoversPerSheet, () => form.noOfInsidePlates, () => form.noOfCoverPlates, () => form.wasteFactor, () => form.noOfCoverSides ], () => {
  if (form.templateType === 'bookwork') {
    const s1 = form.summaries.find(s => s.key === 'pagesInfo');
    if (s1) {
      const pToView = form.pagesToView || 0;
      const pOut = form.pagesOut || 0;
      s1.value = `${pToView}pages to view, ${pOut} out`;
    }
    const s2 = form.summaries.find(s => s.key === 'coloursInfo');
    if (s2) {
      const cInside = form.noOfColoursText || 0;
      const cCover = form.noOfColoursCover || 0;
      s2.value = `${cInside}-Color inside, ${cCover}-colour cover`;
    }
    const pagesInaSectionInside = (form.pages || 0) / (form.pagesToView * form.pagesOut);
    const s4 = form.summaries.find(s => s.key === 'pagesInaSection');
    if (s4) s4.value = pagesInaSectionInside.toString();
    
    const actualSections = pagesInaSectionInside / 2;
    const s3 = form.summaries.find(s => s.key === 'actualSections');
    if (s3) s3.value = actualSections.toString();

    // Auto-calculate No. of Inside Plates
    // Formula: (Quantity / Pages to View) × No. of Colours (Inside)
    const totalPages = form.pages || 0;
    const pagesToView = form.pagesToView || 0;
    const coloursInside = form.noOfColoursText || 0;

    if (pagesToView > 0) {
      form.noOfInsidePlates = (totalPages / pagesToView) * coloursInside;
    } else {
      form.noOfInsidePlates = 0;
    }

    // Auto-calculate quantity for paper inside (first paper info row)
    const paperRows = form.tableRows.filter(r => r.category === 'Paper info' && !r.isPercentagePlugin);
    if (paperRows.length > 0) {
      
      paperRows[0].quantity = (form.quantity || 0) * actualSections;
      // Auto-calculate quantity for paper cover (second paper info row in bookwork)
      if (paperRows.length > 1) {
        paperRows[1].quantity = (form.quantity || 0) / (form.noOfCoversPerSheet || 1);
      }
    }
  } else {
    // For labels and packaging, there is only one paper row (which acts as the cover)
    const paperRows = form.tableRows.filter(r => r.category === 'Paper info' && !r.isPercentagePlugin);
    if (paperRows.length > 0) {
      paperRows[0].quantity = (form.quantity || 0) / (form.noOfCoversPerSheet || 1);
    }
  }

  // Auto-calculate plate quantity: (Total Pages / Pages Per sheet) * 2 + No. of Cover Plates
  const plateRow = form.tableRows.find(r => r.category === 'Plate');
  if (plateRow) {
    const totalPages = form.pages || 0;
    const pagesPerSheet = form.noOfInsidePlates || 1;
    const coverPlates = form.noOfCoverPlates;
    plateRow.quantity = form.noOfInsidePlates + coverPlates;
  }

  
  const printingInsideRow = form.tableRows.find(
    r => r.category === 'Printing' && r.description.toLowerCase().includes('printing inside')
  );

  //quantity for printing inside
  if (printingInsideRow) {
    const pages = form.pages || 0;
    const pagesPerSheet = form.noOfInsidePlates || 1;
    const qty = form.quantity <= 1000 ? 1000 : form.quantity;
    printingInsideRow.quantity = (form.noOfInsidePlates * qty) / 1000;
  }

  //quantity for printing cover
  const printingCoverRow = form.tableRows.find(
    r => r.category === 'Printing' && r.description.toLowerCase().includes('printing cover')
  );

  if (printingCoverRow) {
    const qty = form.quantity || 0;
    printingCoverRow.quantity = Math.ceil((qty / 2)/1000) * form.noOfColoursCover * form.noOfCoverSides;
  }

  // ── Finishing row auto-calculations ─────────────────────────────────────────

  // Sewing Qty = Quantity
  const sewingRow = form.tableRows.find(
    r => r.category === 'Finishing' && r.description.toLowerCase().includes('sewing')
  );
  if (sewingRow) {
    sewingRow.quantity = form.quantity || 0;
  }

  // Folding Qty = Printing Inside Qty / 8  (charged per 8-unit batch)
  const FOLDING_BATCH = 8;
  const printingInsideQty = (() => {
    const pages = form.pages || 0;
    const pps = form.noOfInsidePlates || 1;
    const qty = form.quantity || 0;
    return (pages / pps) * (qty / 500);
  })();
  const foldingRow = form.tableRows.find(
    r => r.category === 'Finishing' && r.description.toLowerCase().includes('folding')
  );
  if (foldingRow) {
    foldingRow.quantity = printingInsideQty / FOLDING_BATCH;
  }

  // Collate Qty = Folding Qty × 1000
  const collateRow = form.tableRows.find(
    r => r.category === 'Finishing' && r.description.toLowerCase().includes('collate')
  );
  if (collateRow) {
    const foldingQty = printingInsideQty / FOLDING_BATCH;
    collateRow.quantity = foldingQty * 1000;
  }

  // Laminate Qty = Cover Sheets × (1 + waste factor)
  // Cover Sheets = Quantity / No. of Covers Per Sheet
  const laminateRow = form.tableRows.find(
    r => r.category === 'Finishing' && r.description.toLowerCase().includes('laminate')
  );
  if (laminateRow) {
    const qty = form.quantity || 0;
    const coversPerSheet = form.noOfCoversPerSheet || 1;
    const coverSheets = qty / coversPerSheet;
    laminateRow.quantity = coverSheets * (1 + (form.wasteFactor || 0));
  }

  // Perfect Bind Qty = Pages × Quantity
  const perfectBindRow = form.tableRows.find(
    r => r.category === 'Finishing' && r.description.toLowerCase().includes('perfect bind')
  );
  if (perfectBindRow) {
    perfectBindRow.quantity = (form.pages || 0) * (form.quantity || 0);
  }
}, { immediate: true });

// ── Inventory helpers ─────────────────────────────────────────────────────────
const getVariantsForItem = (itemId: string) => {
  const item = inventoryItems.value.find(i => i.id === itemId);
  return item?.variants ?? [];
};

const getOptionsForVariant = (itemId: string, variantName: string) => {
  const variants = getVariantsForItem(itemId);
  const variant = variants.find((v: any) => v.name === variantName);
  return variant?.options ?? [];
};

const onInventoryItemChange = (row: TableRow) => {
  const item = inventoryItems.value.find(i => i.id === row.inventoryItemId);
  if (!item) return;
  row.description = item.name;
  row.variantName = '';
  row.optionName = '';
  if (!item.variants || item.variants.length === 0) {
    row.unitPrice = item.standardCost ?? null;
  } else {
    row.unitPrice = null;
  }
};

const onVariantChange = (row: TableRow) => {
  const variants = getVariantsForItem(row.inventoryItemId!);
  const variant = variants.find((v: any) => v.name === row.variantName);
  if (!variant) return;
  row.optionName = '';
  const item = inventoryItems.value.find(i => i.id === row.inventoryItemId);
  row.description = `${item?.name} ${variant.name}`;
  row.unitPrice = variant.baseCost;
};

const onOptionChange = (row: TableRow) => {
  const variants = getVariantsForItem(row.inventoryItemId!);
  const variant = variants.find((v: any) => v.name === row.variantName);
  if (!variant) return;
  const option = variant.options.find((o: any) => o.name === row.optionName);
  if (!option) return;
  const item = inventoryItems.value.find(i => i.id === row.inventoryItemId);
  row.description = `${item?.name} ${variant.name} (${option.name})`;
  row.unitPrice = variant.baseCost + (option.costImpact ?? 0);
};

// ── Percentage plugin ─────────────────────────────────────────────────────────
const getPaperTargetRows = (pluginRowId: string) => {
  return form.tableRows.filter(r => r.category === 'Paper info' && !r.isPercentagePlugin && r.id !== pluginRowId);
};

const recalcPercentageRow = (row: TableRow) => {
  row.description = `${row.percentageRate || 0}% added`;
  const target = form.tableRows.find(r => r.id === row.percentageTarget);
  const calculatedQuantity = target ? (target.quantity || 0) * ((row.percentageRate || 0) / 100) : 0;
  if (!row.quantityManuallyEdited && row.quantity !== calculatedQuantity) row.quantity = calculatedQuantity;
  const unitPrice = target?.unitPrice || 0;
  if (row.unitPrice !== unitPrice) row.unitPrice = unitPrice;
  const total = (row.quantity || 0) * unitPrice;
  if (row.computedTotal !== total) row.computedTotal = total;
};

const recalcAllPercentageRows = () => {
  form.tableRows.forEach(row => { if (row.isPercentagePlugin) recalcPercentageRow(row); });
};

watch(() => form.tableRows, () => { recalcAllPercentageRows(); }, { deep: true });

const addPercentageRow = () => {
  form.tableRows.push({
    id: generateId(),
    description: '% added',
    quantity: null,
    unitPrice: null,
    category: 'Paper info',
    isPercentagePlugin: true,
    percentageRate: 10,
    percentageTarget: '',
    computedTotal: 0
  });
};

// ── Production Request: loaded from URL query param ───────────────────────────
const loadProductionRequest = async (id: string) => {
  isLoadingRequest.value = true;
  try {
    const details = await getProductionRequestDetails({ id }) as any;
    if (details) {
      productionRequest.value = details;
      form.client = details.customerName || details.customer || '';
      form.jobName = details.jobName || '';
      form.quantity = details.quantity || null;
      form.size = details.size || '';
      form.pages = details.pages || null;
      form.pagesToView = details.pagesToView || null;
      form.pagesOut = details.pagesOut || null;
      form.noOfColoursCover = details.noOfColoursCover || null;
      form.noOfColoursText = details.noOfColoursText || null;
      form.noOfCoversPerSheet = details.noOfCoversPerSheet || null;
      form.noOfInsidePlates = details.noOfInsidePlates || null;
      form.noOfCoverPlates = details.noOfColoursCover || null;

      // Switch template based on requestCategory
      if (details.requestCategory) {
        const cat = details.requestCategory.toLowerCase() as 'labels' | 'bookwork' | 'packaging';
        if (['labels', 'bookwork', 'packaging'].includes(cat)) {
          form.templateType = cat;
        }
      }

      // Reset rows for selected template
      onTemplateChange();

      // Pre-populate paper info rows from production request paper fields.
      // Inventory must already be loaded before this runs (handled in onMounted ordering).
      await applyPaperFromProductionRequest(details);

    } else {
      $toast.error('Production Request not found.');
    }
  } catch (e) {
    console.error(e);
    $toast.error('Failed to load production request.');
  } finally {
    isLoadingRequest.value = false;
  }
};

/**
 * Pre-populate the Paper info rows using the paper fields from the production request.
 *
 * Fields used (all are labels/names, not IDs, except the RawMaterialId ones):
 *   - paperInsideRawMaterialId  → ID of the inventory item for "inside" paper
 *   - paperInsideVariant        → variant name (e.g. "70 GSM")
 *   - paperCoverRawMaterialId   → ID of the inventory item for "cover" paper
 *   - paperCoverVariant         → variant name (e.g. "300 GSM")
 *
 * For bookwork: first paper row = inside, second paper row = cover.
 * For labels/packaging: only one paper row, use cover if available, else inside.
 */
const applyPaperFromProductionRequest = async (pr: any) => {
  const paperRows = form.tableRows.filter(r => r.category === 'Paper info' && !r.isPercentagePlugin);
  if (paperRows.length === 0) return;

  const applyToRow = (row: TableRow, rawMaterialId: string, variantName: string) => {
    if (!rawMaterialId) return;

    const item = inventoryItems.value.find(i => i.id === rawMaterialId);
    if (!item) return;

    row.inventoryItemId = item.id;

    // Apply variant if provided
    if (variantName) {
      const variants = getVariantsForItem(item.id);
      const matchedVariant = variants.find((v: any) =>
        v.name.toLowerCase() === variantName.toLowerCase()
      );

      if (matchedVariant) {
        row.variantName = matchedVariant.name;
        row.description = `${item.name} ${matchedVariant.name}`;
        // Set base cost; user can still pick an option to refine the price
        row.unitPrice = matchedVariant.baseCost;
        row.optionName = ''; // user picks option
      } else {
        // Variant not matched — use item name + whatever label was given
        row.variantName = variantName;
        row.description = `${item.name} ${variantName}`;
        row.unitPrice = item.standardCost ?? null;
      }
    } else {
      // No variant — just use item and standardCost
      row.description = item.name;
      row.unitPrice = item.standardCost ?? null;
    }
  };

  if (form.templateType === 'bookwork') {
    // First paper row = inside paper, second = cover
    if (paperRows[0]) {
      applyToRow(paperRows[0], pr.paperInsideRawMaterialId, pr.paperInsideVariant);
    }
    if (paperRows[1]) {
      applyToRow(paperRows[1], pr.paperCoverRawMaterialId, pr.paperCoverVariant);
    }
  } else {
    // Labels / Packaging: single paper row — prefer cover, fall back to inside
    const coverId = pr.paperCoverRawMaterialId;
    const insideId = pr.paperInsideRawMaterialId;

    if (coverId) {
      applyToRow(paperRows[0], coverId, pr.paperCoverVariant);
    } else if (insideId) {
      applyToRow(paperRows[0], insideId, pr.paperInsideVariant);
    }
  }

  // Recalc any percentage plugins that target these rows
  recalcAllPercentageRows();
};


// ── Computed Totals ───────────────────────────────────────────────────────────
const subTotal = computed(() => {
  const itemsTotal = form.tableRows.reduce((sum, row) => {
    if (row.isPercentagePlugin) return sum + (row.computedTotal || 0);
    return sum + ((row.quantity || 0) * (row.unitPrice || 0));
  }, 0);
  return itemsTotal + (form.directLabour || 0);
});

const marginAmount = computed(() => subTotal.value * ((form.marginPercentage || 0) / 100));
const totalExclVat = computed(() => subTotal.value + marginAmount.value);
const taxAmount = computed(() => totalExclVat.value * ((form.taxPercentage || 0) / 100));
const grandTotal = computed(() => totalExclVat.value + taxAmount.value);
const unitCost = computed(() => {
  if (!form.quantity || form.quantity <= 0) return 0;
  return totalExclVat.value / form.quantity;
});

// ── Actions ───────────────────────────────────────────────────────────────────
const addTableRow = (category: string) => {
  const newRow: TableRow = { id: generateId(), description: '', quantity: null, unitPrice: null, category };
  if (category === 'Paper info') {
    newRow.inventoryItemId = '';
    newRow.variantName = '';
    newRow.optionName = '';
  }
  form.tableRows.push(newRow);
};

const removeTableRow = (id: string) => {
  const index = form.tableRows.findIndex(r => r.id === id);
  if (index !== -1) form.tableRows.splice(index, 1);
};

const getRowsByCategory = (category: string) => form.tableRows.filter(r => r.category === category);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(value);

// ── Helpers ───────────────────────────────────────────────────────────────────
/** Encode a key/value pair as an EstimationVariable */
const makeVar = (name: string, systemName: string, value: string) => ({ name, systemName, value });

/** Decode a saved variable by systemName from a variables array */
const getVar = (vars: any[], systemName: string) =>
  vars.find((v: any) => v.systemName === systemName)?.value ?? null;

const saveEstimate = async () => {
  isSubmitting.value = true;

  try {
    // ── Computed totals ───────────────────────────────────────────────────────
    const subTotal = form.tableRows.reduce((sum, r) => {
      if (r.isPercentagePlugin) return sum + (r.computedTotal || 0);
      return sum + (r.quantity || 0) * (r.unitPrice || 0);
    }, 0);
    const unitCostOfProduction = form.quantity ? subTotal / form.quantity : 0;
    const marginAmount = subTotal * (form.marginPercentage / 100);
    const totalExclVat = subTotal + marginAmount;
    const nhisGetFundAmount = totalExclVat * (form.directLabour || 0);
    const vatAmount = (totalExclVat + nhisGetFundAmount) * (form.taxPercentage / 100);
    const grandTotal = totalExclVat + nhisGetFundAmount + vatAmount;

    // ── Encode all new.vue-specific header fields as variables ─────────────
    // These are stored with the estimate so the edit page can fully reconstruct
    // the form state and re-run all reactive calculations.
    const headerVars = [
      makeVar('Template Type',          'templateType',          form.templateType),
      makeVar('Pages',                  'pages',                 String(form.pages ?? '')),
      makeVar('Pages To View',          'pagesToView',           String(form.pagesToView ?? '')),
      makeVar('Pages Out',              'pagesOut',              String(form.pagesOut ?? '')),
      makeVar('No. of Colours (Cover)', 'noOfColoursCover',      String(form.noOfColoursCover ?? '')),
      makeVar('No. of Colours (Text)',  'noOfColoursText',       String(form.noOfColoursText ?? '')),
      makeVar('No. of Covers Per Sheet','noOfCoversPerSheet',    String(form.noOfCoversPerSheet ?? '')),
      makeVar('No. of Inside Plates','noOfInsidePlates',  String(form.noOfInsidePlates ?? '')),
      makeVar('No. of Cover Plates',   'noOfCoverPlates',       String(form.noOfCoverPlates ?? '')),
      makeVar('Waste Factor',           'wasteFactor',           String(form.wasteFactor ?? 0.1)),
      makeVar('Direct Labour',          'directLabour',          String(form.directLabour ?? 0.05)),
      makeVar('Margin %',               'marginPercentage',      String(form.marginPercentage ?? 35)),
      makeVar('Tax %',                  'taxPercentage',         String(form.taxPercentage ?? 20)),
      // Summary fields (JSON-encoded so the edit page can restore them)
      makeVar('Summaries',              'summaries',             JSON.stringify(form.summaries)),
    ];

    // ── Map tableRows → details (EstimateItem shape) ───────────────────────
    const details = form.tableRows.map(r => ({
      itemName:           r.description,
      quantity:           r.quantity ?? 0,
      unitPrice:          r.unitPrice ?? 0,
      isFormula:          false,
      isSteppingStone:    false,
      formulaOutput:      0,
      formulaId:          '',
      expression:         '',
      isPercentagePlugin: r.isPercentagePlugin ?? false,
      percentageTarget:   r.percentageTarget ?? '',
      percentageRate:     r.percentageRate ?? 0,
      // Extra fields stored for full round-trip reconstruction
      _category:          r.category,
      _inventoryItemId:   r.inventoryItemId ?? '',
      _variantName:       r.variantName ?? '',
      _optionName:        r.optionName ?? '',
      _computedTotal:     r.computedTotal ?? 0,
      quantityManuallyEdited: r.quantityManuallyEdited ?? false,
      _id:                r.id,
    }));

    const payload = {
      // Core booking fields
      businessName:         form.client,
      jobName:              form.jobName,
      quantity:             form.quantity,
      size:                 form.size,
      date:                 form.date,
      marginPercentage:     form.marginPercentage,
      isTemplate:           false,

      // Computed summary (for immediate display on retrieval)
      summary: {
        subTotal,
        unitCostOfProduction,
        marginAmount,
        totalExclVat,
        nhisGetFundAmount,
        vatAmount,
        grandTotal,
        taxRates: {
          nhisGetFund: (form.directLabour || 0) * 100,
          vat:         form.taxPercentage,
        },
      },

      // Line items
      details,

      // All new.vue-specific inputs encoded as variables for edit round-trip
      variables: headerVars,

      // Linking
      productionRequestId:     prodRequestId.value || undefined,
      estimatedCost:           grandTotal,
      description:             `${form.jobName || 'Estimate'} (Qty: ${form.quantity}, Size: ${form.size})`,
      taxes: [
        { taxName: 'Direct Labour', rate: (form.directLabour || 0) * 100, isPercentage: true, taxAmount: nhisGetFundAmount },
        { taxName: 'VAT',           rate: form.taxPercentage,              isPercentage: true, taxAmount: vatAmount },
      ],
    };

    let success: boolean;
    if (estimateId.value) {
      // Edit mode — pass the existing ID so the API can update
      success = await updateProductionEstimate({ ...payload, id: estimateId.value });
    } else {
      success = await createProductionEstimate(payload);
    }

    if (success) {
      $toast.success(estimateId.value ? 'Estimate updated successfully!' : 'Estimate saved successfully!');
      router.push('/estimates');
    } else {
      $toast.error('Failed to save estimate.');
    }
  } catch (e) {
    console.error(e);
    $toast.error('An error occurred while saving.');
  } finally {
    isSubmitting.value = false;
  }
};

// ── Edit-mode hydration ───────────────────────────────────────────────────────
/**
 * Loads an existing estimate from the API and hydrates the form so the user
 * can edit it exactly as it was originally created.
 * All new.vue-specific inputs were encoded as `variables` on save, so we
 * decode them here and let the existing watchers re-run all calculations.
 */
const loadEstimateForEdit = async (id: string) => {
  isLoadingRequest.value = true;
  try {
    const estimate = await getEstimateDetails(id) as any;
    if (!estimate) {
      $toast.error('Estimate not found.');
      return;
    }

    const vars: any[] = estimate.variables ?? [];

    // ── Restore header inputs from encoded variables ───────────────────────
    form.client             = estimate.businessName ?? '';
    form.jobName            = estimate.jobName ?? '';
    form.quantity           = estimate.quantity ?? null;
    form.size               = estimate.size ?? '';
    form.date               = estimate.date
      ? new Date(estimate.date).toISOString().split('T')[0]
      : getTodayFormatted();
    form.marginPercentage   = estimate.marginPercentage ?? 35;

    const toNum = (v: string | null) => (v !== null && v !== '' ? Number(v) : null);

    form.templateType       = (getVar(vars, 'templateType') as any) ?? 'bookwork';
    form.pages              = toNum(getVar(vars, 'pages'));
    form.pagesToView        = toNum(getVar(vars, 'pagesToView'));
    form.pagesOut           = toNum(getVar(vars, 'pagesOut'));
    form.noOfColoursCover   = toNum(getVar(vars, 'noOfColoursCover'));
    form.noOfColoursText    = toNum(getVar(vars, 'noOfColoursText'));
    form.noOfCoversPerSheet = toNum(getVar(vars, 'noOfCoversPerSheet'));
    form.noOfInsidePlates= toNum(getVar(vars, 'noOfInsidePlates'));
    form.noOfCoverPlates    = toNum(getVar(vars, 'noOfCoverPlates'));
    form.wasteFactor        = Number(getVar(vars, 'wasteFactor') ?? 0.1);
    form.directLabour       = Number(getVar(vars, 'directLabour') ?? 0.05);
    form.taxPercentage      = Number(getVar(vars, 'taxPercentage') ?? 20);

    // Restore summary fields if present
    const savedSummaries = getVar(vars, 'summaries');
    if (savedSummaries) {
      try { form.summaries = JSON.parse(savedSummaries); } catch { /* keep default */ }
    }

    // ── Reset template rows first, then patch quantities/prices from details ─
    onTemplateChange();

    const savedDetails: any[] = estimate.details ?? [];
    savedDetails.forEach(d => {
      // Try to match against an existing template row by description
      const match = form.tableRows.find(
        r => r.description.toLowerCase() === (d.itemName ?? '').toLowerCase()
      );
      if (match) {
        match.quantity  = d.quantity ?? null;
        match.unitPrice = d.unitPrice ?? null;
        if (match.isPercentagePlugin) {
          match.quantityManuallyEdited = d.quantityManuallyEdited ?? false;
          match.percentageRate   = d.percentageRate ?? 10;
          match.percentageTarget = d.percentageTarget ?? '';
          match.computedTotal    = d._computedTotal ?? 0;
        }
        if (d._inventoryItemId) match.inventoryItemId = d._inventoryItemId;
        if (d._variantName)     match.variantName     = d._variantName;
        if (d._optionName)      match.optionName      = d._optionName;
      }
    });

    // Re-apply paper inventory from the production request if still linked
    if (estimate.productionRequestId) {
      prodRequestId.value = estimate.productionRequestId;
      await applyPaperFromProductionRequest(estimate);
    }

  } catch (e) {
    console.error(e);
    $toast.error('Failed to load estimate for editing.');
  } finally {
    isLoadingRequest.value = false;
  }
};

// ── Initialization ────────────────────────────────────────────────────────────
onMounted(async () => {
  onTemplateChange();

  try {
    const result = await getRawMaterials({ pageNo: 1, pageSize: 200 });
    inventoryItems.value = result.data ?? [];
  } catch (e) {
    console.warn('Could not load inventory items:', e);
  }

  if (route.query.estimateId) {
    // Edit mode: load existing estimate and hydrate the form
    estimateId.value = route.query.estimateId as string;
    await loadEstimateForEdit(estimateId.value);
  } else if (route.query.productionRequestId) {
    prodRequestId.value = route.query.productionRequestId as string;
    await loadProductionRequest(prodRequestId.value);
  }
});
</script>
