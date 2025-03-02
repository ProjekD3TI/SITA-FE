<template>
  <div class="h-screen flex bg-gray-100">
    <!-- Bagian Gambar (Sisi Kiri) -->
    <div class="w-1/2 flex items-center justify-center p-8">
      <img
        src="/src/assets/images/mesen.png"
        alt="Login Image"
        class="max-w-[900px] max-h-[1000px] rounded-lg shadow-md"
      />
    </div>

    <!-- Bagian Form Login (Sisi Kanan) -->
    <div class="w-1/2 flex items-center justify-center">
      <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold text-gray-800 mb-4 text-center">
          Admin Login
        </h1>
        <p class="text-gray-600 mb-8 text-center">Login to Your Account</p>

        <div
          v-if="errorMessage"
          class="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
        >
          {{ errorMessage }}
        </div>

        <!-- Form Input Email dan Password -->
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              type="email"
              id="email"
              v-model="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="mb-4">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <input
              type="password"
              id="password"
              v-model="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              required
            />
            <router-link
              :to="{ name: 'ForgotPasswordAdmin' }"
              class="text-sm flex justify-end py-4 text-indigo-600 hover:text-indigo-500"
              >Forgot password?
            </router-link>
          </div>

          <!-- Tombol Login -->
          <button
            type="submit"
            class="w-full py-2 px-4 bg-[#00A2EA] text-white font-semibold rounded-md hover:bg-indigo-700 transition"
            :disabled="loading"
          >
            <span v-if="loading">Loading...</span>
            <span v-else>Login</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { authAdmin } from "../../services/authAdmin";

const email = ref("");
const password = ref("");
const { loginAdmin } = authAdmin();

const handleLogin = () => {
  loginAdmin(email.value, password.value);
};
</script>
