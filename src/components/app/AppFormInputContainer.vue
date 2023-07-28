<script setup lang="ts">
import { 
  themedColorProps, 
  inputContainerProps,
type ThemeColors,
} from '@/composables';
import { AppFormLabel, AppFormError } from '.';
import { computed } from 'vue';

const props = defineProps({
  ...themedColorProps,
  ...inputContainerProps,
})

const colorInactive = computed(():ThemeColors => {
  if (props.error) return 'error-500';
  else if (props.disabled) return 'secondary-400';
  else return 'primary-500';
} )

</script>

<template>
  <div class="group dark:text-white flex flex-col gap-1.5">
    <!-- Label -->
    <AppFormLabel 
      :required="props.required"
      :disabled="props.disabled"
      :name="props.name" 
      :class="[
        `group-focus-within:text-${props.color}`,
        `${props.labelClass}`,
      ]"
    >
      {{  props.label  }}
    </AppFormLabel>
    
    <!-- Input Container -->
    <div
      :class="[`
          p-3
          flex
          bg-black
          rounded-md
          border border-${colorInactive} group-focus-within:border-${props.color}
          outline-1 outline-${props.color} group-focus-within:outline 
          transition-all
          relative
        `,
        props.containerClass,
      ]"
    >
      <div 
        class="
          absolute 
          bg-white/10 
          w-full 
          h-full 
          left-0 
          top-0
        "
      ></div>
      <div class="relative flex-grow">
        <slot></slot>
      </div>
    </div>
    
    <!-- Error -->
    <AppFormError :class="props.errorClass">
      {{ props.error }}
    </AppFormError>
  </div>
</template>