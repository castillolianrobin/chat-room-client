<script setup lang="ts">
import LayoutDashboardTopBar from './LayoutDashboard/LayoutDashboardTopBar.vue';
  
</script>

<template>
  <div 
    id="layout-dashboard"
    class="w-full h-full"
  >
    <div 
      class="
        relative
        w-full h-full
        grid grid-rows-dashboard grid-cols-dashboard
        text-secondary-200
        bg-black 
      "
    >
      <!-- Top Navigation -->
      <LayoutDashboardTopBar
        class=""
      ></LayoutDashboardTopBar>
      
      <main
        class="
          p-2 md:p-5  
          overflow-auto 
          scrollbar
        "
      >
        <slot></slot>
      </main>
    </div>
  </div>
</template>
