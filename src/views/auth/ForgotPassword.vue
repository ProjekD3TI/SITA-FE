<template>
    <div class="bg-gray-100 flex items-center justify-center min-h-screen">
      <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Forgot Password?</h2>
        <p class="text-sm text-gray-600 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
  
        <!-- Form -->
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email example@student.uns.ac.id"
              required
            />
          </div>
  
          <!-- Button -->
          <a
            href="/resetpassword"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00A2EA] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue
          </a>
        </form>
  
        <!-- Back to Login -->
        <div class="mt-6 text-center">
          <a href="/loginmhs" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '', // Bind email input value
      };
    },
    methods: {
      handleSubmit() {
        // Simulate sending a reset password email
        if (this.email) {
          alert(`Reset link sent to ${this.email}`);
          this.email = ''; // Clear the input after submission
        } else {
          alert('Please enter a valid email address.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Optional: Add custom styles here */
  </style>