<template>
  <div class="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200 min-h-screen">

    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8 pb-4 border-b">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Edit Production Request</h2>
        <p v-if="requestNumber" class="mt-1 text-sm text-gray-600">Request #{{ requestNumber }}</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/production-requests" class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-2">Back to List</NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white rounded-lg border border-gray-200 flex items-center justify-center p-16">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      <span class="ml-4 text-gray-500">Loading production request details…</span>
    </div>

    <!-- Form -->
    <div v-else>
      <form @submit.prevent="saveRequest" ref="formRef">

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
              <label for="requestCategory" class="text-sm font-semibold text-gray-700">Request Category <span class="text-red-500">*</span></label>
              <select id="requestCategory" v-model="form.requestCategory" :class="['w-full border rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white', v$.requestCategory.$error ? 'border-red-500 bg-red-50' : 'border-gray-300']" @change="onServiceCategoryChange">
                <option value="">Select a category</option>
                <option value="labels">Labels</option>
              <option value="bookwork">Bookwork</option>
              <option value="packaging">Packaging</option>
              </select>
              <span v-if="v$.requestCategory.$error" class="text-xs text-red-500">Service Category is required</span>
            </div>

          </div>
        </section>

        <hr class="border-t border-gray-200 mb-8" />

        <!-- ───────────────────── JOB DETAILS ───────────────────── -->
        <section class="mb-8">
          <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 border-b-2 border-red-600 pb-2 mb-6 inline-block bg-white">Request Details</h3>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">

            <!-- Row: Job Name & Pages -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-gray-700">Job Name(s)</label>
                <input v-model="form.jobName" type="text" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" placeholder="e.g. Copy books" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-gray-700">Pages</label>
                <input v-model="form.pages" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
              </div>
            </div>

            <!-- Row: Quantity & No. of Jobs -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-gray-700">Quantity</label>
                <input v-model="form.quantity" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-gray-700">No. of Jobs</label>
                <input v-model="form.noOfJobs" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white" min="1" />
              </div>
            </div>

            <!-- Row: Paper Cover & Paper Cover Variant -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-gray-700">Paper Cover</label>
                <select
                  v-model="form.paperCoverRawMaterialId"
                  class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white"
                  @change="updatePaperCover(($event.target as HTMLSelectElement).value)"
                >
                  <option value="">Select Paper Cover</option>
                  <option v-for="m in rawMaterialsList" :key="m.id" :value="m.id">{{ m.name }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-gray-700">Paper Cover Variant</label>
                <select
                  v-model="form.paperCoverVariant"
                  class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                  
                >
                  <option value="">Select Variant</option>
                  <option v-for="variant in paperCoverVariants" :key="variant.name" :value="variant.name">
                    {{ variant.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row: Paper Inside & Paper Inside Variant -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-gray-700">Paper Inside</label>
                <select
                  v-model="form.paperInsideRawMaterialId"
                  class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white"
                  @change="updatePaperInside(($event.target as HTMLSelectElement).value)"
                >
                  <option value="">Select Paper Inside</option>
                  <option v-for="m in rawMaterialsList" :key="m.id" :value="m.id">{{ m.name }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-gray-700">Paper Inside Variant</label>
                <select
                  v-model="form.paperInsideVariant"
                  class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                 
                >
                  <option value="">Select Variant</option>
                  <option v-for="variant in paperInsideVariants" :key="variant.name" :value="variant.name">
                    {{ variant.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row: Colours Text & Colours Cover -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-gray-700">No. of Colours Text</label>
                <select v-model="form.noOfColoursText" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-gray-700">No. of Colours Cover</label>
                <select v-model="form.noOfColoursCover" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>

            <!-- Row: Size -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-gray-700">Size</label>
                <select v-model="form.size" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="">Select a size</option>
                  <option>A2 - 420 x 594mm</option>
                  <option>A3 - 297 x 420mm</option>
                  <option>A4 - 210 x 297mm</option>
                  <option>A5 - 148 x 210mm</option>
                  <option>Quarto - 180 x 240mm</option>
                  <option value="custom">Custom size</option>
                </select>
              </div>
              <div class="flex flex-col gap-1" v-if="form.size === 'custom'">
                <label for="customSize" class="text-sm font-semibold text-gray-700">Custom Size <span class="text-red-500">*</span></label>
                <input id="customSize" v-model="form.customSize" type="text" :class="['w-full border rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white', (!form.customSize && isSubmitting) ? 'border-red-500 bg-red-50' : 'border-gray-300']" placeholder="e.g. 100 x 200mm" />
                <span v-if="!form.customSize && isSubmitting" class="text-xs text-red-500">Custom size is required</span>
              </div>
            </div>

            <FinishingOptions :model="form" :name-prefix="'edit'" :binding-options="bindingOptions" :add-options="addOptions" :laminate-options="laminateOptions" :vanish-options="vanishOptions" :spot-options="spotOptions" @surface-change="clearOtherFinishingOptions($event)" />

            <!-- Other Instructions -->
            <div class="flex flex-col gap-1 mt-6">
              <label class="text-sm font-semibold text-gray-700">Other Instructions</label>
              <textarea v-model="form.adminRemarks" rows="3" class="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 bg-white"></textarea>
            </div>

          </div>
          <!-- END job-card -->
        </section>

        <!-- Actions -->
        <div class="flex justify-end gap-4 pt-8 pb-4 border-t border-gray-200 mt-8 print:hidden">
          <NuxtLink to="/production-requests" class="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-2">Cancel</NuxtLink>
          <button type="submit" :disabled="isSubmitting" class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
            <span
              v-if="isSubmitting"
              class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>

      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
import FinishingOptions from '~/components/ui/FinishingOptions.vue';
 
import { useRoute, useRouter, useNuxtApp } from '#app';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import type { RawMaterial, EstimateType, RawMaterialVariant } from '~/models';
 

const { $toast } = useNuxtApp();
const router = useRouter();
const route = useRoute();

// ── State ─────────────────────────────────────────────────────────────────────
const formRef = ref<HTMLFormElement | null>(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const requestNumber = ref('');
const rawMaterialsList = ref<RawMaterial[]>([]);
const estimateTypeList = ref<EstimateType[]>([]);

// ── Static finishing options ──────────────────────────────────────────────────
const bindingOptions = [
  { id: 'saddle-stitch', name: 'Saddle stitch' },
  { id: 'perfect-bind', name: 'Perfect bind' },
  { id: 'case-bind', name: 'Case bind' },
  { id: 'wire-o', name: 'Wire O' },
  { id: 'spiral-bind', name: 'Spiral bind' },
  { id: 'side-stab', name: 'Side Stab' },
  { id: 'padding', name: 'Padding' },
];

const addOptions = [
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

const laminateOptions = [
  { id: 'gloss', name: 'Gloss' },
  { id: 'matt', name: 'Matt' },
  { id: 'soft-touch', name: 'Soft Touch' },
  { id: 'saudy', name: 'Saudy' },
];

const vanishOptions = [
  { id: 'uv-vanish', name: 'UV Vanish' },
  { id: 'waterbase-vanish', name: 'Waterbase Vanish' },
  { id: 'oil-vanish', name: 'Oil Vanish' },
];

const spotOptions = [
  { id: '3d-matt', name: '3D Matt' },
  { id: '3d-gloss', name: '3D Gloss' },
  { id: '3d-pattern', name: '3D Pattern' },
];

// ── Form state ────────────────────────────────────────────────────────────────
const form = reactive({
  id: '',
  requestCategory: '',
  customer: '',
  contactName: '',
  phoneNo: '',
  emailAddress: '',
  location: '',
  jobName: '',
  noOfJobs: null as number | null,
  quantity: null as number | null,
  pages: null as number | null,
  size: '',
  customSize: '',
  // Paper Cover
  paperCover: '',
  paperCoverRawMaterialId: '',
  paperCoverVariant: '',
  // Paper Inside
  paperInside: '',
  paperInsideRawMaterialId: '',
  paperInsideVariant: '',
  // Colours
  noOfColoursText: null as number | null,
  noOfColoursCover: null as number | null,
  // Finishing
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
  // Other
  adminRemarks: '',
});

// ── Validation Rules ──────────────────────────────────────────────────────────
const rules = {
  customer: { required },
  contactName: { required },
  phoneNo: { required },
  emailAddress: { required, email },
  requestCategor: { required }
};

const v$ = useVuelidate(rules, form);

// ── Validation Helpers ────────────────────────────────────────────────────────
const focusFirstInvalidField = () => {
  if (v$.value.$invalid) {
    const errorFields = ['customer', 'contactName', 'phoneNo', 'emailAddress', 'requestCategory'];
    for (const field of errorFields) {
      if (v$.value[field]?.$invalid) {
        const input = document.getElementById(field);
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
    }
  }

  if (form.size === 'custom' && !form.customSize) {
    const input = document.getElementById('customSize');
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


// ── Variant computed lists ────────────────────────────────────────────────────
const paperCoverVariants = computed<RawMaterialVariant[]>(() => {
  const mat = rawMaterialsList.value.find(m => m.id === form.paperCoverRawMaterialId);
  return mat?.variants ?? [];
});

const paperInsideVariants = computed<RawMaterialVariant[]>(() => {
  const mat = rawMaterialsList.value.find(m => m.id === form.paperInsideRawMaterialId);
  return mat?.variants ?? [];
});


// ── Raw material selection handlers ──────────────────────────────────────────
const updatePaperCover = (selectedId: string) => {
  const mat = rawMaterialsList.value.variants.find(m => m.id === selectedId);
  form.paperCover = mat?.name ?? '';
  form.paperCoverRawMaterialId = selectedId;
  form.paperCoverVariant = ''; // reset variant when material changes
};

const updatePaperInside = (selectedId: string) => {
  const mat = rawMaterialsList.value.variants.find(m => m.id === selectedId);
  form.paperInside = mat?.name ?? '';
  form.paperInsideRawMaterialId = selectedId;
  form.paperInsideVariant = ''; // reset variant when material changes
};

// ── Finishing governance ──────────────────────────────────────────────────────
const clearOtherFinishingOptions = (selectedCategory: string) => {
  const hasValue = (v: any) => v && v !== '';
  if (!hasValue((form as any)[selectedCategory])) return;
  if (selectedCategory !== 'laminate' && form.laminate) { form.laminate = ''; form.laminateCustom = ''; }
  if (selectedCategory !== 'vanish' && form.vanish) { form.vanish = ''; form.vanishCustom = ''; }
  if (selectedCategory !== 'spot' && form.spot) { form.spot = ''; form.spotCustom = ''; }
  if (selectedCategory !== 'windowPatching' && form.windowPatching) { form.windowPatching = ''; form.windowPatchingCustom = ''; }
};

// ── Resolve custom value before submit ────────────────────────────────────────
const resolveCustom = (value: string, custom: string) =>
  value === 'custom' ? custom : value;

const resolveAddons = (addons: string[], custom: string) =>
  addons.map(a => (a === 'custom' ? custom : a)).filter(Boolean);

// ── Load existing request ─────────────────────────────────────────────────────
const loadRequestDetails = async () => {
  const id = route.params.id as string;
  if (!id) {
    $toast.error('No production request ID provided.');
    router.push('/production-requests');
    return;
  }

  isLoading.value = true;
  try {
    const details = await getProductionRequestDetails({ id }) as any;
    if (!details) {
      $toast.error('Production request not found.');
      router.push('/production-requests');
      return;
    }

    form.id = details.id;
    requestNumber.value = details.requestNumber || '';
    form.requestCategory = details.requestCategory || '';
    form.customer = details.customerName || '';
    form.contactName = details.contactName || '';
    form.phoneNo = details.customerPhoneNumber || details.phoneNo || '';
    form.emailAddress = details.email || details.customerEmail || '';
    form.location = details.location || '';
    form.jobName = details.jobName || '';
    form.noOfJobs = details.noOfJobs ?? null;
    form.quantity = details.quantity ?? null;
    form.pages = details.pages ?? null;
    form.size = details.size || '';
    form.customSize = '';
    // Paper Cover
    form.paperCover = details.paperCover || '';
    form.paperCoverRawMaterialId = details.paperCoverRawMaterialId || '';
    form.paperCoverVariant = details.paperCoverVariant || '';
    // Paper Inside
    form.paperInside = details.paperInside || '';
    form.paperInsideRawMaterialId = details.paperInsideRawMaterialId || '';
    form.paperInsideVariant = details.paperInsideVariant || '';
    // Colours
    form.noOfColoursText = details.noOfColoursText ?? null;
    form.noOfColoursCover = details.noOfColoursCover ?? null;
    // Finishing
    // The API stores custom selections as their text, rather than as "custom".
    // Restore the matching option so existing values remain visible and editable.
    const restoreChoice = (value: string, custom: string, options: { id: string }[]) => {
      if (!value) return { value: '', custom: custom || '' };
      if (value === 'custom') return { value, custom: custom || '' };
      return options.some(option => option.id === value)
        ? { value, custom: '' }
        : { value: 'custom', custom: value };
    };
    const binding = restoreChoice(details.binding, details.bindingCustom, bindingOptions);
    form.binding = binding.value;
    form.bindingCustom = binding.custom;
    form.addons = Array.isArray(details.addons) ? [...details.addons] : [];
    form.addonsCustom = details.addonsCustom || '';
    const customAddon = form.addons.find(addon => addon !== 'custom' && !addOptions.some(option => option.id === addon));
    if (customAddon) {
      form.addons = form.addons.map(addon => addon === customAddon ? 'custom' : addon);
      form.addonsCustom = customAddon;
    }
    const laminate = restoreChoice(details.laminate, details.laminateCustom, laminateOptions);
    form.laminate = laminate.value; form.laminateCustom = laminate.custom;
    const vanish = restoreChoice(details.vanish, details.vanishCustom, vanishOptions);
    form.vanish = vanish.value; form.vanishCustom = vanish.custom;
    const spot = restoreChoice(details.spot, details.spotCustom, spotOptions);
    form.spot = spot.value; form.spotCustom = spot.custom;
    const windowPatching = restoreChoice(details.windowPatching, details.windowPatchingCustom, [{ id: 'window-patching' }]);
    form.windowPatching = windowPatching.value; form.windowPatchingCustom = windowPatching.custom;
    form.adminRemarks = details.adminRemarks || '';
  } catch (error) {
    console.error('Error loading production request:', error);
    $toast.error('Failed to load production request details.');
    router.push('/production-requests');
  } finally {
    isLoading.value = false;
  }
};

// ── Save request ──────────────────────────────────────────────────────────────
const saveRequest = async () => {
  v$.value.$touch();
  isSubmitting.value = true;
  
  const hasCustomSizeError = form.size === 'custom' && !form.customSize;

  if (v$.value.$invalid || hasCustomSizeError) {
    focusFirstInvalidField();
    $toast.error('Please correct the highlighted errors.');
    isSubmitting.value = false;
    return;
  }

  const payload = {
    id: form.id,
    requestCategory: form.requestCategory,
    customerName: form.customer,
    contactName: form.contactName,
    phoneNo: form.phoneNo,
    email: form.emailAddress,
    location: form.location,
    jobName: form.jobName,
    noOfJobs: form.noOfJobs || 0,
    quantity: form.quantity || 0,
    pages: form.pages || 0,
    size: form.size === 'custom' ? form.customSize : form.size,
    paperCover: form.paperCover,
    paperCoverVariant: form.paperCoverVariant,
    paperCoverRawMaterialId: form.paperCoverRawMaterialId,
    paperInside: form.paperInside,
    paperInsideVariant: form.paperInsideVariant,
    paperInsideRawMaterialId: form.paperInsideRawMaterialId,
    noOfColoursText: form.noOfColoursText || 0,
    noOfColoursCover: form.noOfColoursCover || 0,
    binding: resolveCustom(form.binding, form.bindingCustom),
    addons: resolveAddons(form.addons, form.addonsCustom),
    laminate: resolveCustom(form.laminate, form.laminateCustom),
    vanish: resolveCustom(form.vanish, form.vanishCustom),
    spot: resolveCustom(form.spot, form.spotCustom),
    windowPatching: resolveCustom(form.windowPatching, form.windowPatchingCustom),
    adminRemarks: form.adminRemarks || '',
  };

  try {
    const success = await updateProductionRequest(payload);
    if (success) {
      $toast.success('Production Request updated successfully!');
      router.push('/production-requests');
    } else {
      $toast.error('Failed to update request.');
    }
  } catch (error) {
    console.error(error);
    $toast.error('An error occurred while updating the request.');
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

onMounted(async () => {
  await loadData();
  await loadRequestDetails();
});

definePageMeta({
  layout: 'default',
  middleware: 'auth',
});
</script>
