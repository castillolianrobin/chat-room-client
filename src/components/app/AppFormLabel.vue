<script setup lang="ts">
import { inputContainerProps } from '@/composables';
import { computed } from 'vue';
import type { PropType } from 'vue';


const props = defineProps({
  name: inputContainerProps.name,
  label: inputContainerProps.label,
  required: inputContainerProps.required,
  disabled: inputContainerProps.disabled,
  size: { 
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg'>, 
    default: 'xs', 
    required: false 
  },
});

const textSizeClass = computed(()=>{
  switch (props.size) {
    case 'xs': return 'text-xs';
    case 'sm': return 'text-sm';
    case 'lg': return 'text-lg';
    case 'md': default: return 'text-md';
  }
})

</script>

<template>
  <label 
    :for="props.name" 
    :class="[
      textSizeClass,
      `select-none font-semibold`,
      'transition-colors',
      'text-primary-500',
      { 'text-secondary-400/50': props.disabled, }
    ]" 
    v-bind="{ ...$attrs }"
  >
    <slot>{{  props.label  }}</slot>
    <span v-if="required" class="text-error-500">
      *
    </span>
  </label>
</template>