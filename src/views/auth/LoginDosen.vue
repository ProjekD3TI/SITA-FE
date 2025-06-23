<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <!-- Image Section - Hidden on mobile, visible on md and up -->
    <div class="hidden md:flex md:w-1/2 items-center justify-center p-4 lg:p-8">
      <img
        src="/src/assets/images/mesen.png"
        alt="Login Image"
        class="w-full max-w-[600px] lg:max-w-[900px] rounded-lg shadow-md object-cover"
      />
    </div>

    <!-- Login Form Section -->
    <div class="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
      <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-6 md:p-8">
        <!-- Header -->
        <h1 class="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">
          Welcome to Portal
          <span class="text-[#00a2ea]">D</span>
          <span class="text-[#f78052]">3</span>
          <span class="text-[#00a2ea]">TI</span>!
        </h1>
        <p class="text-gray-600 mb-6 text-center text-sm md:text-base">
          Login to Your Account
        </p>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <!-- User Type Selector -->
        <div class="flex justify-center mb-6">
          <div class="flex space-x-2 md:space-x-4 py-2 px-4 md:py-3 md:px-6 bg-[#00A2EA] rounded-full shadow-md">
            <router-link
              :to="{ name: 'loginmhs' }"
              class="py-2 px-4 md:px-6 bg-[#00A2EA] text-white text-sm md:text-base font-semibold rounded-full hover:bg-[#0088d4] transition"
            >
              Mahasiswa
            </router-link>
            <button
              class="py-2 px-3 md:px-4 bg-white text-[#00A2EA] text-sm md:text-base font-medium rounded-full transition hover:shadow-lg focus:shadow-lg focus:outline-none"
            >
              Dosen
            </button>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4" novalidate>
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              v-model="email"
              :disabled="loading"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'opacity-50 cursor-not-allowed': loading }"
              placeholder="Enter your email"
              required
              autocomplete="email"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              v-model="password"
              :disabled="loading"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'opacity-50 cursor-not-allowed': loading }"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
            />
          </div>
          
          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-2.5 px-4 bg-[#00A2EA] text-white font-semibold rounded-md hover:bg-[#0088d4] transition duration-150 ease-in-out text-sm md:text-base"
            :class="{ 'opacity-75 cursor-not-allowed': loading }"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </span>
            <span v-else>Login</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authDosen } from "../../services/authDosen";

// Reactive references
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const currentDateTime = ref("2025-05-17 00:06:16"); // Initialize with provided time

// Initialize auth service
const { loginDosen, checkAuth } = authDosen();

// Check authentication on mount
onMounted(() => {
  if (checkAuth()) {
    router.push("/dosen/dashboard");
  }
});

// Handle login submission
const handleLogin = async () => {
  try {
    // Validate inputs
    if (!email.value || !password.value) {
      errorMessage.value = "Email dan password harus diisi";
      return;
    }

    // Clear previous error and set loading
    errorMessage.value = "";
    loading.value = true;

    // Attempt login
    await loginDosen(email.value, password.value);
    
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.value = 
      error?.response?.data?.message || 
      "Gagal melakukan login. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Transitions */
.transition {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom max-width for larger screens */
@media (min-width: 1024px) {
  .max-w-custom {
    max-width: 900px;
  }
}

/* Focus styles */
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 162, 234, 0.2);
}

/* Custom button hover effect */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>