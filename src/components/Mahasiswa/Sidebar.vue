<template>
  <div>
    <button class="fixed top-2 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md text-gray-800 focus:outline-none"
      @click="toggleSidebar" v-if="isCollapsed && isMobile">
      <i class="fas fa-bars text-xl"></i>
    </button>

    <aside class="fixed left-0 top-0 h-screen bg-indigo-600 text-white transition-all duration-300 z-40" :class="{
      'w-64': !isCollapsed,
      'w-16': isCollapsed && !isMobile,
      'w-64 -translate-x-full': isCollapsed && isMobile,
    }">
      <div class="flex items-center justify-between h-16 px-4 border-b border-indigo-700">
        <router-link to="/home" class="font-bold text-xl truncate" v-if="!isCollapsed || isMobile">
          APLAB
        </router-link>
        <button class="p-1 hover:bg-indigo-700 rounded-md transition-colors" @click="toggleSidebar">
          <i :class="[
            'fas',
            isCollapsed && !isMobile ? 'fa-chevron-right' : 'fa-chevron-left',
          ]"></i>
        </button>
      </div>

      <nav class="flex flex-col p-2 overflow-y-auto h-[calc(100vh-4rem)]">
        <router-link to="/mahasiswa/dashboard"
          class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors" @click="closeSidebar">
          <i class="fas fa-tachometer-alt text-xl"></i>
          <span class="ml-3" :class="{ hidden: isCollapsed && !isMobile }">Dashboard</span>
        </router-link>

        <div class="mt-2">
          <button
            class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            @click="handleDropdownClick(0)">
            <div class="flex items-center">
              <i class="fas fa-tools text-xl"></i>
              <span class="ml-3" :class="{ hidden: isCollapsed && !isMobile }">Alat</span>
            </div>
            <i class="fas" :class="[
              dropdownStates[0] ? 'fa-chevron-up' : 'fa-chevron-down',
              { hidden: isCollapsed && !isMobile },
            ]"></i>
          </button>

          <div v-if="dropdownStates[0]" class="pl-4 mt-1 space-y-1">
            <router-link to="/user/alat"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Informasi Alat</span>
            </router-link>
            <router-link to="/user/pinjamalat"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Pinjam</span>
            </router-link>
            <router-link to="/user/kembalikanalat"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Kembalikan</span>
            </router-link>
          </div>
        </div>

        <div class="mt-2">
          <button
            class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            @click="handleDropdownClick(1)">
            <div class="flex items-center">
              <i class="fas fa-shopping-cart text-xl"></i>
              <span class="ml-3" :class="{ hidden: isCollapsed && !isMobile }">BHP</span>
            </div>
            <i class="fas" :class="[
              dropdownStates[1] ? 'fa-chevron-up' : 'fa-chevron-down',
              { hidden: isCollapsed && !isMobile },
            ]"></i>
          </button>

          <div v-if="dropdownStates[1]" class="pl-4 mt-1 space-y-1">
            <router-link to="/user/bhp"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Informasi BHP</span>
            </router-link>
            <router-link to="/user/pakaibhp"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Pakai</span>
            </router-link>
          </div>
        </div>

        <div class="mt-2">
          <button
            class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            @click="handleDropdownClick(2)">
            <div class="flex items-center">
              <i class="fas fa-building text-xl"></i>
              <span class="ml-3" :class="{ hidden: isCollapsed && !isMobile }">Ruangan</span>
            </div>
            <i class="fas" :class="[
              dropdownStates[2] ? 'fa-chevron-up' : 'fa-chevron-down',
              { hidden: isCollapsed && !isMobile },
            ]"></i>
          </button>

          <div v-if="dropdownStates[2]" class="pl-4 mt-1 space-y-1">
            <router-link to="/mahasiswa/booking-mahasiswa"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Informasi Booking</span>
            </router-link>

            <router-link to="/mahasiswa/jadwal-mahasiswa"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Informasi Jadwal</span>
            </router-link>
            <router-link to="/mahasiswa/pinjam"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Pinjam Ruang</span>
            </router-link>
          </div>
        </div>
      </nav>
    </aside>

    <div v-if="!isCollapsed && isMobile" class="fixed inset-0 bg-black bg-opacity-50 z-30" @click="closeSidebar"></div>
  </div>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  ref,
  watch,
  onMounted,
  onUnmounted,
} from "vue";

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle-sidebar"]);

const isCollapsed = ref(props.isCollapsed);
const isMobile = ref(props.isMobile);
const dropdownStates = ref([]);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  emit("toggle-sidebar", isCollapsed.value);
};

const handleDropdownClick = (index) => {
  if (isCollapsed.value && !isMobile.value) {
    isCollapsed.value = false;
    emit("toggle-sidebar", isCollapsed.value);
  } else {
    dropdownStates.value[index] = !dropdownStates.value[index];
  }
};

const closeSidebar = () => {
  if (isMobile.value) {
    isCollapsed.value = true;
    emit("toggle-sidebar", isCollapsed.value);
  }
};

watch(
  () => props.isCollapsed,
  (newVal) => {
    isCollapsed.value = newVal;
    if (!newVal && !isMobile.value) {
      dropdownStates.value = [];
    }
  }
);

const handleResize = () => {
  isMobile.value = window.innerWidth <= 991.98;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
