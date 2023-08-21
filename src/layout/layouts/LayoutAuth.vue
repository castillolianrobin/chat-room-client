<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();
const layoutShift = computed(()=>!!route.meta.layoutShift);
const isLeaving = ref(false);
onBeforeUnmount(()=>{
  isLeaving.value = true;
});
</script>

<template>
  <div 
    class=" 
      h-full w-full
      flex flex-col md:flex-row
      text-white selection:bg-accent-500
      bg-black 
    "
  >
    <!-- BG Ellipsis 1  -->
    <div 
      class="
        fixed -top-[70%] md:-top-[50%] 
        w-[180%] md:w-[60%] 
        aspect-square
        rounded-full 
        transition-all ease-in-out delay-100 duration-500
      "
      :class="{
        'scale-0': isLeaving,
        '-left-[100%] md:-left-[30%] bg-secondary-400': !layoutShift,
        'left-[40%] md:left-[70%] bg-white/10': layoutShift
      }"
    ></div>

    
    <!-- BG Ellipsis 2  -->
    <div 
      class="
        fixed -bottom-[50%] md:-bottom-[40%] 
        w-[130%] md:w-[40%]
        aspect-square
        rounded-full 
        transition-all ease-in-out duration-700
      "
      :class="{
        'scale-0': isLeaving,
        '-right-[60%] md:-right-[12%] bg-accent-500': !layoutShift,
        'right-[60%] md:right-[60%] bg-white/10': layoutShift
      }"
    ></div>

    <slot>
      <RouterView></RouterView>
    </slot>
  </div>
</template>