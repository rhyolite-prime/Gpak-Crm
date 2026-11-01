<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-2xl p-6 bg-white shadow-md rounded-md">
      <!-- Header Section -->
      <div class="flex flex-col items-center mb-6">
        <img alt="GPAK Logo" src="assets/img/gpak.jpeg" class="h-[30px] mb-2" />
        <h1 class="text-2xl font-extrabold text-primary tracking-wide uppercase">
          Production Request Form
        </h1>
      </div>
      <hr/>
      <!-- Progress Bar -->
      <div class="flex justify-between mb-8 mt-8">
        <div class="flex-1 flex items-center">
          <div class="flex flex-col items-center text-center w-full">
            <div :class="['mb-2 w-10 h-10 rounded-full flex items-center justify-center', step >= 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600']">
              <User class="w-5 h-5" />
            </div>
            <div :class="step === 1 ? 'font-semibold text-primary' : 'text-gray-500'">Customer Info</div>
          </div>
          <div v-if="step > 1" class="flex-1 h-1 bg-primary mx-2 rounded"></div>
          <div v-else class="flex-1 h-1 bg-gray-300 mx-2 rounded"></div>
        </div>

        <div class="flex-1 flex items-center">
          <div class="flex flex-col items-center text-center w-full">
            <div :class="['mb-2 w-10 h-10 rounded-full flex items-center justify-center', step === 2 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600']">
              <Package class="w-5 h-5" />
            </div>
            <div :class="step === 2 ? 'font-semibold text-primary' : 'text-gray-500'">Product Info</div>
          </div>
          <div v-if="step > 2" class="flex-1 h-1 bg-primary mx-2 rounded"></div>
          <div v-else class="flex-1 h-1 bg-gray-300 mx-2 rounded"></div>
        </div>

        <div class="flex-1 flex items-center">
          <div class="flex flex-col items-center text-center w-full">
            <div :class="['mb-2 w-10 h-10 rounded-full flex items-center justify-center', step === 3 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600']">
              <CheckCircle class="w-5 h-5" />
            </div>
            <div :class="step === 3 ? 'font-semibold text-primary' : 'text-gray-500'">Success</div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="onSubmit">
        <div class="max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div v-if="step === 1">
            <h3 class="text-lg font-semibold mb-4 text-center">Customer Information</h3>
            <div class="space-y-4">

              <label class="inline-flex items-center mt-2 mb-2 cursor-pointer select-none">
                <span
                  class="relative inline-block w-11 h-6 transition duration-200 ease-in"
                >
                  <input
                    type="checkbox"
                    v-model="form.IsBusiness"
                    class="sr-only peer"
                  />
                  <span
                    :class="[
                      form.IsBusiness ? 'bg-primary' : 'bg-gray-300',
                      'absolute inset-0 rounded-full transition-colors duration-200'
                    ]"
                  ></span>
                  <span
                    :class="[
                      form.IsBusiness ? 'translate-x-5' : 'translate-x-0',
                      'absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200'
                    ]"
                  ></span>
                </span>
                <span class="ml-3 text-gray-700 font-medium">I am a business.</span>
              </label>

              <label for="FullName" class="block text-sm font-medium text-gray-700"><strong>Full Name</strong></label>
              <input id="FullName" v-model="form.FullName" placeholder="Full Name" class="input" />
              <p v-if="v$.FullName.$error" class="text-red-500 text-xs">Full Name is required</p>
              
              <label for="BusinessName" class="block text-sm font-medium text-gray-700"><strong>Business Name</strong></label>
              <input id="BusinessName" v-model="form.BusinessName" placeholder="Business Name" class="input" />
              <p v-if="v$.BusinessName.$error" class="text-red-500 text-xs">Business Name is required</p>

              <label for="Email" class="block text-sm font-medium text-gray-700"><strong>Email</strong></label>
              <input id="Email" v-model="form.Email" type="email" placeholder="Email" class="input" />
              <p v-if="v$.Email.$error" class="text-red-500 text-xs">Valid email is required</p>

              <label for="PhoneNumber" class="block text-sm font-medium text-gray-700"><strong>Phone Number</strong></label>
              <input id="PhoneNumber" v-model="form.PhoneNumber" placeholder="Phone Number" class="input" />
              <p v-if="v$.PhoneNumber.$error" class="text-red-500 text-xs">Phone Number is required</p>
              
            </div>
          </div>

          <div v-if="step === 2">
            <h3 class="text-lg font-semibold mb-4 text-center">Product Information</h3>
            <div class="space-y-4">
              <label for="ProductCategoryName" class="block text-sm font-medium text-gray-700"><strong>Print Type</strong></label>
              <select id="ProductCategoryName" v-model="form.ProductCategoryId" class="input">
                <option disabled value="">Select Print Type</option>
                <option 
                  v-for="type in printTypes" 
                  :key="type.id" 
                  :value="type.id">
                  {{ type.name }}
                </option>
              </select>
              <p v-if="v$.ProductCategoryId.$error" class="text-red-500 text-xs">Print Type is required</p>

              <label for="ProductName" class="block text-sm font-medium text-gray-700"><strong>Product</strong></label>
              <select id="ProductName" v-model="form.ProductId" class="input">
                <option disabled value="">Select a Product</option>
                <option 
                  v-for="product in productList" 
                  :key="product.id"
                  :value="product.id">
                  {{ product.name }}
                </option>
              </select>
              <p v-if="v$.ProductId.$error" class="text-red-500 text-xs">Product is required</p>

              <!-- ✅ Product Info Card -->
              <div 
                v-if="selectedProduct" 
                class="border border-gray-200 rounded-md bg-gray-50 p-4 mt-3 shadow-sm"
              >
                <p class="text-sm text-gray-800">
                  <strong>Unit Price:</strong> GHS {{ selectedProduct.sellingPrice.toFixed(2) }} <strong>per</strong> {{ selectedProduct.unitOfMeasure }}
                </p>
                <p class="text-sm text-gray-800 mt-1">
                  <strong>Minimum Order Quantity:</strong> {{ selectedProduct.minimumOrderQuantity }}
                </p>
              </div>

              <!-- ✅ Quantity Field -->
              <div v-if="selectedProduct" class="mt-4">
                <label for="Quantity" class="block text-sm font-medium text-gray-700 mb-3">
                  <strong>Quantity</strong>
                </label>
                <input 
                  id="Quantity" 
                  v-model.number="form.Quantity" 
                  type="number" 
                  min="selectedProduct.minimumOrderQuantity"
                  :placeholder="`Minimum ${selectedProduct.minimumOrderQuantity}`" 
                  class="input"
                />
                <p v-if="quantityError" class="text-red-500 text-xs mt-1">{{ quantityError }}</p>
              </div>

              <label for="Description" class="block text-sm font-medium text-gray-700"><strong>Describe What You Need (Optional)</strong></label>
              <textarea id="Description" v-model="form.Description" placeholder="Print 1,000 full-color 2025 calendars with company logo" class="input"></textarea>

              <label for="UploadedFiles" class="block text-sm font-medium text-gray-700"><strong>Upload Designs or Artefacts (Optional)</strong></label>
              <p class="text-xs text-gray-500 mb-1"><strong>Please upload designs or any relevant documents that will be used in production.</strong></p>
              <input id="UploadedFiles" type="file" multiple @change="handleFileUpload" class="input" />
              
            </div>
          </div>

          <div v-if="step === 3" class="text-center">
            <div class="border border-gray-200 rounded-md bg-gray-50 p-6 mb-6 text-left max-w-lg mx-auto shadow-sm">
              <h4 class="text-lg font-semibold mb-4 text-primary">Request Summary</h4>
              <ul class="space-y-2 text-sm text-gray-700">
                <li><strong>Full Name:</strong> {{ form.FullName }}</li>
                <li><strong>Business Name:</strong> {{ form.BusinessName }}</li>
                <li><strong>Email:</strong> {{ form.Email }}</li>
                <li><strong>Phone Number:</strong> {{ form.PhoneNumber }}</li>
                <li><strong>Print Type:</strong> 
                  {{ printTypes.find(type => type.id === form.ProductCategoryId)?.name || 'N/A' }}
                </li>
                <li><strong>Product:</strong> 
                  {{ productList.find(p => p.id === form.ProductId)?.name || 'N/A' }}
                </li>
                <li><strong>Quantity:</strong> {{ form.Quantity }}</li>
                
                <li v-if="selectedProduct">
                  <strong>Unit Price:</strong> GHS {{ selectedProduct.sellingPrice.toFixed(2) }} per {{ selectedProduct.unitOfMeasure }}
                </li>

                <li v-if="selectedProduct">
                  <strong>Estimated Amount:</strong>
                  GHS {{ (selectedProduct.sellingPrice * form.Quantity).toFixed(2) }}
                </li>
                
                <li v-if="form.Description"><strong>Description:</strong> {{ form.Description }}</li>
                <li v-if="form.UploadedFiles.length"><strong>Files:</strong> {{ form.UploadedFiles.map(f => f.name).join(', ') }}</li>
              </ul>
            </div>
            <div class="text-4xl mb-4">🎉</div>
            <h3 class="text-2xl font-semibold mb-4">Production Request Submitted Successfully!</h3>
            <button type="button" @click="resetForm" class="btn-primary px-6 py-3">Submit Another Request</button>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div v-if="step < 3" class="flex justify-between mt-8">
          <button v-if="step > 1" type="button" @click="prevStep" class="btn-secondary flex items-center gap-2">
            <ArrowLeft class="w-4 h-4" /> Previous
          </button>
          <div class="flex-1"></div>
          <button v-if="step < 2" type="button" @click="nextStep" class="btn-primary flex items-center gap-2">
            Next <ArrowRight class="w-4 h-4" />
          </button>
          <button v-if="step === 2" type="submit" class="btn-primary flex items-center gap-2">
            Submit <CheckCircle class="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">

import { 
  CheckCircle, 
  User,
  Package,
  ArrowLeft,
  ArrowRight
} from 'lucide-vue-next'

import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

definePageMeta({
  layout: 'website',
  middleware: []
})

const step = ref(1)

const form = reactive({
  FullName: '',
  BusinessName: '',
  Email: '',
  PhoneNumber: '',
  Description: '',
  ProductCategoryId: '',
  ProductCategoryName: '',
  ProductId: '',
  ProductName: '',
  UploadedFiles: [] as string[],
  IsBusiness: false,
  Quantity: null,
  UnitOfMeasure: ''
})

const rules = {
  FullName: { required },
  BusinessName: { required },
  Email: { required, email },
  PhoneNumber: { required },
  ProductCategoryId: { required },
  ProductId: { required },
  Quantity: { required },
  Description: {},
  UploadedFiles: {}
}

const v$ = useVuelidate(rules, form)

// ✅ Store fetched print types
const printTypes = ref<any[]>([])

// ✅ Function to fetch print types
async function getPrintTypes() {
  try {
    const res = await fetch(
      'https://devops.graphic.com.gh/api/services/app/ProductCategory/GetPrintTypes',
      {
        method: 'GET',
        headers: {
          'AccountSecret': 'LgDPlDbE',
          'Content-Type': 'application/json'
        }
      }
    )

    if (!res.ok) throw new Error('Failed to fetch print types')
    const data = await res.json()
    console.log(data);
    // adjust based on actual structure
    printTypes.value = data.result;
  } catch (error) {
    console.error('Error fetching print types:', error)
  }
}

const productList = ref<any[]>([])

const selectedProduct = computed(() => {
  return productList.value.find(p => p.id === form.ProductId) || null
})

// Watch for changes in selected Product and set Quantity automatically
watch(() => form.ProductId, (newProductId) => {
  const product = productList.value.find(p => p.id === newProductId)
  if (product) {
    form.Quantity = product.minimumOrderQuantity
  }
})

// ✅ Quantity validation watcher
const quantityError = ref('')

watch(() => form.Quantity, (newQty) => {
  if (selectedProduct.value && newQty < selectedProduct.value.minimumOrderQuantity) {
    quantityError.value = `Minimum quantity is ${selectedProduct.value.minimumOrderQuantity}`
  } else {
    quantityError.value = ''
  }
})

// ✅ Function to fetch products by category ID
async function getProductsByCategoryId(categoryId: string) {
  if (!categoryId) return

  try {
    const res = await fetch(
      `https://devops.graphic.com.gh/api/services/app/Product/GetAllByCategoryId?categoryId=${categoryId}`,
      {
        method: 'GET',
        headers: {
          'AccountSecret': 'LgDPlDbE',
          'Content-Type': 'application/json'
        }
      }
    )

    if (!res.ok) throw new Error('Failed to fetch products')
    const data = await res.json()
    console.log('Products:', data)
    // adjust based on actual structure
    productList.value = data.result
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

// ✅ Watch for changes in selected Print Type
watch(() => form.ProductCategoryId, (newId) => {
  if (newId) {
    getProductsByCategoryId(newId)
  } else {
    productList.value = []
  }
})

onMounted(async () => {
  await getPrintTypes();
})

watch([() => form.IsBusiness, () => form.FullName], () => {
  if (!form.IsBusiness) {
    form.BusinessName = form.FullName
  }
})

async function nextStep() {
  // Touch only first-step fields
  v$.value.FullName.$touch()
  v$.value.BusinessName.$touch()
  v$.value.Email.$touch()
  v$.value.PhoneNumber.$touch()

  const firstStepFields = [
    v$.value.FullName,
    v$.value.BusinessName,
    v$.value.Email,
    v$.value.PhoneNumber,
  ]

  const anyInvalid = firstStepFields.some(field => field.$invalid)

  if (anyInvalid) {
    //alert('Please fill all required customer information before proceeding.')
    return
  }

  if (step.value < 2) step.value++
}

function prevStep() {
  if (step.value > 1) step.value--
}

function handleFileUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    // Store the actual File objects instead of file names
    form.UploadedFiles = Array.from(files)
  }
}

async function onSubmit() {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    //alert('Please fill all required fields correctly before submitting.')
    return;
  }

  // Set ProductCategoryName and ProductName before submission
  const selectedCategory = printTypes.value.find(type => type.id === form.ProductCategoryId)
  const selectedProductItem = productList.value.find(p => p.id === form.ProductId)
  form.ProductCategoryName = selectedCategory ? selectedCategory.name : ''
  form.ProductName = selectedProductItem ? selectedProductItem.name : ''
  // Set UnitOfMeasure from selected product
  form.UnitOfMeasure = selectedProductItem ? selectedProductItem.unitOfMeasure : ''
  // Calculate and store EstimatedAmount
  form.EstimatedInvoiceAmount = selectedProductItem ? (selectedProductItem.sellingPrice * form.Quantity).toFixed(2) : '0';

  // Create FormData object
  const formData = new FormData()

  // Append non-file fields (including EstimatedAmount)
  for (const key in form) {
    if (key !== 'UploadedFiles') {
      formData.append(key, (form as any)[key])
    }
  }

  // Append files...
  form.UploadedFiles.forEach((file, index) => {
    formData.append(`UploadedFiles[${index}]`, file)
  })

  try {
    const res = await fetch('https://devops.graphic.com.gh/api/services/app/ProductionRequest/SubmitRequest', {
      method: 'POST',
      body: formData,
      headers: {
        'AccountSecret': 'LgDPlDbE',
      }
    })

    if (!res.ok) throw new Error('Failed to submit form')

    step.value = 3
  } catch (error) {
    console.error(error)
  }
}

function resetForm() {
  form.FullName = ''
  form.BusinessName = ''
  form.Email = ''
  form.PhoneNumber = ''
  form.Description = ''
  form.ProductCategoryId = ''
  form.ProductCategoryName = ''
  form.ProductId = ''
  form.ProductName = ''
  form.UploadedFiles = []
  form.IsBusiness = false
  step.value = 1
  v$.value.$reset()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

* {
  font-family: 'Sora', sans-serif;
}

.input {
  @apply w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary;
}
.btn-primary {
  @apply bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300;
}
</style>