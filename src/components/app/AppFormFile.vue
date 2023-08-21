<script setup lang="ts">
import { toRef, type PropType, type InputHTMLAttributes, ref, computed, nextTick } from 'vue';
// Composables
import { 
  themedColorProps, 
  useThemedColor,
  useInputValue, 
  inputContainerProps,
  inputEmits,
  useFormValidation,
  validationProps,
} from '@/composables';
// App Components
import { AppButton, AppFormError, AppFormInputContainer, AppFormLabel } from '.';

const props = defineProps({
  modelValue: { type: Array as PropType<File[]> },
  /** Maximum file size in KB */
  maxSize: [String, Number] as PropType<string | number>,
  /** Convert the file input style to default form input  */
  defaultInput: Boolean as PropType<boolean>,
  /** Accepted file type of the input */
  accept: String as PropType<InputHTMLAttributes['accept']>,
  /** Flag whether to accept multiple files */
  multiple: Boolean as PropType<InputHTMLAttributes['multiple']>,
  /** Flag to make file readonly */
  readonly: Boolean as PropType<InputHTMLAttributes['readonly']>,
  ...themedColorProps,
  ...inputContainerProps,
  ...validationProps,
});

const emit = defineEmits([ 
  ...inputEmits
 ]);

/** Theme color composable */
const { color } = useThemedColor(props.color);

/** Form composable */
const { updateInputValue } = useInputValue(emit);

/** File size validation logic */

const FILESIZE_TYPE = 'KB';
// Convert 
const maxSizeToByte = computed(()=> 
  props.maxSize ? +props.maxSize*1000 : 0
);

function byteToKB(size: number) {
  return size/1000;
}

function isFileSizeInMax(file: File) {
  return props.maxSize && file.size <= maxSizeToByte.value
}

function fileSizeValidation() {
  if (!props.maxSize || !props.modelValue) return true;

  const { maxSize, modelValue, multiple } = props;
  for (const file of modelValue) {
    if (!isFileSizeInMax(file)) {
      return `${multiple ? 'A' : 'The'} file has exceeded ${maxSize} ${FILESIZE_TYPE}`;
    }
  }
  return true;
}



/** Validation composable */

// Adds the file size validation to the list of validations
const validationComputed = computed(()=> [
  ...(Array.isArray(props.validations)
    ? props.validations
    : [props.validations]
  ),
  fileSizeValidation,
]);

const { 
  errorMessage, 
  isRequired, 
  checkError 
} = useFormValidation(toRef(props, 'modelValue'), validationComputed, props.name)


/** Form File Logic */

// template ref for input file
const fileInputRef = ref<HTMLInputElement | null>(null);

// Creates a string url of the file's thumbnail 
// (only works with img or video)
function createThumbnail(file: File) {
  return URL.createObjectURL(file);
}

// toggle the file input ref
function openFileInput() {
  if (props.disabled) return;
  fileInputRef.value?.click();
}

// event handler when uploading file
function onFileSelectHandler(e: Event) {
  if (props.disabled) return;

  const target = e.target as HTMLInputElement;
  if (!target.files?.length) return;

  const value  = [ ...target.files || [] ]; 
  updateInputValue(value);
  nextTick(checkError);
}

// event handler for close icon
function onCloseIconClickHandler(index: number) {
  if (!props.modelValue || props.disabled) return;
  const files = [ ...props.modelValue ];
  files.splice(index, 1);
  updateInputValue(files);
  nextTick(checkError);
}


/** Dropbox Logic */

// class to add  when user drag over the dropbox 
const DRAGOVER_CLASS = 'bg-opacity-50';

// Action to execute on component drag over
function dragover(event: DragEvent) {
  event.preventDefault();
  // Add some visual fluff to show the user can drop its files
  const currentTarget = event.currentTarget as HTMLDivElement;
  if (!currentTarget.classList.contains(DRAGOVER_CLASS)) {
    currentTarget.classList.add(DRAGOVER_CLASS);
  }
}

// Action to execute on component drag leave
function dragleave(event: DragEvent) {
  // Clean up
  const currentTarget = event.currentTarget as HTMLDivElement;
  currentTarget.classList.remove(DRAGOVER_CLASS);
}

// Action to execute on component when file is dropped
function drop(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer?.files.length) {
    const files = props.multiple
      ? [
          ...event.dataTransfer.files, 
          ...props?.modelValue || []
        ]
      : [event.dataTransfer.files[0]];
    updateInputValue(files);
    dragleave(event);
    nextTick(checkError);
  }
}
</script>

<template>
  <div>
    <!-- Default Input -->
    <AppFormInputContainer
      v-if="props.defaultInput"
      :name="props.name"
      :required="isRequired"
      :label="props.label"
      :label-class="props.labelClass"
      :error="props.error || errorMessage"
      :error-class="props.errorClass"
      :disabled="disabled"
      v-bind="{ color }" 
    >
      <slot 
        name="prepend" 
        v-bind="{ color, props }"
      ></slot>
      <div
        class="
          flex-grow 
          w-full 
          bg-transparent
          cursor-pointer
          peer-disabled:text-secondary-400
        "
      >
        <slot 
          name="display" 
          v-bind="{ modelValue, openFileInput, props, color }" 
        >
          <div
            class="flex gap-1"
            @click="openFileInput"
          >
            <AppButton size="sm" :color="color">
              Browse
            </AppButton>
            <input
              :value="
                props.modelValue
                  ?.map(({name})=>name)
                  .join(',  ')
                "
              :aria-label="props.label"
              role="presentation"
              class="outline-none cursor-pointer w-full bg-transparent"
              readonly
            />
          </div>
        </slot>
      </div>
      <slot 
        name="append"
        v-bind="{ color, props }"
      ></slot>
    </AppFormInputContainer>
  
    <!-- Dropzone -->
    <div
      v-else
    >
      <div class="flex flex-wrap gap-3">
        <AppFormLabel 
          :label="props.label"
          :required="isRequired"
        ></AppFormLabel>
        <AppFormError 
          :error="errorMessage || props.error"
        ></AppFormError>
      </div>
      <div
        class="mt-1"
      >
        <!-- Dropbox -->
        <div
          class="cursor-pointer"
          @click="openFileInput"
          v-on="{ dragleave, dragover, drop }"
        >
          <slot name="dropzone" v-bind="{ modelValue, openFileInput, props, color}">
            <div
              aria-label="dropzone box" 
              :class="`
                p-2 py-5
                rounded
                brightness-90
                text-${color} 
                bg-${color} bg-opacity-10
                border border-dashed border-${color}
                flex flex-col justify-center items-center
                transition-colors
              `"
            >
              <h3 class="w-full font-semibold text-center">
                <slot 
                  name="dropzone-title"
                  v-bind="{ color, props }"
                >
                  <span class="text-secondary-800 dark:text-secondary-100">
                    Drop file/s here or
                  </span> 
                  <u>click here to browse</u>.
                </slot>
              </h3>
              <!-- Supported type, size -->
              <label
                class="
                  mt-1
                  flex flex-col md:flex-row gap-2
                  text-xs text-secondary-400 
                  [&>*:last-child.separator]:hidden
                  text-center
                "
                aria-label="file limit"
              >
                <slot 
                  name="dropzone-subtitle" 
                  v-bind="{ color, props }"
                >
                  <span>
                    Supported file type: {{ props.accept || '*' }}
                  </span>
                  
                  <span class="separator hidden md:inline">&#x2022;</span>
                  
                  <span v-if="props.maxSize">
                    Max file size: {{ props.maxSize }} {{ FILESIZE_TYPE }}
                  </span>
                </slot>
              </label>
            </div>
          </slot>
        </div>

        <!-- Files -->
        <slot 
          name="display"
          v-bind="{ modelValue, openFileInput, props }" 
        >
          <div class="mt-3 grid gap-2">
            <div
              v-for="file, i in props.modelValue"
              :key="`file-${i}`"
              :class="`
                p-1
                w-full
                overflow-hidden
                border border-${color} rounded
                flex items-center flex-col md:flex-row 
              `"
            >
              <!-- File Thumbnail -->
              <div :class="`mr-3 w-7 h-7 bg-${color} bg-opacity-20`">
                <img 
                  v-if="file.type.includes('image')"
                  :src="createThumbnail(file)" 
                  :alt="file.name"
                  class="aspect-square object-cover"
                />
                <video 
                  v-else-if="file.type.includes('video')"
                  :src="createThumbnail(file)" 
                  class="aspect-square object-cover"
                />
                <div v-else class="text-xl text-center">
                  &#x1F4C1;
                </div>
              </div>
              
              <div 
                class="
                  w-full 
                  text-center
                  flex 
                  flex-col md:flex-row 
                  flex-grow flex-shrink 
                  md:gap-2 
                "
              >
                <!-- File Name -->
                <span :class="`truncate text-${color} flex-shrink`">
                  {{ file.name }}
                </span>
                <!-- File size -->
                <span 
                  :class="[
                    `whitespace-nowrap `,
                    isFileSizeInMax(file)
                      ? 'text-secondary-400'
                      : 'text-error-500',
                  ]"
                > 
                  {{ byteToKB(file.size) }} {{ FILESIZE_TYPE }}
                </span>
                <!-- Close Icon -->
                <AppButton
                  :disabled="props.disabled"
                  :aria-label="`file ${i+1} close icon`"
                  :color="color"
                  size="sm"
                  variant="text"
                  class="ml-auto"
                  @click="onCloseIconClickHandler(i)"
                >
                  &#x2715;
                </AppButton>
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>

    <!-- Hidden: File Input -->
    <input
      :aria-label="name"
      :multiple="props.multiple"
      :accept="props.accept"
      ref="fileInputRef"
      type="file"
      class="sr-only peer"
      tabindex="-1"
      aria-hidden="true"
      v-bind="{ ...props }"
      @change="onFileSelectHandler"
    />
  </div>
</template>