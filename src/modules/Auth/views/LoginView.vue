<script setup lang="ts">
import { ref } from 'vue';
import type { AxiosError } from 'axios';
import { useRouter } from 'vue-router';
// Components
import { 
  AppCard, 
  AppButton, 
  AppForm, 
  AppFormInput, 
  AppFormCheckbox,
  AppFormError,
  AppTooltip,
  AppModal,
  AppLoading
} from '@/components/app'; 
// Services
import { Users } from '@/services';
// Store
import { useAuthStore } from '@/stores/authStore';
// Assets
import logo from '@/assets/logo.png';
import type { ErrorResponse } from '@/services/types';


/** Router composable */
const router = useRouter();

/** Auth Store */
const authStore = useAuthStore()

// Data
const email = ref('');
const password = ref('');
const isRemember = ref(false);
const loading = ref(false);
const success = ref(false);
const error = ref('');


// Login Function
async function loginUser(errors?: string[]) {
  if (errors?.length) return;
  
  loading.value = true;
  try {
    const response = await Users.login({ 
      email: email.value, 
      password: password.value,
      remember: isRemember.value, 
    });
    const userData = { 
      ...response.data.success.data.user, 
      token: response.data.success.data.token 
    };
    authStore.setUser(userData)
    success.value = true;
    router.push({ name: 'ChatRoomList' })
  } catch (e) {
    console.error('Login: Something went wrong', e);
    const err = (e as AxiosError<ErrorResponse>).response?.data.error.message;
    error.value = err || '';
  }
  loading.value = false;


  
}
</script>

<template>
  <div 
    class=" 
      h-full w-full
      flex
    "
  >
    <!--Login Card Column  -->
    <div 
      class="
        relative w-full
        flex flex-col items-center justify-center
      "
    >

      <div 
        class="
          p-4 
          w-full max-w-[450px] 
          flex flex-col
        "
      >
        <h1 
          class="
            text-secondary-50 text-2xl text-center 
            flex items-center justify-center
          "
        >
          <span>Sign in to enter</span> 
          <!-- <AppTooltip
            class="ml-3"
            tooltip-text="email: test@email.com | password: pass123"
          ></AppTooltip> -->
        </h1>
        <div 
          class="
            login-card 
            p-5 
            w-full shadow-none
          "
        >
          
          <AppForm 
            class="flex flex-col gap-5"
            @validate="loginUser"
          >
            <!-- Email Field -->
            <AppFormInput
              v-model="email"
              :disabled="loading"
              label="Email"
              name="Email"
              placeholder="username_1@email.com"
              validations="required | email"
            ></AppFormInput>

            <!-- Password Field -->
            <AppFormInput
              v-model="password"
              :disabled="loading"
              name="Password"
              type="password"
              label="Password"
              placeholder="******"
              validations="required | minLength(6)"
            ></AppFormInput>
            
    
            <div 
              class="
                flex flex-col md:flex-row 
                items-end md:items-center justify-between
              "
            >
              <!-- Remember Checkbox -->
              <AppFormCheckbox
                v-model="isRemember"
                label="Stay signed in"
                toggle-input
                class="flex-shrink-0 hidden"
              ></AppFormCheckbox>

              <!-- Actions Buttons -->
              <div 
                class="
                  mt-4
                  w-full
                  flex flex-col 
                "
              >

                <!-- Submit Button -->
                <AppButton
                  class="w-full"
                  type="submit"
                  :loading="loading"
                >
                  Sign in
                </AppButton>
                
                <!-- Login Error -->
                <AppFormError :error="error" aria-label="form-error" class="text-center"></AppFormError>

                <!-- Sign up Button -->
                <div class="text-sm mt-3 flex items-center justify-center">
                  <p class="font-light">Not a user yet?</p>
                  <AppButton
                    variant="text"
                    class="p-0"
                    :disabled="loading"
                    :to="{ name: 'Register' }"
                  >
                    Sign up
                  </AppButton>
                </div>
              </div>
            </div>
          </AppForm>
        </div>
      </div>
    </div>
    <!-- Login Success Modal -->
    <AppModal :active="success" persist>
      <div class="p-2 text-center">
        <h3 
          class="text-primary-600 font-bold uppercase"
        >
          Successfully logged in
        </h3>

        <p class="mt-3 mb-5 text-sm">
          Please wait. Loading dashboard...
        </p>

        <AppLoading></AppLoading>
      </div>
    </AppModal>
  </div>
</template>
