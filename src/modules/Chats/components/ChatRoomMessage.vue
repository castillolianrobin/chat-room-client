<script setup lang="ts">
import { computed, type PropType } from 'vue';
// Services
import type { User } from '@/services';
// Stores
import { useAuthStore } from '@/stores/authStore';

const props = defineProps({
  sender_id: Number,
  message: String,
  user: Object as PropType<User>,
  created_at: String,
});

const { user: userInfo } = useAuthStore();

const createdAt = computed(()=>props.created_at
  ? new Date(props.created_at).toLocaleString() 
  : ''
);

</script>

<template>
  <span
    class="
      p-3 
      group
      rounded
      text-white
      w-fit max-w-[50%]
      flex flex-col
    "
    :class="{
      'ml-auto items-end': props.sender_id === userInfo?.id,
      'bg-primary-500':  props.sender_id === userInfo?.id,
      'bg-secondary-500':  props.sender_id !== userInfo?.id,
    }"
  >
    <p class="text-sm font-light opacity-70">
      {{  props.user?.first_name || 'Nameless'  }}
    </p>
    {{  props.message  }}
    <p 
      class="
        text-xs text-white/70 font-light
        transition-all
      "
    >
      ( {{ createdAt }} )
    </p>
  </span>
</template>