<script setup lang="ts">
import { computed, ref } from 'vue';
// Components
import { AppButton, AppForm, AppFormError, AppFormInput,  AppFormCheckbox, AppModal, AppTooltip, AppLoading } from '@/components/app';
import { PlusIcon } from '@heroicons/vue/24/solid';
// Services
import ChatRooms from '@/services/ChatRooms';
import type { ChatRoom } from '@/services/ChatRooms';


const chatRoomSample = [
  {
    id: 1,
    name: 'General',
  },
  {
    id: 2,
    name: 'Others',
  },

  {
    id: 3,
    name: 'Others',
  },
  
  {
    id: 4,
    name: 'Others',
  },
];

const chatRoom = ref<ChatRoom[]>([]);
const chatRoomLabeled = computed(()=>[
  {
    name: 'Public',
    key: 'public',
    rooms: chatRoom.value.filter(room=>!room.is_private),
  },
  {
    name: 'Private',
    key: 'private',
    rooms: chatRoom.value.filter(room=>!!room.is_private),
  },
])

/** Room API Logic */
const fetchRoomLoading = ref(false);
async function fetchRooms() {
  fetchRoomLoading.value = true;
  try {
    const response = await ChatRooms.list2();
    chatRoom.value = response.data.success.data;
  } catch {
    alert('An error occured.');
  }
  fetchRoomLoading.value = false;
}


const createRoomForm = ref({
  name: '',
  is_private: false,
});
const createRoomError = ref('');
const createRoomLoading = ref(false);
const createRoomSuccess = ref(false);

async function createRoom(error: string[]) {
  if (error.length) return;
  createRoomLoading.value = true;
  try {
    const response = await ChatRooms.create(createRoomForm.value);
    if (response.status === 200) {
      createRoomSuccess.value = true;
      chatRoom.value.push(response.data.success.data)
    }
  } catch {
    createRoomError.value = 'Something went wrong';
  }
  createRoomLoading.value = false;
}


fetchRooms();


</script>

<template>
  <div class="p-2 md:p-5 w-full h-full relative">
    <!-- Add New Room Modal -->
    <AppModal>
      <template #default="{ toggleModal }">

        <div 
          v-if="createRoomSuccess"
          class="
            flex flex-col items-center justify-center gap-5
          "
        >
          <p>New Room Created!</p>
          <AppButton color="secondary-500" @click="toggleModal">
            Confirm
          </AppButton>
        </div>
        <AppForm
          v-else 
          class="p-5 flex flex-col gap-5"
          @validate="createRoom"
        >
          <p>Please provide a name for your new room</p>
          
          <!-- Room Name -->
          <AppFormInput
            v-model="createRoomForm.name"
            :disabled="createRoomLoading"
            validations="required | minLength(5)"
            label="Room Name"
          ></AppFormInput>
          
          <!-- Is Private -->
          <AppFormCheckbox 
            v-model="createRoomForm.is_private"
            toggle-input
            label="Private room"
            class="ml-auto flex-row-reverse"
          ></AppFormCheckbox>

          <div class="grid grid-cols-2 gap-5">
            <AppButton 
              :loading="createRoomLoading"
              color="secondary-500" 
              @click="toggleModal"
            >
              Cancel
            </AppButton>
            <AppButton 
              :loading="createRoomLoading"
              type="submit"
            >
              Create new room
            </AppButton>
          </div>
        </AppForm>

        <AppFormError>{{  createRoomError  }}</AppFormError>
      </template>

      <template #trigger="{ toggleModal }">
        <div class="fixed right-5 bottom-5">
          <AppTooltip tooltip-text="Create new room" direction="left">
            <AppButton 
              class="rounded-full aspect-square" 
              @click="toggleModal"
            >
              <PlusIcon class="h-6 w-6"></PlusIcon>
            </AppButton>
          </AppTooltip>
        </div>
      </template>
    </AppModal>

    <!-- Chat Rooms -->
    <AppLoading 
      v-if="fetchRoomLoading"
      class="
        absolute top-0 left-0 
        w-full h-full 
        backdrop-blur-sm
      "
    ></AppLoading>
    <div
      v-for="rooms in chatRoomLabeled"
      :key="rooms.key"
    >
      <h3
        v-if="rooms.rooms.length > 0"
        class="text-lg font-bold"
      >
        {{  rooms.name  }}
      </h3>
      <div
        class="
          p-2 md:p-5 
          grid md:grid-cols-4 gap-2 md:gap-5
        "
      >
          <RouterLink
            v-for="room in rooms.rooms"
            :key="room.id"
            class="
              group
              cursor-pointer
              p-5
              rounded-md
              flex flex-col gap-2
              text-white hover:text-black 
              bg-white/10 hover:bg-accent-500
              transition-all
            "
            :to="{ name: 'ChatRoom', params: { id: room.id }}"
          >
            <div class="flex gap-2 items-center">
              <h5 class="font-bold">
                {{ room.name }}
              </h5>
              <span 
                class="
                  px-2
                  select-none
                  rounded-full
                  bg-primary-500
                  text-sm text-white
                  opacity-0
                  -translate-y-1/2 group-hover:translate-y-0
                  transition-all
                "
              >
                Enter Room
              </span>
            </div>
            <div class="mt-1 flex">
              <p class="font-light text-sm">
                  Participants: {{ room.is_private ? room.members_count : 'All' }}
              </p>
            </div>
          </RouterLink>
        
      </div>
    </div>
  </div>
</template>