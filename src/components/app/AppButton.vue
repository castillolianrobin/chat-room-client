<script setup lang="ts">
import { themedColorProps, useThemedColor } from '@/composables';
import { computed, type ButtonHTMLAttributes, type PropType, toRef, unref } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import { AppLoading } from './';

export type SizeProp = 'lg' | 'md' | 'sm';
export type VariantProp = 'solid' | 'outline' | 'text';

const props = defineProps({
  type: { type: String as PropType<ButtonHTMLAttributes['type']>, default: 'button', required: false, },
  disabled: { type: Boolean as PropType<ButtonHTMLAttributes['disabled']>, default: false, required: false },
  loading: { type: Boolean as PropType<boolean>, default: false, required: false },
  size: { type: String as PropType<SizeProp>, default: 'md', required: false,  },
  variant: { type: String as PropType<VariantProp>, default: 'solid', required: false },
  ...themedColorProps,
  to: [String, Object] as PropType<RouteLocationRaw>,
});

/** Theme color composable */
const { color } = useThemedColor(toRef(props, 'color'));


/** CSS Classes */

const sizeClass = computed(()=>{
  switch (props.size) {
    case 'lg': return 'text-lg py-3 px-4';  
    case 'sm': return 'text-sm px-1 py-0.5';  
    case 'md': default: return 'text-base py-2 px-3';
  }
});
const bgClass = computed(()=>{
  switch (props.variant) {
    case 'text': return `bg-transparent`;   
    case 'outline': return `bg-transparent hover:bg-${unref(color)} active:bg-transparent disabled:bg-transparent`;   
    case 'solid': default: return `bg-${unref(color)}`;
  }
});
const borderClass = computed(()=>{
  switch (props.variant) {
    case 'text': return `border-transparent`;   
    case 'outline': return `border-${unref(color)}`;   
    case 'solid': default: return `border-${unref(color)}`;
  }
});
const textClass = computed(()=>{
  switch (props.variant) {
    case 'text': return `text-${unref(color)} disabled:text-opacity-50 hover:brightness-150`;    
    case 'outline': return `text-${unref(color)} hover:text-white active:text-${unref(color)} disabled:text-${unref(color)}`;   
    case 'solid': default: return `text-white`;
  }
});

</script>

<template>
  <component :is="props.to && !props.disabled ? 'RouterLink' : 'button'"
    :class="[ 
      ...[ sizeClass, bgClass, textClass, borderClass ],
      `focus:outline-${color}/25 outline-2`,
      {
        'rounded-md': !(typeof $attrs?.class === 'string' && $attrs?.class?.includes('rounded')),
        ['cursor-default']: props.disabled || props.loading,
        ['hover:shadow']: 
          props.variant !== 'text' && !props.disabled && !props.loading,
        ['hover:brightness-110 active:brightness-75']: 
          props.variant !== 'outline' && !props.disabled && !props.loading,
      }
    ]"
    class="
      relative
      flex items-center justify-center
      border-2
      transition
      disabled:opacity-75
    "
    :aria-busy="props.loading"
    v-bind="{ ...props }"
  >
    <AppLoading 
      v-if="props.loading"
      class="absolute"
      v-bind="{ color }"
    ></AppLoading>
    <span
      class="flex gap-2 items-center"
      :class="{ 'opacity-0': props.loading }"
    >
      <slot></slot>
    </span>
  </component>
</template>