<script setup lang="ts">
// Components
import { AppChip } from '@/components/app'
import { UserIcon } from '@heroicons/vue/24/solid';
// Stores
import { useAuthStore } from '@/stores/authStore';

const props = defineProps({
  id: Number,
  first_name: String,
  last_name: String,
  online: Boolean,
  profile_img_url: String,
});

const { user } = useAuthStore()

</script>

<template>
  <div
    class="flex items-center gap-2"  
    aria-label="room member"
  >
    <img 
      v-if="props.profile_img_url"
      :src="props.profile_img_url" 
      class="aspect-square w-6 rounded-full"
      alt="Profile" 
    />

    <AppChip
      v-else
      class="w-6 aspect-square relative"
      :color="props.id === user?.id ? 'primary-500' : 'secondary-500'"
    >
      <UserIcon class="h-full"></UserIcon>
      <span
        class="
          absolute -bottom-0.5 -right-0.5 
          p-1 border border-black
          rounded-full
        " 
        :class="props.online 
          ? 'bg-success-500' 
          : 'bg-white/80'
        "
    ></span>
    </AppChip>
    <span class="hidden md:block">{{ props.first_name }} {{ props.last_name }}</span>

  </div>
</template>
