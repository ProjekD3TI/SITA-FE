<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-8xl font-bold text-gray-800 mb-4 text-center">
          <span style="color: #00A2EA;">4</span>
          <span style="color: #F78052;">0</span>
          <span style="color: #00A2EA;">4</span>
      </h1>
      <p class="mt-2 text-xl font-medium text-gray-600">Oops... Page Not Found</p>
      <p class="mt-4 text-gray-500">
        We’re sorry, the page you are trying to access cannot be found.<br />
        Please make sure the URL you entered is correct.
      </p>

      <!-- Button to Home Page -->
      <button
        @click="goToHomePage"
        class="mt-6 inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#00A2EA] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Go to Home Page
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goToHomePage() {
      // Redirect to the home page
      this.$router.push('/'); // If using Vue Router
      // OR use window.location.href if not using Vue Router:
      // window.location.href = '/';
    },
  },
};
</script>

<style scoped>
/* Optional: Add custom styles here */
</style>