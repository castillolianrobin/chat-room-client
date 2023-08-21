<script setup lang="ts">
import { ref } from "vue";
// Components
import SettingsSidebar from "../components/SettingsSidebar.vue";
import { AppButton, AppForm, AppFormFile, AppFormInput, AppFormLabel } from "@/components/app";
// Services
import { Settings, type ProfileForm } from "@/services";
// Store
import { useAuthStore } from "@/stores/authStore";

// Initialization
const authStore = useAuthStore();
let userDetails = authStore.user?.user_details;
console.log(authStore.user);
// Save Profile Data
const form = ref<ProfileForm>({
  first_name: userDetails?.first_name || "",
  last_name: userDetails?.last_name || "",
  middle_name: userDetails?.middle_name,
  profile_img: null,
});
const profileImgHolder = ref([]);
const saveLoading = ref(false);
const saveSuccess = ref(false);

// Save Profile Function
async function saveProfile(err: String[]) {
  if (err.length) return;
  saveLoading.value = true;
  try { 
    const data = {
      ...form.value,
      profile_img: [...profileImgHolder.value].pop() ?? null,
    }
    const response = await Settings.updateProfile(data);

    if (response.data.data && authStore.user) {
      authStore.setUser({
        ...authStore.user,
        user_details: response.data.data,
      });

      userDetails = response.data.data;
    }
  } catch {
    alert('An error occured');
  }
  saveLoading.value = false;
}


/** Helpers */

function createThumbnail(file: File) {
  return URL.createObjectURL(file);
}
</script>

<template>
  <div class="w-full flex gap-5">
    <SettingsSidebar></SettingsSidebar>
    <!-- Content Container -->
    <div class="p-5 border flex-grow">
      <h3 class="text-lg font-semibold">
        Profile Settings
      </h3>

      <!-- Content -->
      <AppForm 
        class="mt-5 flex flex-col gap-5"
        @validate="saveProfile"
      >
        <AppFormInput
          v-model="form.first_name"
          label="First Name"
          placeholder="Juan"
          validations="required"
        ></AppFormInput>

        <AppFormInput
          v-model="form.last_name"
          label="Last Name"
          placeholder="Dela Cruz"
          validations="required"
        ></AppFormInput>

        <AppFormInput 
          v-model="form.middle_name" 
          placeholder="(Optional)"
          label="Middle Name"
        ></AppFormInput>

        <AppFormFile
          v-model="profileImgHolder"
          label="Profile Image"
          accept="image/png, image/jpeg"
        >
          <template #display><span></span></template>
          <template #dropzone="{ modelValue }">
            <div class="px-16 flex w-full">
            <img 
              :src="modelValue?.length 
                ? createThumbnail(modelValue[0])
                : userDetails?.profile_img_url" 
              alt="Profile image"
              class="
                rounded-full 
                border 
                border-primary-500 
                bg-black
                aspect-square
                w-full
              "
            />
          </div>
          </template>
        </AppFormFile>

        <!-- <div class="flex flex-col gap-3 items-start">
          <AppFormLabel>Current Profile Image</AppFormLabel>
          
        </div> -->

        <AppButton 
          class="ml-auto" 
          type="submit"
          :loading="saveLoading"
        > 
          Save Settings
        </AppButton>
      </AppForm>
    </div>
  </div>
</template>
