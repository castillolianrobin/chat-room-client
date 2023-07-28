<script setup lang="ts">
import { toRef, nextTick, type PropType, type InputHTMLAttributes, ref, computed, type Ref } from 'vue';
// Composables
import { 
  themedColorProps, 
  useThemedColor,
  useInputValue, 
  inputProps, 
  inputContainerProps,
  inputEmits,
  useFormValidation,
  validationProps,
} from '@/composables';
// App Components
import { AppChip, AppFormInputContainer } from '.';
import { EyeSlashIcon, EyeIcon } from '@heroicons/vue/24/solid';

export interface MultiTextItem {
  id?: string | number;
  text: string;
}

const props = defineProps({
  ...themedColorProps,
  ...inputProps,
  ...inputContainerProps,
  ...validationProps,
  modelValue: {
    type: [Number, String, Array] as PropType<number | string | MultiTextItem[]>
  },
  /** Default input property "type" */
  type: { 
    type: String as PropType<'text'|'number'|'password'|'multiple-text'|'decimal'>, 
    default: 'text' 
  },
  readonly: Boolean as PropType<InputHTMLAttributes['readonly']>,
});

const emit = defineEmits([ 
  ...inputEmits
 ]);

/** Theme color composable */
const { color } = useThemedColor(props.color);

/** Form composable */
const { updateInputValue } = useInputValue(emit);

/** Validation composable */
const { 
  errorMessage, 
  isRequired, 
  validateOnChange, 
} = useFormValidation(toRef(props, 'modelValue'), toRef(props, 'validations'), props.name)


/** Internal Logic */

// Type handler
const inputType = computed(()=>showPass.value ? 'text' : props.type)


/** Type: MultiText */

const Items = toRef(props, 'modelValue') as Ref<MultiTextItem[]>

// Key down event handler for multi text input
function onMultiKeyDownHandler(e: KeyboardEvent) {
  if (!Array.isArray(props.modelValue)) return;
  if (!['Enter', 'Backspace'].includes(e.key))
    return;
  
  const valueTarget = e.target as HTMLInputElement;
  // Delete
  if (e.key === 'Backspace' && !valueTarget.value) {
    const lastVal = [...props.modelValue]?.pop();
    lastVal && removeItem(lastVal);
  }
  // Add
  if (e.key === 'Enter' && valueTarget.value) {
    addItem(valueTarget.value);
    valueTarget.value = '';
  }
}

// Add new multi text item
function addItem(text: string) {
  const valueIsArray = Array.isArray(props.modelValue)
  const id = `${valueIsArray ? props.modelValue?.length : '1'}` +  Math.random() 
  const item = { text, id };
  
  if (!valueIsArray) {
    updateInputValue([item]) 
  } else {
    updateInputValue([...props.modelValue, item]);
  } 
}
// Remove multi text item by id
function removeItem(item: MultiTextItem) {
  if (!Array.isArray(props.modelValue)) return;
  
  const { modelValue } = props;
  const deleteI = modelValue
    .findIndex(({id})=>id === item.id);
  modelValue.splice(deleteI, 1);
  
  updateInputValue(modelValue);
}


/** Type: Decimal */

// input event handler for decimal input
async function onDecimalInputChange(e: Event) {
  const targetVal = (e.target as HTMLInputElement).value;
  const value = stringToDecimal(targetVal, props.modelValue as string);
  
  if (props.modelValue === value) {
    updateInputValue(value === '0' ? '00' : '0');
    await nextTick(()=>{
      updateInputValue(value);
    });
  } else {
      updateInputValue(value);
  }
}

// Helper: Converts given string to decimal
function stringToDecimal(val: string, defaultVal: string) {
  const str = val.replace(/[^\d.-]/g, '');
  const numVal = +str;
  
  if (isNaN(numVal)) return defaultVal;

  // the actual decimal value
  let deciVal = numVal.toLocaleString("en");

  // get decimal position
  const decimalPos = str.indexOf(".");
  if (decimalPos >= 0) {
    const decimalLength = str.substring(decimalPos).length - 1;
    if (decimalLength > 0) {
      deciVal = numVal.toLocaleString("en", {
        minimumFractionDigits: decimalLength < 6 ? decimalLength || 1 : 6,
        maximumFractionDigits: 6,
      });
    } else {
      deciVal = `${deciVal}.`;
    }
  }
  return deciVal;
}

/** Type: Password */

const showPass = ref(false);
</script>

<template>  
  <AppFormInputContainer
    :name="props.name"
    :required="isRequired"
    :label="props.label"
    :label-class="props.labelClass"
    :error="props.error || errorMessage"
    :error-class="props.errorClass"
    :disabled="disabled"
    :container-class="props.containerClass"
    v-bind="{ color }" 
  >
    <!-- Prepend -->
    <slot name="prepend"></slot>
    

    <!-- MultiText Input -->
    <div 
      v-if="props.type === 'multiple-text'"
      class="w-full flex-shrink flex items-center flex-wrap"
    >
      <AppChip  
        v-for="item in Items" 
        :key="item?.id" 
        class="mr-1 truncate"
        @close="removeItem(item)"
      >
        {{ item.text }}
      </AppChip>
      <input
        type="text"
        class="
          ml-1 -m-1 p-1 
          flex-grow 
          flex-shrink
          rounded 
          outline-none 
          bg-transparent
          transition-colors autofill:duration-[50000s]
          disabled:text-white/50
        "
        @keydown="onMultiKeyDownHandler"
        v-bind="$attrs" 
      />
    </div>
    <!-- Decimal Input -->
    <div 
      v-else-if="props.type === 'decimal'"
      class="w-full flex-shrink flex items-center"
    >
      <input
        v-bind="{ ...props, ...$attrs }"
        class="
          -m-1 p-1 
          flex-grow 
          w-full
          rounded 
          outline-none 
          bg-transparent
          transition-colors autofill:duration-[50000s]
          disabled:text-white/50
        "
        :aria-label="props.name || props.label"
        :value="props.modelValue"
        @input="onDecimalInputChange"
        @focus="validateOnChange = true"
      />
    </div>   
    <!-- Default Input -->
    <div 
      v-else 
      class="w-full flex-shrink flex items-center"
    >
      <input
        v-bind="{ ...props, ...$attrs }"
        class="
          -m-1 p-1 
          flex-grow 
          w-full
          rounded 
          outline-none 
          bg-transparent 
          transition-colors autofill:duration-[50000s]
          disabled:text-white/50
        "
        :aria-label="props.name || props.label"
        :value="props.modelValue"
        :type="inputType"
        @input="updateInputValue"
        @focus="validateOnChange = true"
      />

      <span 
        v-if="props.type === 'password'"
        class="cursor-pointer"
        @click="showPass = !showPass"
      >
        <component 
          :is=" showPass ? EyeSlashIcon : EyeIcon" 
          class="h-6"
        ></component>
      </span>
    </div>
    
    <!-- Append -->
    <slot name="append"></slot>
  </AppFormInputContainer>
</template>

<style>
/* input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active  {
  transition: background-color 5000s;
  -webkit-text-fill-color: #fff !important;
} */

</style>