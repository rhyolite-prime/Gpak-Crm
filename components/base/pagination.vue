<template>

<div class="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
    <div class="text-sm text-gray-500">
        Showing data {{lowerBound}} to {{upperBound}} of {{ totalCount }} entries
    </div>
    <div class="flex items-center space-x-2">

        <button 
        v-for="page in pageList" 
        :key="page"
        class="px-3 py-1 text-sm rounded"
        :class="pageNo === page ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
        @click="onPageChanged(page)">
        {{ page }}
        </button>
        
    </div>
  </div>

</template>

<script lang="ts" setup>

const props = defineProps({
  pageNo: {
      type: Number,
      required: true,
      default: 1
    },
    totalPages: {
      type: Number,
      required: true
    },
    totalCount: {
      type: Number,
      required: true
    },
  lowerBound: {
    type: Number,
    required: true
  },
  upperBound: {
    type: Number,
    required: true
  },
    disabled: {
      type: Boolean
    }
})

const emit = defineEmits(['onPageChanged'])

const { pageNo, totalPages, totalCount } = toRefs(props)

const selectedPage = ref(pageNo.value ?? 1)

const pageList = computed(() => {


      let counter = 1;
      let initPage = 1;
      const currentPage = pageNo.value;
      const pages = totalPages.value;

      if (currentPage > 9 && pages > 10) {
        initPage = currentPage - 5;
      }

      const pageNumbers = [];

      for (let i = initPage; i <= pages; i++) {
        pageNumbers.push(i);
        counter++;
        if (counter > 10) {
          break;
        }
      }

  return pageNumbers;
      
});

const onPageChanged = (currrentPage: number) => {

  selectedPage.value = currrentPage;
  emit("onPageChanged", selectedPage.value);
}



</script>


