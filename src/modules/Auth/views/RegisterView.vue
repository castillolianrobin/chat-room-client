
<script setup lang="ts">
import { ref } from 'vue';
import type { AxiosError } from 'axios';
// Components
import { AppButton, AppFormError, AppForm, AppFormInput } from '@/components/app';
// Services
import { Users } from '@/services';
import type { ErrorResponse } from '@/services/types';
// Compsables
import { matchString } from '@/composables/validation/validations';
// Assets
import logo from '@/assets/logo.png';

const form = ref({
  email: '',
  password: '',
  password_confirmation: '',
  first_name: '',
  last_name: '',
})
const error = ref('');
const loading = ref(false);
const success = ref(false);

async function signupUser(errors: string[]) {
  if (errors?.length) return;

  loading.value = true;
  try {
    const response = await Users.register(form.value);
    const registeredUser = response.data.data;
    if (registeredUser) {
      success.value = true;
    }
  } catch (e) {
    console.error('Login: Something went wrong', e);
    const err = (e as AxiosError<ErrorResponse<{}, object>>).response?.data.errors
    error.value = (Object.values(err || {}))?.shift() || 'Error!';
  }
  loading.value = false;
}

</script>

<template>
  <div 
    class="
      w-full h-full
      flex 
      overflow-auto md:overflow-hidden
    "
  >
  <!-- Register column -->
  <div 
      class="
        relative
        w-full
        flex flex-col items-center justify-center
      "
    >

      <div 
        class="
          w-full max-w-[450px] 
          flex flex-col
        "
      >
        <h1 class="text-2xl text-center flex items-center justify-center">
          <span>Be part of chat communities</span> 
          <!-- <AppTooltip
            class="ml-3"
            tooltip-text="email: test@email.com | password: pass123"
          ></AppTooltip> -->
        </h1>
        <div
          class="
            relative
            p-5
            flex-srhink md:flex-shrink-0 
            w-full
            md:overflow-auto
          "
        >
          <div v-if="success">
            <div class="text-center">
              <h1 class="text-2xl font-bold text-primary-500">
                Successfully Registered! 
              </h1>

              <p class="mt-5">
                You can now login and start joining chat rooms.
              </p>
            </div>
          </div>
          <div v-else>  
            <AppForm 
              class="mt-5 flex flex-col gap-5"
              @validate="signupUser"
            >
              <!-- Login Credentials -->
              <div class="relative flex items-center justify-center">
                <div class="absolute h-0.5 w-full bg-secondary-500"></div>
                <h3 class="bg-black relative px-5">Login Credentials</h3>
              </div>

              <!-- Email -->
              <AppFormInput
                v-model="form.email"
                :disabled="loading"
                label="Email"
                name="Email"
                placeholder="username_1@email.com"
                validations="required | email"
              ></AppFormInput>
      
              <!-- Password -->
              <div class="gap-3 grid grid-cols-1 md:grid-cols-1">
                <AppFormInput
                  v-model="form.password"
                  :disabled="loading"
                  name="Password"
                  type="password"
                  label="Password"
                  placeholder="******"
                  validations="required"
                ></AppFormInput>

                <AppFormInput
                  v-model="form.password_confirmation"
                  :disabled="loading"
                  type="password"
                  label="Verify Password"
                  placeholder="******"
                  :validations="[
                    'required', 
                    matchString(form.password, 'Password')
                  ]"
                ></AppFormInput>

              </div>

              <!-- Basic Information -->
              <div class="relative flex items-center justify-center">
                <div class="absolute h-0.5 w-full bg-secondary-500"></div>
                <h3 class="bg-black relative px-5">Basic Information</h3>
              </div>

              <div class="grid gap-3 md:grid-cols-2">
                <!-- First Name  -->
                <AppFormInput
                  v-model="form.first_name"
                  :disabled="loading"
                  name="First Name"
                  label="First Name"
                  placeholder="Juan"
                  validations="required"
                ></AppFormInput>
                
                <!-- Last Name -->
                <AppFormInput
                  v-model="form.last_name"
                  :disabled="loading"
                  name="Last Name"
                  label="Last Name"
                  placeholder="Dela Cruz"
                  validations="required"
                ></AppFormInput>
        
              </div>
              
              <AppFormError 
                :error="error" 
                class="text-center"
                aria-label="form-error"
              ></AppFormError>

              <AppButton 
                :loading="loading"
                class="w-full" 
                type="submit"
              >
                Sign up
              </AppButton>

            </AppForm>
          </div>

          <AppButton
            :to="{ name: 'Login' }"
            variant="text" 
            class="mx-auto font-semibold"
          >
            Back to Login
          </AppButton>
        </div>
      </div>

    
    </div>
  </div>
</template>