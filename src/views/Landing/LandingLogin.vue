<template>
  <div class="h-screen flex flex-col bg-white">
    <!-- Header -->
    <HeaderLogin />
    
    <!-- Landing Page Content -->
    <div class="flex-grow flex items-center justify-center">
      <div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <!-- Text on the left -->
        <div class="md:w-1/2 text-left mb-8 md:mb-0">
          <h1 class="text-4xl font-bold mb-4 text-gray-800">
            Welcome to the D3 Informatics Engineering Portal
          </h1>
          <p class="text-lg text-gray-600 mb-4">
            To access more features, please login to your account.
          </p>
          
          <!-- Login Form -->
          <div class="bg-white shadow rounded-lg p-6 mb-4">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Login</h2>
            <form @submit.prevent="handleLogin">
              <div class="mb-4">
                <label class="block text-gray-700 mb-2" for="nim">NIM</label>
                <input
                  type="text"
                  id="nim"
                  v-model="nim"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div class="mb-6">
                <label class="block text-gray-700 mb-2" for="password">Password</label>
                <input
                  type="password"
                  id="password"
                  v-model="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
              >
                Login
              </button>
            </form>
          </div>
        </div>
        
        <!-- Image on the right with animation -->
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HeaderLogin from "../../components/HeaderLogin.vue";
import Footer from "../../components/Footer.vue";
import VueCookies from "vue-cookies";
import { encryptData } from "../../services/encrypt";

export default {
  name: "LandingLogin",
  components: {
    HeaderLogin,
    Footer
  },
  setup() {
    const router = useRouter();
    const nim = ref('');
    const password = ref('');
    
    onMounted(() => {
      // Redirect to root if accessed directly
      router.push('/');
    });
    
    const handleLogin = () => {
      // Mock login - in a real app, you'd make an API call here
      const userData = {
        nim: nim.value,
        name: "Student Name", // You would get this from API response
        email: `${nim.value}@student.uns.ac.id`, // Example email format
      };
      
      // Save user data in cookies (encrypted)
      VueCookies.set("user_session", encryptData(userData), "1d");
      
      // Redirect to dashboard or home
      router.push('/dashboard');
    };
    
    return {
      nim,
      password,
      handleLogin
    };
  }
};
</script>

<style>
/* Fade-in animation */
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

/* Additional styling */
.container {
  max-width: 1200px;
}
</style>