<template>
    <div class="h-screen flex bg-gray-100">
      <!-- Bagian Gambar (Sisi Kiri) -->
      <div class="w-1/2 flex items-center justify-center p-8">
        <!-- Gambar diperkecil -->
        <img src="/src/assets/images/mesen.png" alt="Login Image" class="max-w-[900px] max-h-[1000px] rounded-lg shadow-md" />
      </div>
  
      <!-- Bagian Form Login (Sisi Kanan) -->
      <div class="w-1/2 flex items-center justify-center">
        <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 class="text-2xl font-bold text-gray-800 mb-4 text-center">
            Welcome to Portal 
            <span style="color: #00A2EA;">D</span>
            <span style="color: #F78052;">3</span>
            <span style="color: #00A2EA;">TI</span>!
          </h1>
          <p class="text-gray-600 mb-8 text-center">Login to Your Account</p>
  
          <!-- Tombol Mahasiswa dan Dosen -->
          <div class="flex justify-center mb-6">
            <div class="flex space-x-4 py-3 px-6 bg-[#00A2EA] rounded-full max-w-fit shadow-md">
              <!-- Tombol Mahasiswa -->
              <a 
                href="/loginmhs" 
                class="py-2 px-6 bg-[#00A2EA] text-white font-semibold rounded-full hover:bg-[#0088d4] transition inline-block text-center"
              >
                Mahasiswa
              </a>
              <!-- Tombol Dosen -->
              <button class="py-2 px-4 bg-white text-[#00A2EA] font-reguler rounded-full transition hover:shadow-lg focus:shadow-lg focus:outline-none">
                Dosen
              </button>
            </div>
          </div>
  
          <!-- Form Input Email dan Password -->
          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
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
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
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
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  v-model="rememberMe"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="rememberMe" class="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <a href="#" class="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
  
            <!-- Tombol Login -->
            <button
              type="submit"
              class="w-full py-2 px-4 bg-[#00A2EA] text-white font-semibold rounded-md hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>
  
          <!-- Register Link -->
          <p class="mt-4 text-sm text-gray-600 text-center">
            Don't have an account?
            <a href="#" class="text-[#F78052] hover:text-indigo-500">Register here</a>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        rememberMe: false,
      };
    },
    methods: {
      handleLogin() {
        console.log('Login submitted:', { email: this.email, password: this.password, rememberMe: this.rememberMe });
        // Implementasi logika login di sini
      },
    },
    mounted() {
      console.log('Login component loaded!');
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