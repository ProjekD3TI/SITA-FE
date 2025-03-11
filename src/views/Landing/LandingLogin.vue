<template>
    <div class="h-screen flex flex-col bg-white">
      <!-- Header -->
      <HeaderLogin />
      <!-- Landing Page Content -->
      <div class="flex-grow flex items-center justify-center">
        <div
          class="container mx-auto px-4 flex flex-col md:flex-row items-center"
        >
          <!-- Teks di sebelah kiri -->
          <div class="md:w-1/2 text-left mb-8 md:mb-0">
            <h1 class="text-4xl font-bold mb-4 text-gray-800">
              Welcome to the D3 Informatics Engineering Portal
            </h1>
            <p class="text-lg text-gray-600">
              To access more features, please login or create your account.
            </p>
            <router-link :to="{ name: '404' }">
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md text-sm mt-4"
              >
                Get Started!
              </button>
            </router-link>
          </div>
          <!-- Gambar di sebelah kanan dengan animasi -->
          <div class="md:w-1/2 relative">
            <img
              src="/src/assets/images/image_landing.png"
              alt="D3 Teknik Informatika UNS"
              class="w-3/4 mx-auto rounded-lg shadow-lg animate-fade-in"
            />
          </div>
        </div>
      </div>
      <!-- Footer -->
      <Footer />
    </div>
  </template>
  
  <script>
  import HeaderLogin from "../../components/HeaderLogin.vue";
  import Footer from "../../components/Footer.vue";
  
  export default {
    name: "AppComponent",
    components: {
      HeaderLogin,
      Footer,
    },
    mounted() {
      console.log("Routing is working!");
    },
  };
  </script>
  
  <style>
  /* Animasi fade-in */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fadeIn 1s ease-in-out;
  }
  
  /* Styling tambahan */
  .container {
    max-width: 1200px;
  }
  </style>
  