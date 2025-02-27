<template>
    <div class="bg-gray-100 flex items-center justify-center min-h-screen">
      <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Reset Password</h2>
        <p class="text-sm text-gray-600 mb-6">
          Create a new password that is at least 8 characters long, combining uppercase and lowercase letters, numbers, and special symbols (e.g., !, %, &, *).
        </p>
  
        <!-- Password -->
        <div class="mb-4 relative">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-2 flex items-center"
              @click="togglePasswordVisibility"
            >
              <svg
                v-if="!showPassword"
                class="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.521 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.51 3.51m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                ></path>
              </svg>
            </button>
          </div>
        </div>
  
        <!-- Confirm Password -->
        <div class="mb-6 relative">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <div class="relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="confirmPassword"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-2 flex items-center"
              @click="toggleConfirmPasswordVisibility"
            >
              <svg
                v-if="!showConfirmPassword"
                class="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.521 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.51 3.51m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                ></path>
              </svg>
            </button>
          </div>
        </div>
  
        <!-- Button -->
        <button
          type="button"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00A2EA] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="handleSubmit"
        >
          Continue
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
      };
    },
    methods: {
      togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      },
      toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
      },
      validatePassword(password) {
        // Minimal 8 karakter, kombinasi huruf besar/kecil, angka, dan simbol
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
      },
      handleSubmit() {
        if (!this.password || !this.confirmPassword) {
          alert('Please fill in both fields.');
          return;
        }
  
        if (this.password !== this.confirmPassword) {
          alert('Passwords do not match.');
          return;
        }
  
        if (!this.validatePassword(this.password)) {
          alert(
            'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special symbols.'
          );
          return;
        }
  
        // Simulate successful password reset
        alert('Password successfully updated!');
        this.$router.push('/loginmhs'); // Redirect to login page
      },
    },
  };
  </script>
  
  <style scoped>
  /* Optional: Add custom styles here */
  </style>