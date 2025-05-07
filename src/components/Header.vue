<template>
  <div>
    <!-- Header -->
    <header>
      <div
        class="bg-[rgba(223,245,255,0.5)] text-gray-800 fixed inset-x-0 top-0 z-10 shadow-md"
      >
        <div class="container mx-auto flex items-center justify-between p-3">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="mr-3">
              <img
                src="/src/assets/images/d3ti-logo.png"
                alt="D3TI UNS Logo"
                class="h-10 w-auto"
              />
            </div>
          </div>

          <!-- Hamburger Menu for Mobile -->
          <button
            @click="toggleMenu"
            class="md:hidden text-gray-800 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          <!-- Navigation Menu (Hidden on Mobile) -->
          <nav
            :class="{ hidden: !isMenuOpen, block: isMenuOpen }"
            class="md:flex space-x-6 relative"
          >
            <router-link to="/" class="hover:text-gray-600"
              >Home</router-link
            >
            <router-link to="/informasi-ta" class="hover:text-gray-600">TA</router-link>
            <router-link to="/informasi-inventaris-peminjaman" class="hover:text-gray-600"
              >Ruang dan Inventaris</router-link
            >
            <!-- Dropdown Menu for "Pelaporan" -->
            <div class="relative group">
              <span class="hover:text-gray-600 cursor-pointer px-4 py-2">Pelaporan</span>
              <!-- Sub-navbar (Dropdown) -->
              <div
                class="absolute top-full left-0 mt-2 bg-gray-800 text-white rounded-lg shadow-lg py-2 w-48 
                opacity-0 group-hover:opacity-100 transition-opacity duration-800 invisible group-hover:visible z-10"
                v-on:mouseleave="e => setTimeout(() => e.target.classList.remove('group-hover:visible'), 1500)"
              >
                <router-link
                  to="/pelaporan/dashboard"
                  class="block px-4 py-2 hover:bg-gray-700"
                >
                  Lapor Kejadian
                </router-link>
                <router-link
                  to="/laporks"
                  class="block px-4 py-2 hover:bg-gray-700"
                >
                  Lapor Kekerasan Seksual
                </router-link>
              </div>
            </div>
          </nav>

          <!-- Login and Register Buttons - Tampilkan hanya jika tidak terautentikasi -->
          <div v-if="!isAuthenticated" class="flex items-center space-x-3">
            <router-link :to="{ name: 'loginmhs' }">
              <button
                class="border border-blue-500 bg-white text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md shadow-md text-sm"
              >
                Login
              </button>
            </router-link>
            <router-link :to="{ name: 'register' }">
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md text-sm"
              >
                Register
              </button>
            </router-link>
          </div>

          <!-- User Profile Capsule Dropdown Button - Tampilkan hanya jika terautentikasi -->
          <div v-if="isAuthenticated" class="flex items-center">
            <div class="relative">
              <button
                @click="toggleProfileDropdown"
                class="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full shadow-md text-sm"
              >
                <span class="mr-2">{{ username || 'My Account' }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <!-- Profile Dropdown Menu -->
              <div
                v-show="isProfileDropdownOpen"
                class="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-48 z-20"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 hover:bg-gray-100"
                >
                  <div class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </div>
                </router-link>
                <router-link
                  :to="getTaskRoute()"
                  class="block px-4 py-2 hover:bg-gray-100"
                >
                  <div class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                      />
                    </svg>
                    Tugas Akhir
                  </div>
                </router-link>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  <div class="flex items-center text-red-600 hover:text-red-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5 mr-2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                    </svg>
                    Logout
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { authMahasiswa, getUserData } from '../services/authMahasiswa';

export default {
  name: "HeaderComponent",
  setup() {
    const router = useRouter();
    const toast = useToast();
    const { logout } = authMahasiswa();
    const username = ref('');
    const userType = ref('');
    
    // Computed property untuk cek apakah pengguna terautentikasi
    const isAuthenticated = computed(() => {
      const userData = getUserData();
      return !!userData; // Akan mengembalikan true jika userData ada, false jika tidak
    });

    onMounted(() => {
      // Mendapatkan data user dari cookie
      const userData = getUserData();
      if (userData) {
        username.value = userData.name || userData.email?.split('@')[0] || 'User';
        userType.value = userData.type || 'mahasiswa';
      } else {
        try {
          const userInfo = JSON.parse(localStorage.getItem('user'));
          if (userInfo && userInfo.username) {
            username.value = userInfo.username;
          } else if (userInfo && userInfo.email) {
            username.value = userInfo.email.split('@')[0];
          }
        } catch (error) {
          console.log('No user data found');
        }
      }
    });

    const getTaskRoute = () => {
      const userData = getUserData();
      if (userData) {
        switch (userData.type) {
          case 'admin':
            return '/admin-ta/tugas-akhir';
          case 'dosen':
            return '/dosen/tugas-akhir';
          case 'mahasiswa':
            return '/mahasiswa/tugas-akhir';
          default:
            return '/mahasiswa/tugas-akhir';
        }
      }
      return '/mahasiswa/tugas-akhir'; // Default route jika tidak ada userData
    };

    const handleLogout = () => {
      try {
        logout();
        toast.success("Berhasil Logout!");
        router.push('/');
      } catch (error) {
        toast.error("Terjadi kesalahan saat logout.");
      }
    };

    return {
      username,
      userType,
      handleLogout,
      getTaskRoute,
      isAuthenticated
    };
  },
  data() {
    return {
      isMenuOpen: false,
      isProfileDropdownOpen: false,
    };
  },
  // Close dropdown when clicking outside
  mounted() {
    document.addEventListener('click', this.closeDropdownOnClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdownOnClickOutside);
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleProfileDropdown(event) {
      event.stopPropagation();
      this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    },
    closeDropdownOnClickOutside(event) {
      const dropdown = document.querySelector('.relative');
      if (dropdown && !dropdown.contains(event.target) && this.isProfileDropdownOpen) {
        this.isProfileDropdownOpen = false;
      }
    }
  }
};
</script>

<style>
/* Tambahkan styling tambahan jika diperlukan */
@media (max-width: 768px) {
  nav {
    display: none; /* Sembunyikan menu navigasi secara default */
    flex-direction: column;
    background-color: rgba(223, 245, 255, 0.9);
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  nav.block {
    display: flex; /* Tampilkan menu navigasi saat state `isMenuOpen` true */
  }

  nav a,
  nav div {
    margin: 0.5rem 0;
  }
}
</style>