
<script setup lang="ts">
import { usePageLoadStore } from '@/stores/pageLoadStore';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const { pageLoading } = storeToRefs(usePageLoadStore())
const loadingPercent = ref(0);
const hideLoading = ref(false);
let interValId: ReturnType<typeof setInterval>;

function runLoading() {
  loadingPercent.value += 5;
  if (loadingPercent.value > 60) {
    clearInterval(interValId);
  }
}

watch(pageLoading, (isLoading)=>{
  if (isLoading) {
    hideLoading.value = false;
    loadingPercent.value = 15;
    interValId = setInterval(runLoading, 100)
  } else {
    clearInterval(interValId);
    loadingPercent.value = 100;
    setTimeout(()=>hideLoading.value = true, 700);
  }
})

</script>

<template>
  <div
    v-show="!hideLoading"
    class="w-full h-1 z-50 fixed top-0 bg-transparent"
  >
    <div 
      :class="`
        h-full 
        bg-primary-400 dark:bg-primary-600
      `"
      :style="{ 
        width: `${loadingPercent}%`,
        transition: 'width 0.3s ease-in-out', 
      }"
    ></div>
  </div>
</template>
