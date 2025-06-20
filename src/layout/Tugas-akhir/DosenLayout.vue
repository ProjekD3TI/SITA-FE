<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      id="dosen-sidebar"
      :class="{
        'translate-x-0 w-60': showNavbar,
        '-translate-x-full lg:translate-x-0 w-20': !showNavbar,
      }"
      class="fixed top-0 left-0 z-50 h-full duration-200 transform bg-white shadow-md"
    >
      <!-- Toggle Button (Desktop) -->
      <button
        @click="toggleNavbar"
        class="absolute hidden p-2 bg-white border rounded-full shadow-md top-4 -right-4 lg:block hover:text-gray-700 focus:outline-none sidebar-toggle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          :class="{ 'transform rotate-180': showNavbar }"
          class="w-4 h-4 transition-transform duration-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <!-- Sidebar Header -->
      <div
        class="flex items-center justify-between p-4 duration-200"
        :class="{ 'px-8': showNavbar, 'px-4': !showNavbar }"
      >
        <router-link to="/">
          <img
            :src="D3TILogo"
            alt="D3TI Logo"
            class="duration-200"
            :class="{ 'w-20': showNavbar, 'w-9 my-2': !showNavbar }"
          />
        </router-link>
        <!-- Close Button (Mobile) -->
        <button
          v-show="showNavbar"
          @click="toggleNavbar"
          class="p-2 duration-150 rounded-full hover:bg-gray-100 lg:hidden active:scale-90 sidebar-toggle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 lg:hidden"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <div class="mt-5">
        <SidebarLink
          v-for="link in navigationLinks"
          :key="link.to"
          :to="withPrefix(link.to)"
          :active="link.isActive(route)"
          :showLabel="showNavbar"
          :label="link.label"
          :icon="link.icon"
        />
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex flex-col flex-1">
      <!-- Header -->
      <AppHeader
        :show-navbar="showNavbar"
        :toggle-navbar="toggleNavbar"
        :user="user"
        :logo="D3TILogo"
        :show-notification="showNotification"
        :toggle-notification="toggleNotification"
        :has-notification="hasNotification"
        :show-user="showUser"
        :toggle-user="toggleUser"
        :handle-logout="handleLogout"
      />

      <!-- Notification Component -->
      <Notification
        :notifications="notifications"
        :showNotification="showNotification"
        @markAllAsRead="markAllAsRead"
        @markAsRead="markAsRead"
      />

      <!-- Dashboard Content -->
      <main
        :class="{ 'lg:ml-60': showNavbar, 'lg:ml-20': !showNavbar }"
        class="flex-1 p-4 mt-16 ml-0 duration-200 bg-gray-100 sm:p-6"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authMahasiswa, getUserData } from "@/services/authMahasiswa";
import { useToast } from "vue-toastification";
import D3TILogo from "@/assets/images/d3ti-logo.png";

// Components
import SidebarLink from "@/components/Tugas-akhir/SidebarLink.vue";
import Notification from "@/components/Tugas-akhir/Notification.vue";
import AppHeader from "@/layout/Tugas-akhir/AppHeader.vue";

// Hooks
const route = useRoute();
const router = useRouter();
const toast = useToast();
const { logout } = authMahasiswa();

// State
const showBimbingan = ref(false);
const showTugasAkhir = ref(false);
const savedSidebarState = localStorage.getItem("dosenSidebarOpen");
const showNavbar = ref(
  savedSidebarState === null ? true : savedSidebarState === "true"
);
const showUser = ref(false);
const isLgScreen = ref(false);
const hasNotification = ref(false);
const showNotification = ref(false);

// User info
const username = ref("");
const userRole = ref("Dosen"); // Default role

// Navigation Config
const navigationLinks = [
  {
    to: "",
    label: "Dashboard",
    icon: "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />",
    isActive: (route) => isActive(withPrefix(["", "/"])),
  },
  {
    to: "/bimbingan",
    label: "Bimbingan",
    icon: "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />",
    isActive: (route) => route.path.startsWith(withPrefix("/bimbingan")),
  },
  {
    to: "/ujian-ta",
    label: "Ujian TA",
    icon: "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />",
    isActive: (route) => route.path.startsWith(withPrefix("/ujian-ta")),
  },
];

// Mock Notifications (Should be moved to a store in a real app)
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

// Computed Properties
const user = computed(() => ({
  name: username.value || "Dosen",
  role: userRole.value,
}));

// Helper Methods
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

// Notification Methods
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

// Toggle Methods
const toggleNavbar = () => {
  showNavbar.value = !showNavbar.value;
  localStorage.setItem("dosenSidebarOpen", showNavbar.value);
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

// Logout Handler
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

// Event Handlers
const closeDropdownOnClickOutside = (event) => {
  const elements = {
    notificationMenu: document.getElementById("notification-menu"),
    userMenu: document.getElementById("user-menu"),
    notificationButton: document.getElementById("notification-button"),
    userButton: document.getElementById("user-button"),
    sidebar: document.getElementById("dosen-sidebar"),
  };

  // Check if click is on sidebar toggle buttons
  const isToggleButton = Array.from(
    document.querySelectorAll(".sidebar-toggle")
  ).some((button) => button.contains(event.target));

  // Close notification dropdown when clicking outside
  if (
    elements.notificationMenu &&
    !elements.notificationMenu.contains(event.target) &&
    elements.notificationButton &&
    !elements.notificationButton.contains(event.target)
  ) {
    showNotification.value = false;
  }

  // Close user dropdown when clicking outside
  if (
    elements.userMenu &&
    !elements.userMenu.contains(event.target) &&
    elements.userButton &&
    !elements.userButton.contains(event.target)
  ) {
    showUser.value = false;
  }

  // Close sidebar on mobile when clicking outside
  if (
    !isLgScreen.value &&
    showNavbar.value &&
    elements.sidebar &&
    !elements.sidebar.contains(event.target) &&
    !isToggleButton
  ) {
    showNavbar.value = false;
  }
};

// Lifecycle Hooks
onMounted(() => {
  // Restore sidebar state from localStorage, default open if not set
  // const savedSidebar = localStorage.getItem("dosenSidebarOpen");
  // if (savedSidebar === null) {
  //   showNavbar.value = true; // default open
  // } else {
  //   showNavbar.value = savedSidebar === "true";
  // }
  // isSidebarReady.value = true;

  // Get user data
  const userData = getUserData();

  if (userData) {
    username.value = userData.name || userData.email?.split("@")[0] || "Dosen";
    userRole.value = userData.role || "Dosen";
  } else {
    // Fallback: try to get from localStorage directly
    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));

      if (userInfo) {
        username.value =
          userInfo.name ||
          userInfo.username ||
          (userInfo.email ? userInfo.email.split("@")[0] : "Dosen");
        userRole.value = userInfo.role || "Dosen";
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }

  checkScreenSize();
  checkNotification();

  // Add event listeners
  window.addEventListener("resize", checkScreenSize);
  document.addEventListener("click", closeDropdownOnClickOutside);
});

onUnmounted(() => {
  // Remove event listeners
  window.removeEventListener("resize", checkScreenSize);
  document.removeEventListener("click", closeDropdownOnClickOutside);
});
</script>

<style scoped>
.button-rounded {
  border-radius: 0.375rem;
}
</style>
