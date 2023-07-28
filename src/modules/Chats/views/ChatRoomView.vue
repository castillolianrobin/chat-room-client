<script setup lang="ts">
import { onMounted, onUnmounted,  ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import type { AxiosError } from 'axios';
// Components
import { AppLoading, AppButton, AppTooltip, AppForm, AppFormCheckbox, AppFormInput, AppModal } from '@/components/app';
import { ArrowLeftIcon, ArrowRightOnRectangleIcon, CheckIcon, PaperAirplaneIcon, PencilSquareIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import ChatRoomMember from '../components/ChatRoomMember.vue';
import ChatRoomMessageVue from '../components/ChatRoomMessage.vue';
import { TransitionFade } from '@/components/transitions';
// Services
import { ChatRoomMessages, ChatRooms, ChatRoomsChannel, ChatRoomMembers } from '@/services'
import type { User, ChatRoom, ChatRoomMessage, CreateRoomMember } from '@/services';
import type { ErrorResponse } from '@/services/types';
// Store
import { useAuthStore } from '@/stores/authStore';


/** Prerequisites */
const { user } = useAuthStore()
const route = useRoute();
const router = useRouter();
const roomId = (route.params.id || 0) as number; 
const chatRoomMessage = new ChatRoomMessages(roomId);
const chatRoomMembers = new ChatRoomMembers(roomId);
const chatRoomsChannel = new ChatRoomsChannel(roomId);


/** ROOM DATA LOGIC */

const roomData = ref<ChatRoom | null>(null);
const roomMembers = ref<User[]>([]);
const roomMessage = ref<ChatRoomMessage[]>([]);
const roomDataLoading = ref(false);
async function fetchRooms() {
  roomDataLoading.value = true;
  try {
    const response = await ChatRooms.show(roomId);
    roomData.value = response.data.success.data;
    const chatResponse = await chatRoomMessage.list2();
    roomMessage.value = chatResponse.data.success.data || [];
  } catch {
    alert('An error occured');
  }
  roomDataLoading.value = false;
}

onMounted(()=>{
  /** Channel subscribed successfully */
  chatRoomsChannel.onSubscribe((members=> {    
    roomMembers.value = Object.values(members.members);
  }));
  /** Channel subscribed successfully */
  chatRoomsChannel.onMemberAdded((member=> {
    roomMembers.value.push(member.info);
  }));
  /** Channel subscribed successfully */
  chatRoomsChannel.onMemberRemoved((member=> {
    const i = roomMembers.value.findIndex(user=>+member.id===user.id);
    roomMembers.value.splice(i, 1);
  }));

  /** New Message Subscribtion  */
  chatRoomsChannel.onMessageCreated((newMessage)=> {
    const message = newMessage.message;
    console.log(roomMembers.value)
    message.user = roomMembers.value
      .find(user=>user.id == message.sender_id)
    
    roomMessage.value.unshift(message);
  });

  
  fetchRooms();
});

onUnmounted(() => {
  chatRoomsChannel.unsubscribe();
});


/** Edit Room */

// Edit room data
const isEditRoom = ref(false);
const editRoomLoading = ref(false);
const editRoomForm = ref({
  name: roomData.value?.name || ''
})
// Edit room function
async function editRoom() {
  editRoomLoading.value = true;
  try {
    const response = await ChatRooms.update(roomId, editRoomForm.value);
    const newRoomData = response.data.success.data;
    roomData.value = { ...roomData.value, ...newRoomData };
    alert('Room updated');

  } catch {
      alert('An Error Occured');
  }
  editRoomLoading.value = false;
  isEditRoom.value = false;
}


/** Delete Room */

// Delete room data
const deleteRoomConfirm = ref('');
const deleteRoomLoading = ref(false);

// Delete room
async function deleteRoom() {
  deleteRoomLoading.value = true;
  try {
    const response = await ChatRooms.delete(roomId);

    if (response.status === 200) {
      alert(response.data.success.message);
      router.push({ name: 'ChatRoomList' });
    } 
  } catch (e) {
    console.log(e)
    alert('Unabled to delete. Please try again later.');
  }
  deleteRoomLoading.value = false;
}


/** ROOM MEMBER LOGIC */

/** Add Member */

// Add Member Data
const isAddMember = ref(false);
const addMemberLoading = ref(false);
const addMemberSuccess = ref(false);
const addMemberForm = ref<CreateRoomMember>({
  email: '', 
  is_admin: false,
});

// Add member function
async function addMember(error: string[]) {
  if (error.length) return;
  addMemberLoading.value = true;
  addMemberSuccess.value = false;
  
  try {
    const response = await chatRoomMembers.create(addMemberForm.value)
    if (response.status === 200) {
      addMemberSuccess.value = true;
      // roomData.value?.members?.push(response.status)
    }
  } catch (e) {
    const err = (e as AxiosError<ErrorResponse>).response?.data.error.message;
    alert(`Error: ${err}`);
  }

  addMemberLoading.value = false;

}




/** SEND MESSAGE LOGIC */

const sendMessageForm = ref({
  message: '',
});
const sendMessageLoading = ref(false);
const sendMessageError = ref('');

async function sendMessage(error: string[]) {
  if (error.length) return;

  sendMessageLoading.value = true;
  try {
    const response = await chatRoomMessage.create(sendMessageForm.value);
    if (response.data.success.data) {
      sendMessageForm.value.message = '';
    }
  } catch {
    sendMessageError.value = 'An error occured try again later';
  }
  sendMessageLoading.value = false;
}

</script>

<template>
  <div class="h-full flex flex-col gap-5 relative">
    <AppLoading
      v-if="roomDataLoading"
      class="
        fixed top-0 left-0
        w-full h-full
        backdrop-blur
        z-50
      "
    ></AppLoading>
    <div class="flex flex-col md:flex-row gap-5 h-full w-full">
      <!-- Room Information -->
      <div
        class="
          w-full 
          flex-shrink flex-grow 
          flex flex-col gap-6
        "
      >
        <!-- Chat Room Name Container -->
        <div class="w-full flex items-center gap-1">
          <!-- Go to Chat Room Lists Btn -->
          <AppButton
            :to="{ name: 'ChatRoomList' }"
            color="white" 
            variant="text"
            size="sm"
            class="pl-0 pr-0"
          >
            <ArrowLeftIcon class="h-6 w-6"></ArrowLeftIcon>
          </AppButton>

          <!-- Room Name & Actions -->
          <div
            v-if="!isEditRoom"
            class="
              group
              cursor-pointer
              flex-grow flex-shrink
              flex items-end gap-5
            "
          >
            <!-- Room Name  -->
            <h4
              class="text-white text-2xl font-semibold"
            >
              {{  roomData?.name || '...' }}
            </h4> 
            
            <!-- Actions -->
            <div class="ml-auto flex items-center">
              <!-- Edit Room Btn -->
              <AppTooltip tooltip-text="Edit">
                <AppButton 
                  size="sm"
                  color="white" 
                  variant="text"
                  @click="isEditRoom = true"
                >
                  <PencilSquareIcon class="h-6 w-6"
                  ></PencilSquareIcon>
                </AppButton>
              </AppTooltip>

              <!-- Delete Room Modal -->
              <AppModal>
                <!-- Trigger -->
                <template #trigger="{ toggleModal }">
                  <AppTooltip tooltip-text="Delete">
                    <AppButton 
                      size="sm"
                      color="error-500"
                      variant="text"
                      @click="toggleModal"
                    >
                      <TrashIcon class="h-6 w-6"></TrashIcon>
                    </AppButton>
                  </AppTooltip>
                </template>
                <!-- Content -->
                <template #default="{ toggleModal }">
                  <div class="p-5">
                    <p>Are you sure you want to delete this?</p>
                    <p>Enter the chat room name to confirm.</p>
                    <AppFormInput 
                      v-model="deleteRoomConfirm"  
                      color="error-500"
                    ></AppFormInput>
                    <div class="mt-5 grid grid-cols-2 gap-5">
                      <AppButton
                        color="secondary-500"
                        :loading="deleteRoomLoading"
                        @click="toggleModal(false)"
                      >
                        Cancel
                      </AppButton>
                      <AppButton 
                        color="error-500"
                        :disabled="deleteRoomConfirm !== roomData?.name"
                        :loading="deleteRoomLoading"
                        @click="deleteRoom"
                      >
                        Delete
                      </AppButton>
                    </div>
                  </div>
                </template>
              </AppModal>

              <!-- Leave Room Modal -->
              <AppModal>
                <!-- Trigger -->
                <template #trigger="{ toggleModal }">
                  <AppTooltip tooltip-text="Leave Room">
                    <AppButton 
                      size="sm"
                      color="error-500"
                      variant="text"
                      @click="toggleModal"
                    >
                      <ArrowRightOnRectangleIcon class="h-6 w-6"></ArrowRightOnRectangleIcon>
                    </AppButton>
                  </AppTooltip>
                </template>
                <!-- Content -->
                <template #default="{ toggleModal }">
                  <div class="p-5">
                    <p>You are about to leave this room.</p>
                    <p>Are you sure you want to proceed?</p>
                    
                    <div class="mt-5 grid grid-cols-2 gap-5">
                      <AppButton
                        color="secondary-500"
                        :loading="deleteRoomLoading"
                        @click="toggleModal(false)"
                      >
                        Cancel
                      </AppButton>
                      <AppButton 
                        color="error-500"
                        :disabled="deleteRoomConfirm !== roomData?.name"
                        :loading="deleteRoomLoading"
                        @click="deleteRoom"
                      >
                        Leave
                      </AppButton>
                    </div>
                  </div>
                </template>
              </AppModal>
            </div>
          </div>

          <!-- Edit Room Form -->
          <AppForm 
            v-else 
            class="w-full flex items-end gap-3"
            @validate="editRoom"
          >
            <!-- Room Name Field -->
            <AppFormInput 
              v-model="editRoomForm.name"
              class="flex-grow"
              container-class="py-0.5 px-1"
              :disabled="editRoomLoading"
              :placeholder="roomData?.name"
            ></AppFormInput>
            
            <AppButton 
              type="submit" 
              size="sm"
              variant="text" 
              :loading="editRoomLoading"
              :disabled="!editRoomForm.name"
            >
              <CheckIcon class="h-6 w-6"></CheckIcon>
            </AppButton>

            
            <AppButton 
              size="sm" 
              variant="text" 
              color="secondary-500"
              :loading="editRoomLoading"
              @click="isEditRoom = false" 
            >
              <XMarkIcon class="h-6 w-6"></XMarkIcon>
            </AppButton>
          </AppForm>
        </div>
        <!-- Chat Members -->
        <div class="flex md:flex-col gap-5">
          <!-- Member  -->
          <ChatRoomMember
            v-for="member in (roomData?.is_private ? roomData.members : roomMembers)"
            :key="`${member.first_name}${member.id}`"
            :online="!!roomMembers.find(mem=>mem.id === member.id)"
            class="flex items-center gap-2"
            v-bind="{ ...member }"  
          ></ChatRoomMember>

          <!-- Add Member Modal -->
          <AppModal 
            v-if="roomData?.is_private" 
            close-icon
          >
            
            <!-- New Member Trigger -->
            <template #trigger="{ toggleModal }">
              <AppTooltip 
                tooltip-text="Add Member" 
                direction="right"
              >
                <AppButton
                  size="sm" 
                  variant="outline" 
                  color="success-500" 
                  class="pl-0 pr-0 pb-0 pt-0 rounded-full"
                  @click="toggleModal"
                >
                  <PlusIcon
                    class="h-5 w-5 inline"
                  ></PlusIcon>
                </AppButton>
              </AppTooltip>
            </template>
            <!-- Add Member Form -->
            <AppForm
              v-if="!addMemberSuccess" 
              class="p-5 flex flex-col gap-5"
              @validate="addMember"
            >
              <div>
                Enter the email of the user you wish to add.
              </div>

              <AppFormInput
                v-model="addMemberForm.email"
                :disabled="addMemberLoading"
                placeholder="user.name@email.com"
                validations="required | email"
              ></AppFormInput>

              <AppFormCheckbox 
                v-model="addMemberForm.is_admin"
                label="Administrator Level"
                toggle-input
              ></AppFormCheckbox>

              <AppButton 
                type="submit"
                :loading="addMemberLoading"
              >
                Submit
              </AppButton>
              
              <!-- <AppButton color="accent-500" variant="outline">
                Copy invitation link
              </AppButton> -->
            </AppForm>
            <!-- Add MEmber Success -->
            <div v-else class="p-5">
              <h5 class="text-3xl text-center mb-5 uppercase font-bold text-accent-500">
                Success
              </h5>
              <p class="text-lg">
                <span class="text-accent-500 font-semibold italic">{{ addMemberForm.email }}</span> 
                successfully added!
              </p>
            </div>
          </AppModal>
        </div>
      </div>

      <!-- Chat box -->
      <div 
        class="
          md:flex-shrink-0 flex-grow-0
          h-full md:w-3/5
          rounded-md 
          bg-white/10
          relative
        "
      >
        <TransitionFade 
          group
          tag="div"
          class="
            p-5 
            absolute top-0 left-0 
            h-full w-full 
            flex flex-col-reverse gap-5
            overflow-auto scrollbar
          "
        >
          <!-- Messages -->
          <ChatRoomMessageVue
            v-for="chat in roomMessage"
            :key="chat.id"
            v-bind="{ ...chat }"
          ></ChatRoomMessageVue>
        </TransitionFade> 
      </div>
    </div>
    
    <!-- Message Input Field -->
    <AppForm
      class="flex-shrink-0 flex items-stretch gap-5"
      @validate="sendMessage" 
    >
      <AppFormInput 
        v-model="sendMessageForm.message"
        :disabled="sendMessageLoading"
        class="flex-grow"
        placeholder="Send a message..."
        validations="required"
        label-class="hidden"
        error-class="hidden"
      ></AppFormInput>
      <AppButton
        :loading="sendMessageLoading" 
        class="" 
        type="submit"
      >
        <span class="hidden md:block">Send</span>
        <PaperAirplaneIcon class="h-5 w-5"></PaperAirplaneIcon>
      </AppButton>
    </AppForm>
  </div>
</template>
