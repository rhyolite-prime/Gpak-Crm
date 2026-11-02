<template>
  <div class="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200 min-h-screen">

    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8 pb-4 border-b">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">New Production Request</h2>
        <p class="mt-1 text-sm text-gray-600">Fill in the specification form below</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/production-requests" class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-2">Back to List</NuxtLink>
      </div>
    </div>

    <div>
      <form @submit.prevent="submitRequest" ref="formRef">

        <!-- ───────────────────── BASIC INFO ───────────────────── -->
        <section class="mb-8">
          <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 border-b-2 border-red-600 pb-2 mb-6 inline-block bg-white">Basic Info</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div class="flex flex-col gap-1">
              <label for="customer" class="text-sm font-semibold text-gray-700">Business Name <span class="text-red-500">*</span></label>
              <input id="customer" v-model="form.customer" type="text" :class="['w-full border rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white', v$.customer.$error ? 'border-red-500 bg-red-50' : 'border-gray-300']" placeholder="e.g. Esther Adjei" />
              <span v-if="v$.customer.$error" class="text-xs text-red-500">Business Name is required</span>
            </div>

            <div class="flex flex-col gap-1">
              <label for="contactName" class="text-sm font-semibold text-gray-700">Contact Name <span class="text-red-500">*</span></label>
              <input id="contactName" v-model="form.contactName" type="text" :class="['w-full border rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white', v$.contactName.$error ? 'border-red-500 bg-red-50' : 'border-gray-300']" />
              <span v-if="v$.contactName.$error" class="text-xs text-red-500">Contact Name is required</span>
            </div>

            <div class="flex flex-col gap-1">
              <label for="phoneNo" class="text-sm font-semibold text-gray-700">Tel <span class="text-red-500">*</span></label>
              <input id="phoneNo" v-model="form.phoneNo" type="tel" :class="['w-full border rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white', v$.phoneNo.$error ? 'border-red-500 bg-red-50' : 'border-gray-300']" />
              <span v-if="v$.phoneNo.$error" class="text-xs text-red-500">Telephone number is required</span>
            </div>

            <div class="flex flex-col gap-1">
              <label for="emailAddress" class="text-sm font-semibold text-gray-700">Email Address <span class="text-red-500">*</span></label>
              <input id="emailAddress" v-model="form.emailAddress" type="email" :class="['w-full border rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white', v$.emailAddress.$error ? 'border-red-500 bg-red-50' : 'border-gray-300']" />
              <span v-if="v$.emailAddress.$error" class="text-xs text-red-500">Valid email is required</span>
            </div>

            <div class="flex flex-col gap-1">
              <label for="location" class="text-sm font-semibold text-gray-700">Location</label>
              <input id="location" v-model="form.location" type="text" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="serviceCategoryId" class="text-sm font-semibold text-gray-700">Service Category <span class="text-red-500">*</span></label>
              <select id="serviceCategoryId" v-model="form.serviceCategoryId" :class="['w-full border rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white', v$.serviceCategoryId.$error ? 'border-red-500 bg-red-50' : 'border-gray-300']" @change="onServiceCategoryChange">
                <option value="">Select a category</option>
                <option v-for="cat in estimateTypeList" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <span v-if="v$.serviceCategoryId.$error" class="text-xs text-red-500">Service Category is required</span>
            </div>

          </div>
        </section>

        <hr class="border-t border-gray-200 mb-8" />

        <!-- ───────────────────── JOB REQUESTS ───────────────────── -->
        <section class="mb-8">
          <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 border-b-2 border-red-600 pb-2 mb-6 inline-block bg-white">Request Details</h3>

          <div
            v-for="(job, index) in form.jobRequests"
            :key="index"
            class="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6"
          >
            <!-- Job Card Header -->
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h4 class="text-lg font-bold text-gray-900">Job Request {{ index + 1 }}</h4>
              <button
                type="button"
                @click="removeJob(index)"
                class="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-semibold hover:bg-red-100 transition-colors flex items-center gap-1"
                v-if="form.jobRequests.length > 1"
              >
                ✕ Remove
              </button>
            </div>

            <!-- Row: Job Name & Pages -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col gap-1">
                <label :for="'jobName-' + index" class="text-sm font-semibold text-gray-700">Job Name(s)</label>
                <input
                  type="text"
                  :id="'jobName-' + index"
                  v-model="job.jobName"
                  class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white"
                  placeholder="e.g. My First Copy Book"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label :for="'pages-' + index" class="text-sm font-semibold text-gray-700">Pages</label>
                <input type="number" :id="'pages-' + index" v-model="job.pages" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
              </div>
            </div>

            <!-- Row: Quantity & Paper Cover -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col gap-1">
                <label :for="'quantity-' + index" class="text-sm font-semibold text-gray-700">Quantity</label>
                <input type="number" :id="'quantity-' + index" v-model="job.quantity" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
              </div>
              <div class="flex flex-col gap-1">
                <label :for="'paperCover-' + index" class="text-sm font-semibold text-gray-700">Paper Cover</label>
                <select
                  :id="'paperCover-' + index"
                  v-model="job.paperCoverRawMaterialId"
                  class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white"
                  @change="updatePaperCover(job, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="">Select Paper Cover</option>
                  <option v-for="m in rawMaterialsList" :key="m.id" :value="m.id">{{ m.name }}</option>
                </select>
              </div>
            </div>

            <!-- Row: Paper Cover Variant & Paper Inside -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col gap-1">
                <label :for="'paperCoverVariant-' + index" class="text-sm font-semibold text-gray-700">Paper Cover Variant</label>
                <select
                  :id="'paperCoverVariant-' + index"
                  v-model="job.paperCoverVariant"
                  class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                  :disabled="!job.paperCoverRawMaterialId || getPaperCoverVariants(job).length === 0"
                >
                  <option value="">Select Variant</option>
                  <option
                    v-for="variant in getPaperCoverVariants(job)"
                    :key="variant.name"
                    :value="variant.name"
                  >{{ variant.name }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label :for="'paperInside-' + index" class="text-sm font-semibold text-gray-700">Paper Inside</label>
                <select
                  :id="'paperInside-' + index"
                  v-model="job.paperInsideRawMaterialId"
                  class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white"
                  @change="updatePaperInside(job, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="">Select Paper Inside</option>
                  <option v-for="m in rawMaterialsList" :key="m.id" :value="m.id">{{ m.name }}</option>
                </select>
              </div>
            </div>

            <!-- Row: Paper Inside Variant & Colours Text -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col gap-1">
                <label :for="'paperInsideVariant-' + index" class="text-sm font-semibold text-gray-700">Paper Inside Variant</label>
                <select
                  :id="'paperInsideVariant-' + index"
                  v-model="job.paperInsideVariant"
                  class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                  :disabled="!job.paperInsideRawMaterialId || getPaperInsideVariants(job).length === 0"
                >
                  <option value="">Select Variant</option>
                  <option
                    v-for="variant in getPaperInsideVariants(job)"
                    :key="variant.name"
                    :value="variant.name"
                  >{{ variant.name }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label :for="'coloursText-' + index" class="text-sm font-semibold text-gray-700">No. of Colours Text</label>
                <select :id="'coloursText-' + index" v-model="job.noOfColoursText" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>

            <!-- Row: Colours Cover & Size -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col gap-1">
                <label :for="'coloursCover-' + index" class="text-sm font-semibold text-gray-700">No. of Colours Cover</label>
                <select :id="'coloursCover-' + index" v-model="job.noOfColoursCover" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label :for="'size-' + index" class="text-sm font-semibold text-gray-700">Size</label>
                <select :id="'size-' + index" v-model="job.size" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="">Select a size</option>
                  <option>A2 - 420 x 594mm</option>
                  <option>A3 - 297 x 420mm</option>
                  <option>A4 - 210 x 297mm</option>
                  <option>A5 - 148 x 210mm</option>
                  <option>Quarto - 180 x 240mm</option>
                  <option value="custom">Custom size</option>
                </select>
              </div>
            </div>

            <!-- Custom Size -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4" v-if="job.size === 'custom'">
              <div class="flex flex-col gap-1">
                <label :for="'customSize-' + index" class="text-sm font-semibold text-gray-700">Custom Size <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  :id="'customSize-' + index"
                  v-model="job.customSize"
                  :class="['w-full border rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white', (!job.customSize && isSubmitting) ? 'border-red-500 bg-red-50' : 'border-gray-300']"
                  placeholder="e.g. 100 x 200mm"
                />
                <span v-if="!job.customSize && isSubmitting" class="text-xs text-red-500">Custom size is required</span>
              </div>
              <div></div>
            </div>

            <FinishingOptions :model="job" :name-prefix="'job-' + index" :binding-options="bindingOptions" :add-options="addOptions" :laminate-options="laminateOptions" :vanish-options="vanishOptions" :spot-options="spotOptions" @surface-change="clearOtherFinishingOptions(job, $event)" />

            <!-- Other Instructions -->
            <div class="flex flex-col gap-1 mt-6">
              <label :for="'instructions-' + index" class="text-sm font-semibold text-gray-700">Other Instructions</label>
              <textarea
                :id="'instructions-' + index"
                v-model="job.otherInstructions"
                rows="3"
                class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white"
              ></textarea>
            </div>

          </div>
          <!-- END job-card loop -->

          <div class="text-center mt-6">
            <button type="button" @click="addJob" class="px-6 py-2 bg-white text-gray-700 border-2 border-dashed border-gray-300 rounded-lg font-semibold hover:border-red-500 hover:text-gray-900 transition-colors inline-flex items-center">
              + Add Another Job Request
            </button>
          </div>
        </section>

        <!-- Actions -->
      <div class="flex justify-end gap-4 pt-8 pb-4 border-t border-gray-200 mt-8 print:hidden">
        <button 
          @click="$router.back()" 
          type="button"
          class="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button 
          type="submit" :disabled="isSubmitting"
          class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
        >
          <span v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
          {{ isSubmitting ? 'Please wait...' : 'Submit Request' }}
        </button>
      </div>

      </form>
    </div>
  </div>
</template>



<script setup lang="ts">
import { bindingOptions, addOptions, laminateOptions, vanishOptions, spotOptions } from '~/utils/productionFinishingOptions';
import FinishingOptions from '~/components/ui/FinishingOptions.vue';
import { serializeFinishingOptions } from '~/utils/finishingOptions';

import { useRoute, useRouter, useNuxtApp } from '#app';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import type { RawMaterial, EstimateType, RawMaterialVariant } from '~/models';


const { $toast } = useNuxtApp();
const router = useRouter();

// ── State ─────────────────────────────────────────────────────────────────────
const formRef = ref<HTMLFormElement | null>(null);
const isSubmitting = ref(false);
const rawMaterialsList = ref<RawMaterial[]>([]);
const estimateTypeList = ref<EstimateType[]>([]);

// ── Default job factory ───────────────────────────────────────────────────────
const getDefaultJob = () => ({
  jobName: '',
  pages: 1,
  quantity: 1,
  paperCover: '',
  paperCoverRawMaterialId: '',
  paperCoverVariant: '',
  paperInside: '',
  paperInsideRawMaterialId: '',
  paperInsideVariant: '',
  noOfColoursText: 1,
  noOfColoursCover: 1,
  size: '',
  customSize: '',
  binding: '',
  bindingCustom: '',
  addons: [] as string[],
  addonsCustom: '',
  laminate: '',
  laminateCustom: '',
  vanish: '',
  vanishCustom: '',
  spot: '',
  spotCustom: '',
  windowPatching: '',
  windowPatchingCustom: '',
  otherInstructions: '',
});

// ── Main form state ───────────────────────────────────────────────────────────
const form = reactive({
  customer: '',
  contactName: '',
  phoneNo: '',
  emailAddress: '',
  location: '',
  serviceCategoryId: '',
  serviceCategoryName: '',
  jobRequests: [getDefaultJob()],
});

// ── Validation Rules ──────────────────────────────────────────────────────────
const rules = {
  customer: { required },
  contactName: { required },
  phoneNo: { required },
  emailAddress: { required, email },
  serviceCategoryId: { required }
};

const v$ = useVuelidate(rules, form);

// ── Validation Helpers ────────────────────────────────────────────────────────
const focusFirstInvalidField = () => {
  if (v$.value.$invalid) {
    const errorFields = ['customer', 'contactName', 'phoneNo', 'emailAddress', 'serviceCategoryId'];
    for (const field of errorFields) {
      if (v$.value[field]?.$invalid) {
        const input = document.getElementById(field);
        if (input) {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          input.focus();
          
          input.style.transition = 'background-color 0.3s ease';
          input.style.backgroundColor = '#fef2f2'; // light red background
          setTimeout(() => {
            input.style.backgroundColor = '';
          }, 2000);
          return;
        }
      }
    }
  }

  // Check custom size validation errors
  const invalidJob = form.jobRequests.find(j => j.size === 'custom' && !j.customSize);
  if (invalidJob) {
    const index = form.jobRequests.indexOf(invalidJob);
    const input = document.getElementById(`customSize-${index}`);
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus();
      
      input.style.transition = 'background-color 0.3s ease';
      input.style.backgroundColor = '#fef2f2';
      setTimeout(() => {
        input.style.backgroundColor = '';
      }, 2000);
      return;
    }
  }
};

// ── Service category helper ───────────────────────────────────────────────────
const onServiceCategoryChange = () => {
  const cat = estimateTypeList.value.find(c => c.id === form.serviceCategoryId);
  form.serviceCategoryName = cat?.name ?? '';
};

// ── Variant helpers ───────────────────────────────────────────────────────────
const getVariantsForMaterial = (materialId: string): RawMaterialVariant[] => {
  const mat = rawMaterialsList.value.find(m => m.id === materialId);
  return mat?.variants ?? [];
};

const getPaperCoverVariants = (job: ReturnType<typeof getDefaultJob>) =>
  getVariantsForMaterial(job.paperCoverRawMaterialId);

const getPaperInsideVariants = (job: ReturnType<typeof getDefaultJob>) =>
  getVariantsForMaterial(job.paperInsideRawMaterialId);

// ── Raw material selection handlers ──────────────────────────────────────────
const updatePaperCover = (job: ReturnType<typeof getDefaultJob>, selectedId: string) => {
  const mat = rawMaterialsList.value.find(m => m.id === selectedId);
  job.paperCover = mat?.name ?? '';
  job.paperCoverRawMaterialId = selectedId;
  job.paperCoverVariant = ''; // reset variant when material changes
};

const updatePaperInside = (job: ReturnType<typeof getDefaultJob>, selectedId: string) => {
  const mat = rawMaterialsList.value.find(m => m.id === selectedId);
  job.paperInside = mat?.name ?? '';
  job.paperInsideRawMaterialId = selectedId;
  job.paperInsideVariant = ''; // reset variant when material changes
};

// ── Finishing governance: mutually exclusive groups ───────────────────────────
const clearOtherFinishingOptions = (job: ReturnType<typeof getDefaultJob>, selectedCategory: string) => {
  const hasValue = (v: any) => v && v !== '';
  if (!hasValue((job as any)[selectedCategory])) return;
  if (selectedCategory !== 'laminate' && job.laminate) { job.laminate = ''; job.laminateCustom = ''; }
  if (selectedCategory !== 'vanish' && job.vanish) { job.vanish = ''; job.vanishCustom = ''; }
  if (selectedCategory !== 'spot' && job.spot) { job.spot = ''; job.spotCustom = ''; }
  if (selectedCategory !== 'windowPatching' && job.windowPatching) { job.windowPatching = ''; job.windowPatchingCustom = ''; }
};

// ── Job management ────────────────────────────────────────────────────────────
const addJob = () => form.jobRequests.push(getDefaultJob());
const removeJob = (index: number) => {
  if (form.jobRequests.length > 1) form.jobRequests.splice(index, 1);
};


// ── Submit: one production request per job card ───────────────────────────────
const submitRequest = async () => {
  v$.value.$touch();
  isSubmitting.value = true;
  
  const hasCustomSizeError = form.jobRequests.some(j => j.size === 'custom' && !j.customSize);
  
  if (v$.value.$invalid || hasCustomSizeError) {
    focusFirstInvalidField();
    $toast.error('Please correct the highlighted errors.');
    isSubmitting.value = false;
    return;
  }

  try {
    for (const job of form.jobRequests) {
      const payload = {
        serviceCategoryId: form.serviceCategoryId,
        serviceCategoryName: form.serviceCategoryName,
        customerName: form.customer,
        contactName: form.contactName,
        phoneNo: form.phoneNo,
        email: form.emailAddress,
        location: form.location,
        noOfJobs: form.jobRequests.length,
        jobName: job.jobName,
        quantity: job.quantity || 0,
        pages: job.pages || 0,
        size: job.size === 'custom' ? job.customSize : job.size,
        paperCover: job.paperCover,
        paperCoverVariant: job.paperCoverVariant,
        paperCoverRawMaterialId: job.paperCoverRawMaterialId,
        paperInside: job.paperInside,
        paperInsideVariant: job.paperInsideVariant,
        paperInsideRawMaterialId: job.paperInsideRawMaterialId,
        noOfColoursText: job.noOfColoursText || 0,
        noOfColoursCover: job.noOfColoursCover || 0,
        finishingOptions: serializeFinishingOptions(job),
        adminRemarks: job.otherInstructions,
      };

      await createProductionRequest(payload);
    }

    $toast.success('Production Request(s) created successfully!');
    router.push('/production-requests');
  } catch (error) {
    console.error(error);
    $toast.error('An error occurred while submitting.');
  } finally {
    isSubmitting.value = false;
  }
};

// ── Data loading ──────────────────────────────────────────────────────────────
const loadData = async () => {
  try {
    const [matResult, catResult] = await Promise.all([
      getRawMaterials({ pageNo: 1, pageSize: 200 }),
      getEstimateTypes({ pageNo: 1, pageSize: 100 }),
    ]);
    rawMaterialsList.value = matResult.data;
    estimateTypeList.value = catResult.data;
  } catch (err) {
    $toast.error('Failed to load form data.');
  }
};

onMounted(loadData);

definePageMeta({
  layout: 'default',
  middleware: 'auth',
});
</script>