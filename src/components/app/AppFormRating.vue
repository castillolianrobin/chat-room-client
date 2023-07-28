<script setup lang="ts">
import { ref, type PropType, toRef, computed, useAttrs } from 'vue';
// Components
import { StarIcon as UnrateIcon } from '@heroicons/vue/24/outline';
import { StarIcon as RateIcon } from '@heroicons/vue/24/solid'
// Composables
import { inputContainerProps, inputEmits, inputProps, themedColorProps, useFormValidation, useInputValue, useThemedColor, validationProps, type ThemeColors } from '@/composables';
import { AppFormError, AppFormLabel } from '.';

const props = defineProps({
  ...themedColorProps,
  ...inputProps,
  ...inputContainerProps,
  ...validationProps,
  modelValue: {
    type: Number as PropType<number>,
    default: 0,
  },
  /** Max rating value */
  maxValue: {
    type: Number as PropType<number>,
    default: 5,
  },
  iconClass: String,
})

const emits = defineEmits([ ...inputEmits])

/** Themed Color composable */
const { color } = useThemedColor(props.color)

/**  Validation composable  */
const { 
  errorMessage, 
  isRequired, 
  validateOnChange, 
} = useFormValidation(toRef(props, 'modelValue'), toRef(props, 'validations'), props.name)
/** Input value composable */
const { updateInputValue } = useInputValue(emits)

/** Attribute composable */
const attrs = useAttrs()

/** Internal Logic */

function onChangeHandler(rate: number) {
  if (props.disabled || 'readonly' in  attrs) return;
  updateInputValue(rate)
}

/** Hover Logic */

const hoverValue = ref(0);

function onHover(hoverRate = 0) {
  if (props.disabled || 'readonly' in  attrs) return;
  hoverValue.value = hoverRate;
}


const colorInactive = computed(():ThemeColors => {
  if (props.error) return 'error-500';
  else if (props.disabled) return 'secondary-400';
  else return 'secondary-500';
} )



</script>

<template>
  <div>
    <AppFormLabel 
      :disabled="props.disabled"
      :required="isRequired" 
      :class="props.labelClass"
    >
      {{ props.label }}
    </AppFormLabel>
    <!-- Rating Input -->
    <div 
      :class="`flex text-${props.disabled ? colorInactive : color} ${props.containerClass}`"
      @mouseleave="onHover(9)"
    >
      <div 
        v-for="rate in props.maxValue" 
        :key="rate"
        :class="[
          `flex-shrink flex aspect-square`,
          iconClass,
          { 'cursor-pointer': !props.disabled && !$attrs.readonly}
        ]"
        aria-label="rating-input"
        @mouseover="onHover(rate)"
        @click="onChangeHandler(rate)"
      >
        <div v-if="hoverValue ? rate <= hoverValue : rate <= props.modelValue">
          <slot name="rate-icon"><RateIcon class="w-full"></RateIcon></slot>
        </div>
        <div v-else>
          <slot name="unrate-icon"><UnrateIcon class="w-full"></UnrateIcon></slot>
        </div> 
      </div>
    </div>
    <AppFormError :class="props.errorClass">
      {{ errorMessage || props.error  }}
    </AppFormError>
  </div>
</template>
