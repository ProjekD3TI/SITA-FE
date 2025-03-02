<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Mengirim..." : "Kirim Link Reset" }}
        </button>
      </form>
      <p
        v-if="message"
        :class="[
          'mt-4 text-center text-sm',
          isError ? 'text-red-600' : 'text-green-600',
        ]"
      >
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const message = ref("");
const isSubmitting = ref(false);
const isError = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;
  isError.value = false;

  try {
    const response = await axios.post("/api/admin/forgot-password", {
      email: email.value,
    });
    message.value = response.data.message;
    isError.value = false;
    email.value = "";
  } catch (error) {
    message.value = error.response?.data?.message || "Terjadi kesalahan";
    isError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};
</script>
