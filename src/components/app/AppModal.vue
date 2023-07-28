<script setup lang="ts">
import { ref, type PropType, watch, toRef } from 'vue';
import { AppButton } from '.';


const props = defineProps({
  /** Modal */
  active: { 
    type: Boolean as PropType<boolean>, 
      default: false, 
      required: false 
  },
  /** Add a close icon to the modal */
  closeIcon: {
    type: Boolean as PropType<boolean>, 
    default: false, 
    required: false 
  },
  persist: {
    type: Boolean as PropType<boolean>, 
    default: false, 
    required: false,
  },
});
const emits = defineEmits(['update:active']);

/** Modal Logic */

const isActive = ref(props.active);
const isClicked = ref(false);

watch(toRef(props, 'active'), value=> {
  isActive.value = value;
});
// modal state watcher if active or not 
function toggleModal(state: boolean | null = null) {
  const newValue = typeof state === 'boolean' 
    ? state 
    : !(props.active || isActive.value); 
  emits('update:active', newValue);
  isActive.value = newValue;
}
</script>

<template>
  <div>
    <Transition
      enter-active-class="duration-150 ease-out [&_.modal-dialog]:duration-200"
      enter-from-class="opacity-0 [&_.modal-dialog]:-translate-y-5"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in [&_.modal-dialog]:duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 [&_.modal-dialog]:-translate-y-5"
    >
      <div 
        v-if="isActive"
        tabindex="0"
        :class="[
          `z-30
          fixed top-0 left-0
          flex items-center justify-center 
          w-screen h-screen 
          bg-black/50 backdrop-blur`,
        ]"
        @click.self="!persist && toggleModal(false)"
        @mousedown.self="isClicked = true"
        @mouseup.self="isClicked = false"
      >
        <div
          role="dialog" 
          :class="[
            'modal-dialog',
            { 'animate-modal':props.persist && isClicked },
          ]"
        >
          <slot 
            name="modal" 
            v-bind="{ toggleModal, isActive }"
          >
            <!-- Default Modal Template -->
            <div 
              class="
                relative 
                py-4 p-2
                rounded shadow
                border border-white/20
                bg-black dark:bg-secondary-900
                max-w-[95vw]
              "
            >
              <!-- Close button -->
              <div class="absolute top-1 right-1 z-10">
                <AppButton
                  v-if="props.closeIcon" 
                  color="secondary-500"
                  variant="outline"
                  size="sm"
                  class="
                    text-xs font-bold
                    rounded-full 
                    aspect-square
                    w-[1.5rem]
                  "
                  @click="!persist && toggleModal(false)"
                  @mousedown="isClicked = true"
                  @mouseup="isClicked = false"
                >
                  &#x2715;
                </AppButton>
              </div>
              <slot v-bind="{ toggleModal, isActive }">
              </slot>
            </div>
          </slot>
        </div>
      </div>
    </Transition>
    <!-- Trigger Slot -->
    <slot 
      name="trigger" 
      v-bind="{ toggleModal, isActive }"
    ></slot>
  </div>
</template>
