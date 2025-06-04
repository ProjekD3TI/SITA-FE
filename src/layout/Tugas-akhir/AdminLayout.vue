<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      id="admin-sidebar"
      :class="{
        'translate-x-0 w-64': showNavbar,
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
      <div class="flex items-center justify-between p-4 duration-200">
        <router-link to="/">
          <img
            :src="D3TILogo"
            alt="D3TI Logo"
            :class="{ 'w-20': showNavbar, 'w-9 my-2': !showNavbar }"
          />
        </router-link>
        <!-- Close Button (Mobile) -->
        <button
          v-show="showNavbar"
          @click="toggleNavbar"
          class="p-1 duration-150 rounded-full hover:bg-gray-100 lg:hidden active:scale-90 sidebar-toggle"
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

        <div
          v-for="(_, index) in navigationSeparators"
          :key="`separator-${index}`"
          class="max-w-[240px] w-10/12 h-px bg-placeholder mx-auto my-4"
        ></div>

        <SidebarLink
          v-for="link in secondaryNavLinks"
          :key="link.to"
          :to="withPrefix(link.to)"
          :active="link.isActive(route)"
          :showLabel="showNavbar"
          :label="link.label"
          :icon="link.icon"
        />
      </div>
    </aside>

    <!-- Main Content Area -->
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
        :class="{ 'lg:ml-64': showNavbar, 'lg:ml-20': !showNavbar }"
        class="p-4 mt-16 ml-0 duration-200 bg-gray-100 sm:p-6"
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
const showNavbar = ref(false);
const showUser = ref(false);
const isLgScreen = ref(false);
const hasNotification = ref(false);
const showNotification = ref(false);
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
    icon: "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25' />",
    isActive: (route) => route.path.startsWith(withPrefix("/bimbingan")),
  },
  {
    to: "/proposal",
    label: "Proposal",
    icon: "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z' />",
    isActive: (route) => route.path.startsWith(withPrefix("/proposal")),
  },
  {
    to: "/ujian-ta",
    label: "Ujian TA",
    icon: "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12' />",
    isActive: (route) => route.path.startsWith(withPrefix("/ujian-ta")),
  },
];

// Separators between link groups
const navigationSeparators = [1];

// Secondary Navigation
const secondaryNavLinks = [
  {
    to: "/mahasiswa-dosen-aktif",
    label: "Mahasiswa & Dosen",
    icon: "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'/>",
    isActive: (route) => isActive(withPrefix(["/mahasiswa-dosen-aktif"])),
  },
  {
    to: "/ruang-sesi",
    label: "Ruang & Sesi",
    icon: "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3' />",
    isActive: (route) => isActive(withPrefix(["/ruang-sesi"])),
  },
  {
    to: "/kategori",
    label: "Kategori TA",
    icon: "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125' />",
    isActive: (route) => isActive(withPrefix(["/kategori"])),
  },
];

// Add secondary links to main navigation
// navigationLinks.push(...secondaryNavLinks);

// Mock Notifications (Move to a separate store in a real app)
const notifications = ref([
  {
    id: 1,
    title: "Prof. Dika Anjay",
    message: "Telah menerima request pembimbing anda.",
    time: "09/03/2024 20:03",
    isNew: true,
  },
  {
    id: 2,
    title: "Prof. John Doe",
    message: "Bimbingan telah dijadwalkan.",
    time: "08/03/2024 18:00",
    isNew: true,
  },
]);

// Computed Properties
const user = computed(() => ({
  name: username.value || "User",
  role: userRole.value,
}));

// Methods
const withPrefix = (paths) => {
  if (typeof paths === "string") {
    return `/admin-ta/tugas-akhir${paths}`;
  }
  return paths.map((path) => `/admin-ta/tugas-akhir${path}`);
};

const isActive = (paths) => paths.some((path) => path === route.path);

const checkScreenSize = () => {
  isLgScreen.value = window.innerWidth >= 1024;
  if (!isLgScreen.value) {
    showBimbingan.value = false;
    showTugasAkhir.value = false;
  }
};

// Mark notifications as read
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

// Toggle Functionality
const toggleNavbar = () => {
  showNavbar.value = !showNavbar.value;
  localStorage.setItem("adminSidebarOpen", showNavbar.value); // save state
  if (!isLgScreen.value) {
    showNotification.value = false;
    showUser.value = false;
  }
  showBimbingan.value = false;
  showTugasAkhir.value = false;
};

const toggleNotification = () => {
  showNotification.value = !showNotification.value;
  showUser.value = false;
  if (!isLgScreen.value) {
    showNavbar.value = false;
  }
};

const toggleUser = () => {
  showUser.value = !showUser.value;
  showNotification.value = false;
  if (!isLgScreen.value) {
    showNavbar.value = false;
  }
};

const handleLogout = () => {
  try {
    logout();
    username.value = "";
    toast.success("Berhasil Logout!");
    router.push("/");
  } catch (error) {
    toast.error("Terjadi kesalahan saat logout.");
  }
};

// Handle click outside to close dropdowns
const closeDropdownOnClickOutside = (event) => {
  const elements = {
    notificationMenu: document.getElementById("notification-menu"),
    userMenu: document.getElementById("user-menu"),
    notificationButton: document.getElementById("notification-button"),
    userButton: document.getElementById("user-button"),
    sidebar: document.getElementById("admin-sidebar"),
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

// Lifecycle hooks
onMounted(() => {
  // Restore sidebar state from localStorage, default open if not set
  const savedSidebar = localStorage.getItem("adminSidebarOpen");
  if (savedSidebar === null) {
    showNavbar.value = true; // default open
  } else {
    showNavbar.value = savedSidebar === "true";
  }

  // Get user data
  const userData = getUserData();

  if (userData) {
    username.value = userData.name || userData.email?.split("@")[0] || "User";
    userRole.value = userData.role || "Dosen";
  } else {
    // Fallback: try to get from localStorage directly
    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));

      if (userInfo) {
        username.value =
          userInfo.name ||
          userInfo.username ||
          (userInfo.email ? userInfo.email.split("@")[0] : "User");
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
