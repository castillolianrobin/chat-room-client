<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { AppForm, AppFormInput, AppButton, AppFormCheckbox, AppFormRadio, AppFormSelect, AppFormTextArea } from '@/components/app';
import { ref } from 'vue';


const testInpput = ref('');
const testCheck = ref(false);
const testRadio = ref(false);
const testSelect = ref('');

const selectItem = [
  { value: 'value 2', label: 'Label 2' },
  { value: 'value 1', label: 'Label 1' },
  { value: 'value 3', label: 'Label 3' },
]
</script>

<template>
  <div class="p-5 ">
    <AppButton type="submit" size="lg">
      Submit
    </AppButton>
    
    <AppButton variant="outline" size="sm">
      Outlined
    </AppButton>
    
    <AppButton variant="outline" color="error-500">
      Outlined
    </AppButton>

    <AppButton variant="text">
      Text
    </AppButton>
    <div>
      <AppFormSelect
        v-model="testSelect"    
        :items="selectItem"
        label="Select"
        multiselect
      ></AppFormSelect>
    </div>
    <div class="bg-primary-50">
      <AppFormCheckbox v-model="testCheck" label="Checkbox"></AppFormCheckbox>
      <AppFormRadio v-model="testRadio" label="Checkbox" class="ml-2"></AppFormRadio>
    </div>
    
    <AppFormInput
      v-model="testInpput"
      label="Label 1"
      color="primary-500"
      validations="required"
      name="USername"
    ></AppFormInput>

    
    <AppFormTextArea
      v-model="testInpput"
      label="Label 1"
      color="primary-500"
      validations="required"
      name="USername"
    ></AppFormTextArea>
  
    
    <AppForm @validate="testValidation">
      <AppFormInput
          v-model="testInpput"
          label="Label 1"
          color="primary-500"
          validations="required"
          name="Test Field"
        ></AppFormInput>
<AppFormInput
  v-model="testInpput"
  label="Label 1"
  color="primary-500"
  validations="required"
  name="Test Field"
></AppFormInput>

        <AppFormInput
          v-model="testInpput"
          label="Label 1"
          color="primary-500"
          validations="required"
          name="Test Field"
        ></AppFormInput>

        <button type="submit" class="bg-primary-500 rounded p-3">Submit</button>
      </AppForm>
      test {{  testInpput  }}
  </div>
</template>