<script setup lang="ts">
import settingsRoutes from '../settings.routes';
const settingsRoute = settingsRoutes;
</script>

<template>
  <div class="p-5 w-1/3 flex flex-col gap-5">
    <RouterLink
      v-for="route in settingsRoute"
      :key="route.path"
      :to="{ name: route.name }"
    >
      {{  route.meta?.title || 'Other Settings'  }}
    </RouterLink>
  </div>
</template>