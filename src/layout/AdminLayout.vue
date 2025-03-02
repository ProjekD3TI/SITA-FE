<template>
  <div class="min-h-screen bg-gray-100 flex">
    <Sidebar
      :is-collapsed="isSidebarCollapsed"
      :is-mobile="isMobile"
      @toggle-sidebar="toggleSidebar"
    />

    <div
      class="flex flex-col min-h-screen w-full transition-all duration-300"
      :class="{
        'lg:ml-64': !isSidebarCollapsed,
        'lg:ml-16': isSidebarCollapsed,
      }"
    >
      <Navbar />

      <main class="flex-1 p-4 md:p-6">
        <router-view />
      </main>

      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Navbar from "../components/Admin/Header.vue";
import Sidebar from "../components/Admin/Sidebar.vue";
import Footer from "../components/Admin/Footer.vue";

const isSidebarCollapsed = ref(false);
const isMobile = ref(false);

const toggleSidebar = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 991.98;
  if (isMobile.value) {
    isSidebarCollapsed.value = true;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
