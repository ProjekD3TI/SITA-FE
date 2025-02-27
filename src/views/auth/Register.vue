<template>
    <div class="h-screen flex bg-gray-100">
      <!-- Bagian Form Register (Sisi Kiri) -->
      <div class="w-1/2 flex items-center justify-center">
        <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 class="text-2xl font-bold text-gray-800 mb-4 text-center">
            Welcome to Portal 
            <span style="color: #00A2EA;">D</span>
            <span style="color: #F78052;">3</span>
            <span style="color: #00A2EA;">TI</span>!
          </h1>
          <p class="text-gray-600 mb-8 text-center">Create Your Account</p>
  
          <!-- Form Register -->
          <form @submit.prevent="handleRegister">
            <!-- Full Name -->
            <div class="mb-4">
              <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                v-model="fullName"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your full name"
                required
              />
            </div>
  
            <!-- NIM -->
            <div class="mb-4">
              <label for="nim" class="block text-sm font-medium text-gray-700">NIM</label>
              <input
                type="text"
                id="nim"
                v-model="nim"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your NIM"
                required
              />
            </div>
  
            <!-- Phone Number -->
            <div class="mb-4">
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                v-model="phone"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your phone number"
                required
              />
            </div>
  
            <!-- Email Address -->
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
  
            <!-- Password -->
            <div class="mb-4 relative">
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
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
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                @click="togglePasswordVisibility"
              >
                <svg
                  v-if="!showPassword"
                  class="h-5 w-5 text-gray-400"
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
                  class="h-5 w-5 text-gray-400"
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
  
            <!-- Confirm Password -->
            <div class="mb-6 relative">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
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
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                @click="toggleConfirmPasswordVisibility"
              >
                <svg
                  v-if="!showConfirmPassword"
                  class="h-5 w-5 text-gray-400"
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
                  class="h-5 w-5 text-gray-400"
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
  
            <!-- Tombol Register -->
            <button
              type="submit"
              class="w-full py-2 px-4 bg-[#00A2EA] text-white font-semibold rounded-md hover:bg-[#0088d4] transition"
            >
              Register
            </button>
          </form>
  
          <!-- Link Login -->
          <p class="mt-4 text-sm text-gray-600 text-center">
            Already have an account?
            <a href="/loginmhs" class="text-[#F78052] hover:text-indigo-500">Login here</a>
          </p>
        </div>
      </div>
  
      <!-- Bagian Gambar (Sisi Kanan) -->
      <div class="w-1/2 flex items-center justify-center p-8">
        <img src="/src/assets/images/mesen.png" alt="Register Image" class="max-w-[900px] max-h-[1000px] rounded-lg shadow-md" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Register',
    data() {
      return {
        fullName: '',
        nim: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
      };
    },
    methods: {
      handleRegister() {
        console.log('Register submitted:', {
          fullName: this.fullName,
          nim: this.nim,
          phone: this.phone,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
        });
        // Implementasi logika register di sini
      },
      togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      },
      toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
      },
    },
    mounted() {
      console.log('Register component loaded!');
    },
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