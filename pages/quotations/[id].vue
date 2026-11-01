<template>
  <div class="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200 min-h-screen">
    <!-- Header Controls -->
    <div class="flex justify-between items-center mb-8 pb-4 border-b">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="text-gray-500 hover:text-gray-700 flex items-center gap-2">
          <ArrowLeft class="w-4 h-4" /> Back
        </button>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isConsolidated ? 'Edit Consolidated Quotation' : 'Edit Quotation' }}
        </h1>
      </div>
      <div class="flex items-center gap-3 print:hidden">
        <button v-if="!isPreviewMode" @click="isPreviewMode = true" class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <Eye class="w-4 h-4" /> Preview Quotation
        </button>
        <button v-if="isPreviewMode" @click="isPreviewMode = false" class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <Edit2 class="w-4 h-4" /> Edit Quotation
        </button>
        <button v-if="isPreviewMode" @click="sendEmail" :disabled="sendingEmail" class="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 disabled:opacity-50 flex items-center gap-2">
          <Send class="w-4 h-4" /> <span v-if="sendingEmail" class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></span> {{ sendingEmail ? 'Sending...' : 'Send via Email' }}
        </button>
        <button v-if="isPreviewMode" @click="downloadPDF" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2">
          <Download class="w-4 h-4" /> Download PDF
        </button>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>

    <!-- Edit Mode -->
    <div v-else-if="!isPreviewMode && quotation" class="space-y-8">
      <!-- Consolidated Estimate Selector -->
      <div v-if="isConsolidated" class="p-5 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-gray-700">Consolidated Estimates — add or remove estimates below</p>
          <span v-if="estimatesLoadingDetails" class="flex items-center gap-2 text-xs text-gray-500">
            <span class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></span>
            Loading...
          </span>
        </div>

        <VueMultiselect
          v-model="selectedEstimates"
          :options="availableEstimates"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Type to search by estimate number, business or job name..."
          label="estimateNumber"
          track-by="id"
          :custom-label="customEstimateLabel"
        >
          <template #selection="{ values, isOpen }">
            <span class="multiselect__single" v-if="values.length" v-show="!isOpen">
              {{ values.length }} estimate{{ values.length > 1 ? 's' : '' }} selected
            </span>
          </template>
        </VueMultiselect>

        <!-- Selected Estimate Cards -->
        <div v-if="selectedEstimates.length > 0" class="mt-3">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Selected ({{ selectedEstimates.length }})</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="est in selectedEstimates"
              :key="est.id"
              class="relative flex flex-col gap-1 bg-white border border-red-200 rounded-lg p-4 shadow-sm"
            >
              <button
                @click="removeEstimate(est)"
                class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <span class="text-xs font-bold text-red-600 uppercase">#{{ est.estimateNumber }}</span>
              <span class="text-sm font-semibold text-gray-800 pr-5">{{ est.jobName }}</span>
              <span class="text-xs text-gray-500">{{ est.businessName }}</span>
              <span v-if="est.estimatedCost" class="text-sm font-bold text-gray-900 mt-1">GH¢ {{ est.estimatedCost?.toLocaleString('en-GH', { minimumFractionDigits: 2 }) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quotation Header -->
      <div class="flex justify-between items-start">
        <div class="space-y-2 pt-6">
          <p class="font-bold text-lg">{{ formatDate(quotation.quotationDate || quotation.creationTime) }}</p>
          <p class="font-bold text-lg uppercase">QUOTATION No. {{ quotation.quotationNumber }}</p>
          <div class="mt-8 pt-4">
            <p>Dear Sir/Madam,</p>
            <p>We thank you for your enquiry and have the pleasure in submitting our quotation as follows:</p>
          </div>
        </div>

        <div class="text-right flex flex-col items-end">
          <img src="/img/gpak.jpeg" alt="G-PAK Limited Logo" class="h-16 w-auto mb-2" />
          <div class="text-xs text-gray-600">
            <p class="font-bold uppercase italic">Subsidiary of the Graphic Communications Group Limited</p>
            <p>No. 3 Graphic Road, P.O. Box GP 742, Accra, Ghana</p>
            <p>Tel: +233 302 684 000</p>
            <p>Direct: +233 302 666 052 / +233 302 674 071</p>
            <p>Fax: +233 302 675 364  E-mail: gpak@graphic.com.gh</p>
          </div>
          
          <div class="mt-8 font-bold text-lg uppercase text-right w-full">
            {{ quotation.businessName }}
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto border border-gray-400">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-gray-400 font-bold uppercase bg-gray-50">
            <tr>
              <th class="p-3 border-r border-gray-400 w-1/4">DESC.</th>
              <th class="p-3 border-r border-gray-400">Size(MM)</th>
              <th class="p-3 border-r border-gray-400">Paper GSM</th>
              <th class="p-3 border-r border-gray-400">COLOUR</th>
              <th class="p-3 border-r border-gray-400 text-center">QTY</th>
              <th class="p-3 border-r border-gray-400 text-right">UNIT (GH¢)</th>
              <th v-if="nhilTaxRate > 0" class="p-3 border-r border-gray-400 text-right">{{ nhilTaxRate }}%<br>NHIL/GETF/COVID</th>
              <th v-if="vatTaxRate > 0" class="p-3 border-r border-gray-400 text-right">{{ vatTaxRate }}%<br>VAT</th>
              <th class="p-3 text-right">TOTAL (GH¢)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in quotationDetails" :key="index" class="border-b border-gray-200 last:border-b-0">
              <td class="p-3 border-r border-gray-400 align-top whitespace-pre-wrap">{{ item.itemName }}</td>
              <td class="p-3 border-r border-gray-400 align-top whitespace-pre-wrap">{{ item.size }}</td>
              <td class="p-3 border-r border-gray-400 align-top whitespace-pre-wrap">{{ item.paperGsm }}</td>
              <td class="p-3 border-r border-gray-400 align-top whitespace-pre-wrap">{{ item.colour }}</td>
              <td class="p-3 border-r border-gray-400 text-center align-top">{{ item.quantity }}</td>
              <td class="p-3 border-r border-gray-400 text-right align-top">{{ formatCurrency(item.unitPrice) }}</td>
              <td class="p-3 border-r border-gray-400 text-right align-top">
                {{ formatCurrency(item.getflNhil) }}
              </td>
              <td class="p-3 border-r border-gray-400 text-right align-top">
                {{ formatCurrency(item.vatTax) }}
              </td>
              <td class="p-3 text-right align-top font-bold">
                {{ formatCurrency((item.unitPrice || 0)) }}
              </td>
            </tr>
            <tr class="font-bold border-t-2 border-gray-400">
               <td class="p-3 border-r border-gray-400 text-right uppercase" colspan="8">Total Amount</td>
               <td class="p-3 text-right text-lg">{{ formatCurrency(totalAmount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Additional Details Form -->
      <div class="space-y-4 pt-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          <label class="md:col-span-2 font-bold uppercase text-sm mt-2">SPECIFICATION:</label>
          <div class="md:col-span-10">
            <textarea 
              v-model="form.specification" 
              rows="3" 
              class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500" 
              placeholder="e.g. Print 1/4-colour inside, 4-colour process on cover..."
            ></textarea>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <label class="md:col-span-2 font-bold uppercase text-sm">ORIGINATION:</label>
          <div class="md:col-span-10">
            <input 
              v-model="form.origination" 
              type="text" 
              class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500" 
              placeholder="e.g. Artwork supplied"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <label class="md:col-span-2 font-bold uppercase text-sm">TERMS:</label>
          <div class="md:col-span-10">
            <input 
              v-model="form.terms" 
              type="text" 
              class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500" 
              placeholder="e.g. 60% part payment and the balance on delivery"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <label class="md:col-span-2 font-bold uppercase text-sm">VALIDITY:</label>
          <div class="md:col-span-5">
            <input 
              v-model="form.validUntil" 
              type="datetime-local" 
              class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500" 
            />
          </div>
          <div class="md:col-span-5 flex items-center">
            <span class="mr-2 font-bold uppercase text-sm whitespace-nowrap">DAYS:</span>
            <input 
              :value="validityDays" 
              type="text" 
              readonly
              class="w-full border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed" 
              placeholder="Calculated automatically"
            />
          </div>
        </div>

        <!-- Signatory Selectors -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mt-4 border-t pt-6">
          <label class="md:col-span-2 font-bold uppercase text-sm">SIGNATORIES:</label>
          <div class="md:col-span-5">
            <select v-model="form.firstSignatoryId" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500">
              <option value="">Select First Signatory...</option>
              <option v-for="sig in signatoriesList" :key="sig.id" :value="sig.id">{{ sig.name }} - {{ sig.designation }}</option>
            </select>
          </div>
          <div class="md:col-span-5">
            <select v-model="form.secondSignatoryId" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500">
              <option value="">Select Second Signatory...</option>
              <option v-for="sig in signatoriesList" :key="sig.id" :value="sig.id">{{ sig.name }} - {{ sig.designation }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4 pt-12 border-t mt-12 print:hidden">
        <button 
          @click="submitUpdate" 
          :disabled="isSubmitting"
          class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
        >
          <span v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
          {{ isSubmitting ? 'Updating...' : 'Update Quotation' }}
        </button>
      </div>
    </div>

    <!-- Preview Mode -->
    <div v-else-if="isPreviewMode && quotation" class="bg-white mx-auto mt-4 border border-gray-200 shadow-sm print:border-none print:shadow-none" style="width: 210mm; min-height: 297mm; padding: 15mm;" id="quotation-print-area">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div>
          <img src="/img/gpak.jpeg" alt="G-PAK Limited" class="h-16 mb-2" /> 
        </div>
        <div class="text-right text-xs">
           <h1 class="text-2xl font-black italic tracking-tighter text-gray-900 mb-1">G-PAK LIMITED</h1>
           <p class="font-bold uppercase italic">Subsidiary of the Graphic Communications Group Limited</p>
           <p>No. 3 Graphic Road, P.O. Box GP 742, Accra</p>
           <p>Tel: +233 302 684 000</p>
           <p>Direct: +233 302 666 052 / +233 302 674 071</p>
           <p>Fax: +233 302 675 364  E-mail: gpak@graphic.com.gh</p>
        </div>
      </div>

      <!-- Date and Info -->
      <div class="flex justify-between items-end mb-6 border-b-2 border-black pb-2">
        <div>
            <p class="font-bold text-lg mb-1">{{ formatDate(quotation.quotationDate || quotation.creationTime) }}</p>
            <p class="font-bold text-lg">QUOTATION No. {{ quotation.quotationNumber }}</p>
        </div>
        <div class="text-right">
             <h2 class="font-bold text-lg uppercase">{{ quotation.businessName }}</h2>
        </div>
      </div>

      <!-- Salutation -->
      <div class="mb-4 text-sm font-medium">
        <p>Dear Sir/Madam,</p>
        <p>We thank you for your enquiry and have the pleasure in submitting our quotation as follows:</p>
      </div>

      <!-- Table -->
      <div class="mb-6">
        <table class="w-full border-collapse border border-black text-xs">
          <thead>
            <tr class="font-bold text-center bg-gray-50">
              <th class="border border-black p-1 w-1/4">DESC.</th>
              <th class="border border-black p-1">Size(MM)</th>
              <th class="border border-black p-1">Paper GSM</th>
              <th class="border border-black p-1">COLOUR</th>
              <th class="border border-black p-1">QTY</th>
              <th class="border border-black p-1">UNIT<br>(GH¢)</th>
              <th class="border border-black p-1">{{ nhilTaxRate }}%<br>NHIL/<br>GETF/<br>COVID</th>
              <th class="border border-black p-1">{{ vatTaxRate }}%<br>VAT</th>
              <th class="border border-black p-1">TOTAL<br>(GH¢)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in quotationDetails" :key="index" class="text-center align-top min-h-32">
              <td class="border border-black p-2 text-left whitespace-pre-wrap">
                  <span class="font-bold block mb-1">{{ item.itemName }}</span>
              </td>
              <td class="border border-black p-2">{{ item.size }}</td>
              <td class="border border-black p-2 whitespace-pre-wrap">{{ item.paperGsm }}</td>
              <td class="border border-black p-2">{{ item.colour }}</td>
              <td class="border border-black p-2">{{ item.quantity }}</td>
              <td class="border border-black p-2">{{ formatCurrency(item.unitPrice) }}</td>
              <td class="border border-black p-2">{{ formatCurrency(item.getflNhil) }}</td>
              <td class="border border-black p-2">{{ formatCurrency(item.vatTax) }}</td>
              <td class="border border-black p-2 font-bold">{{ formatCurrency((item.unitPrice || 0)) }}</td>
            </tr>
            <tr class="font-bold border-t-2 border-black bg-gray-50">
               <td class="border border-black p-2 text-right uppercase" colspan="8">Total Amount</td>
               <td class="border border-black p-2 text-right text-sm">{{ formatCurrency(totalAmount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Specs and Terms -->
      <div class="text-xs space-y-2 mb-8 font-medium">
        <div class="grid grid-cols-[100px_1fr] gap-2">
            <span class="font-bold uppercase">SPECIFICATION:</span>
            <span class="whitespace-pre-wrap">{{ form.specification }}</span>
        </div>
        <div class="grid grid-cols-[100px_1fr] gap-2">
            <span class="font-bold uppercase">ORIGINATION:</span>
            <span>{{ form.origination }}</span>
        </div>
        <div class="grid grid-cols-[100px_1fr] gap-2">
            <span class="font-bold uppercase">TERMS:</span>
            <span>{{ form.terms }}</span>
        </div>
        <div class="grid grid-cols-[100px_1fr] gap-2">
            <span class="font-bold uppercase">VALIDITY:</span>
            <span>{{ validityDays }}</span>
        </div>
        
        <p class="mt-4 text-justify leading-tight">
            This Quotation is given subject to any revision in price and the availability of materials the Standard Conditions of the Printing Trade and such Conditions shall be deemed to be embodied in any Contract arising out of this Estimate and the acceptance thereof, unless otherwise provided. Quantities stated above are subject to a +/-5% change.
        </p>
        
        <p class="font-bold italic mt-2">Prices quoted include statutory charges. (VAT)</p>

         <div class="mt-4">
            <p class="font-bold decoration-underline uppercase">TRANSFER</p>
            <p><span class="italic font-bold uppercase">BANK:</span> G-Pak Limited</p>
            <p class="pl-10 italic">GCB Bank Limited</p>
            <p class="pl-10 italic">High Street; 1011130028940</p>
            <p><span class="italic font-bold uppercase">MOMO:</span> 0241982631 (G-Pak Limited)</p>
            <p class="font-bold italic mt-2">Kindly indicate your name when making a transfer for easy acknowledgment of receipt.</p>
            <p>We trust we shall be favoured with your esteemed order, which will receive our prompt and careful attention.</p>
         </div>
      </div>

       <!-- Signatories -->
      <div class="mt-12 flex justify-between items-end">
          <div>
              <p class="italic mb-6">Yours faithfully,<br>for G-Pak Limited.</p>
               <div class="h-12 w-48 mb-2 border-b border-black"></div> <!-- Signature Placeholder -->
              <template v-if="firstSignatory">
                <p class="font-bold">{{ firstSignatory.name }}</p>
                <p class="italic font-bold">({{ firstSignatory.designation }})</p>
                <p class="italic font-bold" v-if="firstSignatory.phoneNo">({{ firstSignatory.phoneNo }})</p>
              </template>
          </div>
           <div class="text-center flex flex-col items-center">
              <div class="h-12 w-48 mb-2 border-b border-black"></div> <!-- Signature Placeholder -->
              <template v-if="secondSignatory">
                <p class="font-bold">{{ secondSignatory.name }}</p>
                <p class="italic font-bold">({{ secondSignatory.designation }})</p>
                <p class="italic font-bold" v-if="secondSignatory.phoneNo">({{ secondSignatory.phoneNo }})</p>
              </template>
          </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!quotation && !loading" class="text-center py-12">
      <p class="text-red-500">Quotation not found.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter, useNuxtApp, useHead } from '#app';
import { getQuotationDetails, updateQuotation, sendQuotationToCustomer } from '~/services/quotations';
import { getEstimateDetails, getProductionEstimates } from '~/services/estimates';
import { getSignatories } from '~/services/signatories';
import type { Quotation, Signatory } from '~/models';
import { ArrowLeft, Download, Send, Eye, Edit2 } from 'lucide-vue-next';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

useHead({
  title: 'Quotation Details'
})

const route = useRoute();
const router = useRouter();
const { $toast } = useNuxtApp();

const quotation = ref<Quotation | null>(null);
const loading = ref(true);
const sendingEmail = ref(false);
const isSubmitting = ref(false);
const isPreviewMode = ref(false);

// Determines if this is a consolidated quotation (multiple estimationIds)
const isConsolidated = computed(() => {
  return Array.isArray(quotation.value?.estimationIds) && (quotation.value?.estimationIds?.length ?? 0) > 1;
});

const totalAmount = computed(() => {
  if (!quotationDetails.value || quotationDetails.value.length === 0) {
    return quotation.value ? parseFloat(quotation.value.quotedPrice) : 0;
  }
  return quotationDetails.value.reduce((sum, item) => sum + (parseFloat(item.unitPrice) || 0), 0);
});

const form = ref({
  specification: '',
  origination: 'Artwork supplied',
  terms: '60% part payment and the balance on delivery',
  validUntil: '',
  validityInDays: 0,
  firstSignatoryId: '',
  secondSignatoryId: ''
});

const signatoriesList = ref<Signatory[]>([]);
const quotationDetails = ref<any[]>([]);

// --- Consolidated estimate management ---
const availableEstimates = ref<any[]>([]);
const selectedEstimates = ref<any[]>([]);
const estimatesLoadingDetails = ref(false);

const customEstimateLabel = (option: any) => {
  return `#${option.estimateNumber} - ${option.businessName} - ${option.jobName}`;
};

const removeEstimate = (est: any) => {
  selectedEstimates.value = selectedEstimates.value.filter(e => e.id !== est.id);
};

const buildQuotationDetailsFromEstimates = (validResults: any[]) => {
  quotationDetails.value = validResults.map(est => {
    const nhil = est.taxes?.find((tax: any) => tax.taxName.includes('NHIS') || tax.taxName.includes('GETFUND') || tax.taxName.includes('COVID'));
    const vat = est.taxes?.find((tax: any) => tax.taxName.includes('VAT'));
    return {
      itemName: est.jobName ?? '',
      size: est.size || 'N/A',
      paperGsm: est.paperInside ? `${est.paperInside}\n${est.paperCover}` : 'N/A',
      colour: est.noOfColoursText ? `${est.noOfColoursText}/${est.noOfColoursCover}` : 'N/A',
      quantity: est.pages ? `${est.quantity}/${est.pages} pages` : `${est.quantity}`,
      unitPrice: est.estimatedCost,
      getflNhil: nhil ? nhil.taxAmount : 0,
      vatTax: vat ? vat.taxAmount : 0,
    };
  });
};

// Watch selected estimates and rebuild quotation details reactively
watch(selectedEstimates, async (newSelection) => {
  if (!isConsolidated.value) return;
  if (newSelection.length === 0) {
    quotationDetails.value = [];
    return;
  }

  // Validate: all estimates must belong to the same business
  const primaryBusiness = newSelection[0].businessName;
  const allSameBusiness = newSelection.every(e => e.businessName === primaryBusiness);
  if (!allSameBusiness) {
    $toast.warning('Selected estimates must belong to the same customer. Reverting last selection.');
    selectedEstimates.value = newSelection.filter(e => e.businessName === primaryBusiness);
    return;
  }

  estimatesLoadingDetails.value = true;
  try {
    const ids = newSelection.map(e => e.id);
    const results = await Promise.all(ids.map(id => getEstimateDetails(id)));
    const valid = results.filter(r => r != null);
    buildQuotationDetailsFromEstimates(valid);
  } catch (err) {
    console.error('Error loading estimate details:', err);
    $toast.error('Failed to reload estimate details.');
  } finally {
    estimatesLoadingDetails.value = false;
  }
}, { deep: true });

const loadAvailableEstimates = async () => {
  try {
    const data = await getProductionEstimates({ pageSize: 1000, pageNo: 1 });
    if (data && data.data) {
      availableEstimates.value = data.data;
    }
  } catch (err) {
    console.error('Error loading available estimates:', err);
  }
};

const firstSignatory = computed(() => {
  return signatoriesList.value.find(s => s.id === form.value.firstSignatoryId);
});

const secondSignatory = computed(() => {
  return signatoriesList.value.find(s => s.id === form.value.secondSignatoryId);
});

const selectedSignatories = computed<Signatory[]>(() => {
  const list: Signatory[] = [];
  if (firstSignatory.value) list.push(firstSignatory.value);
  if (secondSignatory.value) list.push(secondSignatory.value);
  return list;
});

const validityDays = computed(() => {
  if (!form.value.validUntil) return '0 days';
  const now = new Date();
  const validUntilDate = new Date(form.value.validUntil);
  const diffTime = validUntilDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  form.value.validityInDays = diffDays > 0 ? diffDays : 0;
  return diffDays > 0 ? `${diffDays} days` : '0 days';
});

// Tax rates: try to read from quotation taxes; fall back to standard Ghana rates (6% NHIL, 15% VAT)
const nhilTaxRate = computed(() => {
  if (!quotation.value?.taxes) return 6;
  const tax = quotation.value.taxes.find((t: any) => t.taxName.includes('NHIL') || t.taxName.includes('GETFUND') || t.taxName.includes('COVID'));
  return tax ? tax.rate : 6;
});

const vatTaxRate = computed(() => {
  if (!quotation.value?.taxes) return 15;
  const tax = quotation.value.taxes.find((t: any) => t.taxName.includes('VAT'));
  return tax ? tax.rate : 15;
});

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();
};

const formatCurrency = (value: number) => {
  if (value == null) return '0.00';
  return value.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const loadSignatories = async () => {
  try {
    const data = await getSignatories({ pageSize: 100, pageNo: 1 });
    if (data && data.data) {
      signatoriesList.value = data.data;
    }
  } catch (error) {
    console.error('Error fetching signatories:', error);
  }
};

const loadQuotation = async () => {
    const id = route.params.id as string;
    if (!id) {
        loading.value = false;
        return;
    }
    
    try {
        const result = await getQuotationDetails({ id: id }); 
        if (result) {
            quotation.value = result;

            // Map API details fields correctly
            quotationDetails.value = (result.details || []).map((d: any) => ({
              itemName: d.itemName,
              size: d.size ?? '',
              paperGsm: d.paperGsm ?? '',
              colour: d.colour ?? '',
              quantity: d.quantity ?? '',
              unitPrice: d.unitPrice ?? d.unitCost ?? 0,
              getflNhil: d.getflNhil ?? d.totalTax ?? 0,
              vatTax: d.vatTax ?? 0,
            }));
            
            // Pre-fill form
            form.value.specification = result.specification;
            form.value.origination = result.origination || 'Artwork supplied';
            form.value.terms = result.terms || '60% part payment and the balance on delivery';
            
            // Convert validUntil to format required for datetime-local
            if (result.validUntil) {
              const d = new Date(result.validUntil);
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              const hh = String(d.getHours()).padStart(2, '0');
              const mins = String(d.getMinutes()).padStart(2, '0');
              form.value.validUntil = `${yyyy}-${mm}-${dd}T${hh}:${mins}`;
            }

            // For consolidated quotations, load the available estimates pool and
            // pre-select the ones currently linked to this quotation
            if (Array.isArray(result.estimationIds) && result.estimationIds.length > 1) {
              await loadAvailableEstimates();
              // Pre-select the estimates that match the saved estimationIds
              selectedEstimates.value = availableEstimates.value.filter(
                (e: any) => result.estimationIds.includes(e.id)
              );
            }

            // Pre-fill signatories from saved data
            if (result.signatories && result.signatories.length > 0) {
              form.value.firstSignatoryId = result.signatories[0]?.id || '';
              if (result.signatories.length > 1) {
                form.value.secondSignatoryId = result.signatories[1]?.id || '';
              }
            }
        } else {
            $toast.error('Quotation not found.');
        }
    } catch (error) {
        console.error(error);
        $toast.error('Error fetching quotation details.');
    } finally {
        loading.value = false;
    }
};

const submitUpdate = async () => {
  if (!quotation.value) return;
  
  isSubmitting.value = true;
  try {
    const payload: any = {
      id: quotation.value.id,
      quotedPrice: parseFloat(totalAmount.value.toString()),
      specification: form.value.specification,
      origination: form.value.origination,
      terms: form.value.terms,
      validityInDays: form.value.validityInDays,
      validUntil: form.value.validUntil,
      signatories: selectedSignatories.value.map(s => ({
        id: s.id,
        name: s.name,
        designation: s.designation,
        phoneNo: s.phoneNo,
        signatureImageUrl: s.signatureImageUrl
      })),
      details: quotationDetails.value,
      quotationNumber: quotation.value.quotationNumber,
      productionRequestId: quotation.value.productionRequestId,
      discount: quotation.value.discount || 0,
      businessName: quotation.value.businessName,
      fullName: quotation.value.fullName,
      email: quotation.value.email,
      phoneNumber: quotation.value.phoneNumber
    };

    // For consolidated quotations, send the current selected estimates' IDs
    // (may have changed if user added/removed estimates); for singular, keep original
    if (isConsolidated.value && selectedEstimates.value.length > 0) {
      payload.estimationIds = selectedEstimates.value.map((e: any) => e.id);
    } else if (quotation.value.estimationIds) {
      payload.estimationIds = quotation.value.estimationIds;
    }

    const success = await updateQuotation(payload);
    
    if (success) {
      $toast.success('Quotation updated successfully');
      // Sync local state so preview reflects edits immediately
      quotation.value.quotedPrice = totalAmount.value.toString();
      quotation.value.specification = form.value.specification;
      quotation.value.origination = form.value.origination;
      quotation.value.terms = form.value.terms;
      quotation.value.validUntil = form.value.validUntil;
      quotation.value.validityInDays = form.value.validityInDays;
      quotation.value.signatories = payload.signatories;
      
      isPreviewMode.value = true;
    } else {
      $toast.error('Failed to update quotation');
    }
  } catch (error) {
    console.error('Error updating quotation:', error);
    $toast.error('An error occurred while updating the quotation');
  } finally {
    isSubmitting.value = false;
  }
};

const downloadPDF = async () => {
  if (typeof window === 'undefined') return;
  
  const element = document.getElementById('quotation-print-area');
  if (!element) return;
  
  const html2pdf = (await import('html2pdf.js')).default;
  
  const opt = {
    margin: 0, 
    filename: `Quotation_${quotation.value?.quotationNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(element).set(opt).save();
};

const sendEmail = async () => {
    if (!quotation.value) return;
    sendingEmail.value = true;
    try {
        const success = await sendQuotationToCustomer({ id: quotation.value.id });
        if (success) {
            $toast.success('Quotation sent to customer email successfully.');
        } else {
            $toast.error('Failed to send email.');
        }
    } catch (error) {
        $toast.error('Error sending email.');
    } finally {
        sendingEmail.value = false;
    }
};

onMounted(async () => {
  await loadSignatories();
  await loadQuotation();
});
</script>

<style scoped>
#quotation-print-area {
    font-family: 'Times New Roman', Times, serif;
}
@media print {
  @page { margin: 0.5cm; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .max-w-7xl { max-width: 100% !important; margin: 0; border: none; box-shadow: none; padding: 0; }
  .print\:hidden { display: none !important; }
}
</style>
