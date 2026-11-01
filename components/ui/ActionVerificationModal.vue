<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content max-w-md" @click.stop>
      
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <slot name="icon">
                <ShieldCheck class="w-5 h-5 text-blue-600" />
              </slot>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">{{ actionTitle }}</h2>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4">
        <p class="text-gray-700">
          {{ message }}
        </p>

        <!-- Confirmation Input -->
        <div v-if="requireConfirmationText" class="space-y-1">
          <label class="text-sm text-gray-600">Type <strong>{{ confirmationWord }}</strong> to confirm</label>
          <input
            v-model="confirmationText"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            :disabled="isProcessing"
          />
        </div>

        <!-- Optional Info Warning -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3" v-if="infoNote">
          <div class="flex items-start space-x-2">
            <Info class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div class="text-sm text-blue-700">
              {{ infoNote }}
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button @click="closeModal" class="btn-secondary" :disabled="isProcessing">Cancel</button>
        <button
          @click="confirmAction"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          :disabled="isDisabled"
          :class="{ 'opacity-50 cursor-not-allowed': isDisabled }"
        >
          <div v-if="isProcessing" class="loader"></div>
          <ShieldCheck v-else class="w-4 h-4" />
          <span>{{ isProcessing ? 'Processing...' : confirmButtonText }}</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { X, ShieldCheck, Info } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  isProcessing: Boolean,
  actionTitle: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to perform this action?'
  },
  requireConfirmationText: {
    type: Boolean,
    default: false
  },
  confirmationWord: {
    type: String,
    default: 'CONFIRM'
  },
  confirmButtonText: {
    type: String,
    default: 'Confirm'
  },
  infoNote: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'confirm'])

const confirmationText = ref('')

const isDisabled = computed(() =>
  props.isProcessing || (props.requireConfirmationText && confirmationText.value !== props.confirmationWord)
)

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    confirmationText.value = ''
  }
})

const closeModal = () => {
  if (!props.isProcessing) {
    emit('close')
  }
}

const confirmAction = () => {
  emit('confirm')
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen && !props.isProcessing) {
    closeModal()
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
@reference "tailwindcss";
@config "~/tailwind.config.js";
.modal-overlay {
  @apply fixed inset-0 bg-black/50 z-50 flex items-center justify-center;
}
.modal-content {
  @apply bg-white rounded-xl shadow-xl overflow-hidden;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors;
}
.loader {
  @apply w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin;
}
</style>