<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >New Password</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-4">
          <label
            for="password_confirmation"
            class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <input
            type="password"
            id="password_confirmation"
            v-model="password_confirmation"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Memproses..." : "Reset Password" }}
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
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const token = ref("");
const password = ref("");
const password_confirmation = ref("");
const message = ref("");
const isSubmitting = ref(false);
const isError = ref(false);

onMounted(() => {
  token.value = route.params.token;
});

const formatErrorMessage = (error) => {
  if (error.response?.data?.password) {
    return error.response.data.password.join(" ");
  }
  return error.response?.data?.message || "Terjadi kesalahan";
};

const submitForm = async () => {
  isSubmitting.value = true;
  isError.value = false;
  message.value = "";

  try {
    const response = await axios.post("/api/dosen/reset-password", {
      token: token.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });
    message.value = response.data.message;
    isError.value = false;

    password.value = "";
    password_confirmation.value = "";

    setTimeout(() => {
      router.push({ name: "Landing" });
    }, 2000);
  } catch (error) {
    message.value = formatErrorMessage(error);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};
</script>
