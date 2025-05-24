t<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div v-bind:class="{
      'translate-x-0  w-64': showNavbar,
      '-translate-x-full lg:translate-x-0 w-20': !showNavbar,
    }" class="fixed top-0 left-0 z-50 h-full duration-200 transform bg-white shadow-md">
      <div class="absolute top-4 -right-4">
        <button @click="toggleNavbar"
          class="hidden p-2 bg-white border rounded-full shadow-md lg:block hover:text-gray-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            :class="{ 'transform rotate-180': showNavbar }" class="w-4 h-4 transition-transform duration-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      <div class="flex items-center justify-between p-4 duration-200">
        <router-link to="/">
          <img :src="D3TILogo" alt="" v-bind:class="{ 'w-20': showNavbar, 'w-9 my-2': !showNavbar }" />
        </router-link>
        <div v-show="showNavbar">
          <button @click="toggleNavbar"
            class="p-2 duration-150 rounded-full hover:bg-gray-100 lg:hidden active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5 lg:hidden">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Navbar  -->
      <nav class="mt-5">
        <SidebarLink :to="withPrefix('')" :active="isActive(withPrefix(['', '/']))" :showLabel="showNavbar"
          label="Dashboard"
          icon="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />" />

        <SidebarLink :to="withPrefix('/bimbingan')" :active="isActive(
          withPrefix([
            '/bimbingan',
            '/bimbingan/detail-bimbingan',
            '/bimbingan/detail-bimbingan/input-nilai-bimbingan',
          ])
        )
          " :showLabel="showNavbar" label="Bimbingan"
          icon="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />" />

        <SidebarLink :to="withPrefix('/ujian-ta')" :active="isActive(
          withPrefix([
            '/ujian-ta',
            '/ujian-ta/detail-ujian-ta',
            '/ujian-ta/detail-ujian-ta/input-nilai-ujian-ta',
          ])
        )
          " :showLabel="showNavbar" label="Ujian TA"
          icon="<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />" />
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col flex-1">
      <!-- Header -->
      <header class="fixed z-40 flex items-center justify-between w-full p-4 bg-white shadow-sm">
        <div class="flex items-center">
          <router-link to="/">
            <img :src="D3TILogo" alt="" class="w-16 lg:hidden" />
          </router-link>
          <button @click="toggleNavbar"
            class="p-1 duration-150 rounded-full hover:bg-gray-100 lg:hidden active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5 lg:hidden">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div class="flex items-center">
          <div class="relative mr-2">
            <button id="notification-button" @click="toggleNotification"
              class="flex p-1 text-gray-500 duration-150 hover:text-gray-700 focus:outline-none active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <svg :class="{ 'transform rotate-180': showNotification }" xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              <div v-show="hasNotification"
                class="absolute top-0 w-3 h-3 border-2 border-white rounded-full right-6 bg-secondary"></div>
            </button>
          </div>
          <div class="flex items-center">
            <span class="hidden mr-2 text-sm font-medium sm:inline">{{
              user.name
            }}</span>
            <button id="user-button" @click="toggleUser"
              class="flex items-center justify-center w-8 h-8 duration-150 bg-gray-200 rounded-full active:scale-90">
              <span class="text-sm font-medium text-gray-600">{{
                user.name.charAt(0)
              }}</span>
            </button>
          </div>
        </div>

        <!-- notifikasi -->
        <Notification :notifications="notifications" :showNotification="showNotification" @markAllAsRead="markAllAsRead"
          @markAsRead="markAsRead" />

        <!-- user menu -->
        <div id="user-menu" class="absolute z-50 w-64 mt-2 duration-200 bg-white rounded-lg shadow-lg top-12 right-5"
          v-show="showUser">
          <div class="p-4">
            <ul class="">
              <li>
                <router-link to="/"
                  class="flex items-center w-full px-4 py-2 text-left duration-200 active:scale-90 hover:bg-gray-100 button-rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <button>Home</button>
                </router-link>
              </li>
              <li>
                <router-link to=""
                  class="flex items-center w-full px-4 py-2 text-left duration-200 active:scale-90 hover:bg-gray-100 button-rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <button>Profile</button>
                </router-link>
              </li>
              <li>
                <button
                  class="flex items-center w-full px-4 py-2 text-left duration-200 text-danger active:scale-90 hover:bg-gray-100 button-rounded"
                  @click="handleLogout">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Log Out</button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <!-- Dashboard Content -->
      <main v-bind:class="{ 'lg:ml-64': showNavbar, 'lg:ml-20': !showNavbar }"
        class="flex-1 p-4 mt-16 ml-0 duration-200 bg-gray-100 sm:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import D3TILogo from "@/assets/images/d3ti-logo.png";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authMahasiswa, getUserData } from "@/services/authMahasiswa";
import { useToast } from "vue-toastification";

// sidebar
import SidebarLink from "@/components/Tugas-akhir/SidebarLink.vue";
import SidebarDropdown from "@/components/Tugas-akhir/SidebarDropdown.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { logout } = authMahasiswa();

// Notifikasi
import Notification from "@/components/Tugas-akhir/Notification.vue";

const notifications = ref([
  {
    id: 1,
    title: "Prof. Dika Anjay",
    message:
      "Telah menerima request pembimbing anda. Telah menerima request pembimbing anda. Telah menerima request pembimbing anda.",
    time: "09/03/2024 20:03",
    isNew: true,
  },
  {
    id: 2,
    title: "Prof. Dika Anjay",
    message:
      "Telah menerima request pembimbing anda. Telah menerima request pembimbing anda. Telah menerima request pembimbing anda.",
    time: "09/03/2024 20:03",
    isNew: true,
  },
  {
    id: 3,
    title: "Prof. Dika Anjay",
    message:
      "Telah menerima request pembimbing anda. Telah menerima request pembimbing anda. Telah menerima request pembimbing anda.",
    time: "09/03/2024 20:03",
    isNew: true,
  },
  {
    id: 4,
    title: "Prof. John Doe",
    message: "Bimbingan telah dijadwalkan.",
    time: "08/03/2024 18:00",
    isNew: true,
  },
]);

const showNotification = ref(false);

const markAsRead = (notificationId) => {
  const index = notifications.value.findIndex((n) => n.id === notificationId);
  if (index !== -1) {
    notifications.value[index].isNew = false;
    checkNotification();
  }
};

const markAllAsRead = () => {
  notifications.value.forEach((notification) => (notification.isNew = false));
  checkNotification();
};

const checkNotification = () => {
  hasNotification.value = notifications.value.some(
    (notification) => notification.isNew
  );
};

const showBimbingan = ref(false);
const showTugasAkhir = ref(false);
const showNavbar = ref(false);
const showUser = ref(false);
const isLgScreen = ref(false);
const hasNotification = ref(false);

const withPrefix = (paths) => {
  if (typeof paths === "string") {
    return `/dosen/tugas-akhir${paths}`;
  }
  return paths.map((path) => `/dosen/tugas-akhir${path}`);
};

const isActive = (paths) => {
  return paths.some((path) => path === route.path);
};

const checkScreenSize = () => {
  isLgScreen.value = window.innerWidth >= 1024;
  if (isLgScreen.value === false) {
    showBimbingan.value = false;
    showTugasAkhir.value = false;
  }
};

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
  document.removeEventListener("click", closeDropdownOnClickOutside);
});

const closeDropdownOnClickOutside = (event) => {
  const notificationMenu = document.getElementById("notification-menu");
  const userMenu = document.getElementById("user-menu");
  const notificationButton = document.getElementById("notification-button");
  const userButton = document.getElementById("user-button");

  // Tutup dropdown jika klik di luar menu dan tombol terkait
  if (
    notificationMenu &&
    !notificationMenu.contains(event.target) &&
    notificationButton &&
    !notificationButton.contains(event.target)
  ) {
    showNotification.value = false;
  }

  if (
    userMenu &&
    !userMenu.contains(event.target) &&
    userButton &&
    !userButton.contains(event.target)
  ) {
    showUser.value = false;
  }
};

const toggleBimbingan = () => {
  showBimbingan.value = !showBimbingan.value;
  showNavbar.value = true;
};

const toggleTugasAkhir = () => {
  showTugasAkhir.value = !showTugasAkhir.value;
  showNavbar.value = true;
};

const toggleNavbar = () => {
  showNavbar.value = !showNavbar.value;
  if (isLgScreen.value == false) {
    showNotification.value = false;
    showUser.value = false;
  }
  showBimbingan.value = false;
  showTugasAkhir.value = false;
};
const toggleNotification = () => {
  showNotification.value = !showNotification.value;
  showUser.value = false;
  if (isLgScreen.value == false) {
    showNavbar.value = false;
  }
};
const toggleUser = () => {
  showUser.value = !showUser.value;
  showNotification.value = false;
  if (isLgScreen.value == false) {
    showNavbar.value = false;
  }
};

// Referensi untuk nama user
const username = ref("");
const userRole = ref("Dosen"); // Default role

// Computed property untuk user data
const user = computed(() => {
  return {
    name: username.value || "Dosen",
    role: userRole.value,
  };
});

// Tambahkan event listener untuk resize
onMounted(() => {
  // Ambil data user menggunakan getUserData()
  const userData = getUserData();

  if (userData) {
    username.value = userData.name || userData.email?.split("@")[0] || "Dosen";
    userRole.value = userData.role || "Dosen";
    console.log("Username set from getUserData:", username.value);
  } else {
    // Fallback: coba ambil dari localStorage langsung
    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      console.log("User info from localStorage:", userInfo);

      if (userInfo && userInfo.name) {
        username.value = userInfo.name;
      } else if (userInfo && userInfo.username) {
        username.value = userInfo.username;
      } else if (userInfo && userInfo.email) {
        username.value = userInfo.email.split("@")[0];
      }

      // Set role jika ada
      if (userInfo && userInfo.role) {
        userRole.value = userInfo.role;
      }

      console.log("Username set from localStorage:", username.value);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }

  checkScreenSize();
  checkNotification();

  window.addEventListener("resize", checkScreenSize);
  document.addEventListener("click", closeDropdownOnClickOutside);
});

const handleLogout = () => {
  try {
    logout();
    username.value = ""; // Reset username
    toast.success("Berhasil Logout!");
    router.push("/");
  } catch (error) {
    toast.error("Terjadi kesalahan saat logout.");
  }
};
</script>
