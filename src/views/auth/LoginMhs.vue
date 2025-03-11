<template>
  <div class="h-screen flex bg-gray-100">
    <!-- Bagian Gambar (Sisi Kiri) -->
    <div class="w-1/2 flex items-center justify-center p-8">
      <!-- Gambar diperkecil -->
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
          Welcome to Portal
          <span style="color: #00a2ea">D</span>
          <span style="color: #f78052">3</span>
          <span style="color: #00a2ea">TI</span>!
        </h1>
        <p class="text-gray-600 mb-8 text-center">Login to Your Account</p>

        <!-- Tombol Mahasiswa dan Dosen -->
        <div class="flex justify-center mb-6">
          <div
            class="flex space-x-4 py-3 px-6 bg-[#00A2EA] rounded-full max-w-fit shadow-md"
          >
            <!-- Tombol Mahasiswa -->
            <button
              class="py-2 px-4 bg-white text-[#00A2EA] font-reguler rounded-full transition hover:shadow-lg focus:shadow-lg focus:outline-none"
            >
              Mahasiswa
            </button>
            <!-- Tombol Dosen -->
            <router-link
              :to="{ name: 'logindosen' }"
              class="py-2 px-6 bg-[#00A2EA] text-white font-semibold rounded-full hover:bg-[#0088d4] transition inline-block text-center"
            >
              Dosen
            </router-link>
          </div>
        </div>

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
          </div>

          <!-- Remember Me dan Forgot Password -->
          <div class="flex justify-end items-center mb-6">
            <!-- <div class="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                v-model="rememberMe"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="rememberMe" class="ml-2 block text-sm text-gray-900">Remember me</label>
            </div> -->
            <router-link
              :to="{ name: 'ForgotPasswordMahasiswa' }"
              class="text-sm text-indigo-600 hover:text-indigo-500"
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

        <!-- Register Link -->
        <p class="mt-4 text-sm text-gray-600 text-center">
          Don't have an account?
          <a href="/register" class="text-[#F78052] hover:text-indigo-500"
            >Register here</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { authMahasiswa } from "../../services/authMahasiswa";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const router = useRouter();

const { loginMahasiswa } = authMahasiswa();

const handleLogin = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";
    
    // Call the login service
    const result = await loginMahasiswa(email.value, password.value);
    
    // If login is successful, redirect to landing-login
    router.push("/mahasiswa/dashboard");
  } catch (error) {
    // Handle login error
    errorMessage.value = error.message || "Failed to login. Please check your credentials.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Styling tambahan jika diperlukan */
.max-w-\[300px\] {
  max-width: 300px;
}
.max-h-\[400px\] {
  max-height: 400px;
}
</style>