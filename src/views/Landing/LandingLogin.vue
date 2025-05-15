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
          <router-link :to="isAuthenticated ? '/pelaporan/dashboard' : { name: '404' }">
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
import VueCookies from 'vue-cookies';
import axios from 'axios';
import { decryptData } from '../../services/encrypt'; // Adjust path as needed

export default {
  name: "LandingLogin",
  components: {
    HeaderLogin,
    Footer,
  },
  data() {
    return {
      isAuthenticated: false,
      userData: null
    };
  },
  methods: {
    // Check for existing session and validate it
    checkSession() {
      try {
        // First check localStorage
        try {
          const userInfo = JSON.parse(localStorage.getItem('user'));
          if (userInfo) {
            console.log('Found user info in localStorage');
            this.isAuthenticated = true;
            this.userData = userInfo;
            
            // Ensure the session is marked for maintenance
            sessionStorage.setItem('session_maintained', 'true');
            return true;
          }
        } catch (e) {
          console.log('No user data in localStorage');
        }
        
        // Then check cookies
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          try {
            this.userData = decryptData(encryptedUserData);
            if (this.userData && this.userData.token) {
              // Set the token for all axios requests
              axios.defaults.headers.common['Authorization'] = `Bearer ${this.userData.token}`;
              this.isAuthenticated = true;
              
              // Mark session for maintenance
              sessionStorage.setItem('session_maintained', 'true');
              
              console.log("Session maintained for user:", this.userData.name || this.userData.username);
              return true;
            }
          } catch (error) {
            console.error("Error decrypting user data:", error);
          }
        }
        
        this.isAuthenticated = false;
        return false;
      } catch (error) {
        console.error("Error checking session:", error);
        this.isAuthenticated = false;
        return false;
      }
    }
  },
  created() {
    // Configure axios to maintain session across page navigations
    axios.defaults.withCredentials = true;
  },
  mounted() {    
    // Check for existing session
    this.checkSession();
    
    // Set up beforeunload event to prevent session loss on refresh
    window.addEventListener('beforeunload', () => {
      // Set a flag in sessionStorage to prevent redirect on refresh
      sessionStorage.setItem('page_refreshing', 'true');
    });
    
    // Dispatch event so header updates
    window.dispatchEvent(new Event('user-logged-in'));
  },
  beforeUnmount() {
    // If navigating away, set a flag that we're not logging out
    if (!sessionStorage.getItem('logging_out')) {
      sessionStorage.setItem('session_maintained', 'true');
    }
    
    // Remove event listener
    window.removeEventListener('beforeunload', () => {});
  }
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