<template>
   <div v-if="isOpen" class="modal-overlay" @click="closeModal">
  <div class="modal-content max-w-md" @click.stop>

    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle class="w-5 h-5 text-red-600" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900">Confirm Deletion</h2>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Content -->
      <div class="p-6">
        <div class="mb-4">
          <p class="text-gray-700 mb-2">
            Are you sure you want to delete <strong>{{ itemName }}</strong>?
          </p>
           
        </div>

        <!-- Warning Message -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div class="flex items-start space-x-2">
            <AlertTriangle class="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-sm text-red-800 font-medium">Warning</p>
              <p class="text-sm text-red-700">
                This action is irreversible. Please make sure you want to proceed.
              </p>
            </div>
          </div>
        </div>

      </div>

    <!-- Actions -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
      <button 
        @click="closeModal" 
        class="btn-secondary"
        :disabled="isDeleting"
      >
        Cancel
      </button>
      <button 
        @click="confirmDelete" 
        class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        :disabled="isDeleting || (requireConfirmation && confirmationText !== 'DELETE')"
        :class="{ 'opacity-50 cursor-not-allowed': isDeleting || (requireConfirmation && confirmationText !== 'DELETE') }"
      >
        <div v-if="isDeleting" class="loader"></div>
        <Trash2 v-else class="w-4 h-4" />
        <span>{{ isDeleting ? 'Deleting...' : 'Delete' }}</span>
      </button>
    </div>

  </div> <!-- closes modal-content -->
</div> <!-- closes modal-overlay -->

</template>

<script setup>
import { ref, watch } from 'vue'
import { AlertTriangle, X, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isDeleting: {
    type: Boolean,
    default: false
  },
  itemName: {
    type: String,
    required: true
  },
  requireConfirmation: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

const isDeleting = ref(false)
const confirmationText = ref('')

// Reset confirmation text when modal opens/closes
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    isDeleting.value = false
  }
})

const closeModal = () => {
  if (!isDeleting.value) {
    emit('close')
  }
}

const confirmDelete = () => {
  isDeleting.value = true
  emit('confirm') // Actual deletion is handled in parent
}

// Close modal on Escape key
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.isOpen && !isDeleting.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>