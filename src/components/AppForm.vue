<template>
  <Form
    :validation-schema="validationSchema"
    :initial-values="initialValues"
    @submit="handleSubmit"
    v-slot="{ errors }"
  >
    <div class="flex flex-col gap-4">
      <slot :errors="errors"></slot>

      <!-- actions -->
      <div class="flex justify-between w-full">
        <Button
          v-if="login"
          type="submit"
          label="Sign In"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
        />
      </div>
    </div>
  </Form>
</template>

<script lang="ts" setup>
import { Form } from "vee-validate";
import Button from "primevue/button";

const { validationSchema, initialValues, login, onSubmit, onCancel } =
  defineProps<{
    validationSchema?: any;
    login: boolean;
    initialValues?: Record<string, any>;
    onSubmit: (values: any) => void;
    onCancel?: () => void;
  }>();

const handleSubmit = (values: any) => {
  console.log('AppForm submitting:', values);
  onSubmit(values);
};
</script>
