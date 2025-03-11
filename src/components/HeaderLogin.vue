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
                  to="/informasi-lapor-kejadian"
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

          <!-- User Profile Capsule Dropdown Button -->
          <div class="flex items-center">
            <div class="relative">
              <button
                @click="toggleProfileDropdown"
                class="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full shadow-md text-sm"
              >
                <span class="mr-2">My Account</span>
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
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
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
export default {
  name: "HeaderComponent",
  data() {
    return {
      isMenuOpen: false, // State untuk mengontrol tampilan menu
      isProfileDropdownOpen: false, // State untuk mengontrol dropdown profil
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
    logout() {
      // Implement logout functionality here
      console.log('Logging out...');
      
      // Example logout implementation:
      // this.$store.dispatch('auth/logout');
      
      // Redirect to landing page after successful logout
      this.$router.push('/');
      
      // Close the dropdown
      this.isProfileDropdownOpen = false;
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