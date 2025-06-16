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
        <router-link :to="getDashboardRoute()" class="font-bold text-xl truncate" v-if="!isCollapsed || isMobile">
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
        <div v-if="(!isCollapsed || isMobile) && activeJabatan" class="bg-indigo-700 p-3 rounded-md mb-3">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-sm font-semibold">Jabatan Saat Ini</h2>
            <span class="px-2 py-0.5 bg-indigo-500 text-white rounded-full text-xs font-medium">
              {{ activeJabatan.name }}
            </span>
          </div>

          <div class="mt-2">
            <select v-model="selectedJabatan"
              class="w-full p-1.5 text-sm bg-indigo-800 border border-indigo-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white">
              <option v-for="jabatan in availableJabatan" :key="jabatan.id" :value="jabatan.id">
                {{ jabatan.name }}
                {{ jabatan.is_active ? "(Aktif)" : "" }}
              </option>
            </select>

            <button @click="handleSwitchJabatan"
              class="w-full mt-2 bg-indigo-500 text-white py-1.5 px-3 rounded-md hover:bg-indigo-400 transition-colors text-sm">
              Ganti Jabatan
            </button>
          </div>
        </div>

        <div v-if="isCollapsed && !isMobile && activeJabatan" class="flex justify-center mb-3 py-2"
          title="Jabatan Saat Ini: Klik untuk membuka" @click="toggleSidebar">
          <i class="fas fa-id-badge text-xl"></i>
        </div>

        <router-link :to="getDashboardRoute()"
          class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors" @click="closeSidebar">
          <i class="fas fa-tachometer-alt text-xl"></i>
          <span class="ml-3" :class="{ hidden: isCollapsed && !isMobile }">Dashboard</span>
        </router-link>

        <div class="mt-2" v-if="hasAccess(['Kalab', 'Petugas'])">
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
            <router-link :to="getRouteByJabatan('alat')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Informasi Alat</span>
            </router-link>
            <router-link :to="getRouteByJabatan('pinjamalat')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Pinjam</span>
            </router-link>
            <router-link :to="getRouteByJabatan('kembalikanalat')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Kembalikan</span>
            </router-link>
          </div>
        </div>

        <div class="mt-2" v-if="hasAccess(['Dosen', 'Petugas'])">
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
            <router-link :to="getRouteByJabatan('bhp')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Informasi BHP</span>
            </router-link>
            <router-link :to="getRouteByJabatan('pakaibhp')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Pakai</span>
            </router-link>
          </div>
        </div>

        <div class="mt-2" v-if="hasAccess(['Kalab', 'Petugas'])">
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
            <router-link :to="getRouteByJabatan('ruang')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Informasi Ruang</span>
            </router-link>
            <router-link :to="getRouteByJabatan('list-peminjaman')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Pinjam</span>
            </router-link>
            <router-link :to="getRouteByJabatan('kembalikanruang')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Kembalikan</span>
            </router-link>
          </div>
        </div>

        <div class="mt-2" v-if="hasAccess(['Kaprodi'])">
          <button
            class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            @click="handleDropdownClick(3)">
            <div class="flex items-center">
              <i class="fas fa-graduation-cap text-xl"></i>
              <span class="ml-3" :class="{ hidden: isCollapsed && !isMobile }">Kaprodi</span>
            </div>
            <i class="fas" :class="[
                dropdownStates[3] ? 'fa-chevron-up' : 'fa-chevron-down',
                { hidden: isCollapsed && !isMobile },
              ]"></i>
          </button>

          <div v-if="dropdownStates[3]" class="pl-4 mt-1 space-y-1">
            <router-link to="/kaprodi/laporan"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Laporan</span>
            </router-link>
            <router-link to="/kaprodi/pengajuan"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Pengajuan</span>
            </router-link>
          </div>
        </div>

        <div class="mt-2" v-if="hasAccess(['Petugas'])">
          <button
            class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            @click="handleDropdownClick(4)">
            <div class="flex items-center">
              <i class="fas fa-clipboard-list text-xl"></i>
              <span class="ml-3" :class="{ hidden: isCollapsed && !isMobile }">Petugas</span>
            </div>
            <i class="fas" :class="[
                dropdownStates[4] ? 'fa-chevron-up' : 'fa-chevron-down',
                { hidden: isCollapsed && !isMobile },
              ]"></i>
          </button>

          <div v-if="dropdownStates[4]" class="pl-4 mt-1 space-y-1">
            <router-link to="/petugas/inventaris"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Inventaris</span>
            </router-link>
            <router-link to="/petugas/pemeliharaan"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Pemeliharaan</span>
            </router-link>
            <router-link to="/petugas/pengadaan"
              class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              @click.native="closeSidebar">
              <span>Pengadaan</span>
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
  computed,
  inject,
} from "vue";
import { authDosen } from "../../services/authDosen";
import { useRouter } from "vue-router";

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
const router = useRouter();

const { currentJabatan, availableJabatan, switchJabatan, getUserJabatan } =
  authDosen();
const selectedJabatan = ref(null);

const activeJabatan = computed(() => {
  return (
    availableJabatan.value?.find((j) => j.is_active) || currentJabatan.value
  );
});

const handleSwitchJabatan = async () => {
  if (!selectedJabatan.value) return;

  const targetJabatan = availableJabatan.value?.find(
    (j) => j.id === selectedJabatan.value
  );

  if (!targetJabatan) return;

  await switchJabatan(selectedJabatan.value);
};

watch(
  () => activeJabatan.value,
  (newActive) => {
    if (newActive) {
      selectedJabatan.value = newActive.id;
    }
  },
  { immediate: true }
);

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

const hasAccess = (allowedRoles) => {
  if (!activeJabatan.value) return false;
  return allowedRoles.includes(activeJabatan.value.name);
};

const getDashboardRoute = () => {
  if (!activeJabatan.value) return { name: "DashboardDosen" };

  switch (activeJabatan.value.name) {
    case "Dosen":
      return { name: "DashboardDosen" };
    case "Kalab":
      return { name: "DashboardKalab" };
    case "Kaprodi":
      return { name: "DashboardKaprodi" };
    case "Petugas":
      return { name: "DashboardPetugas" };
    default:
      return { name: "DashboardDosen" };
  }
};

const getRouteByJabatan = (routeName) => {
  if (!activeJabatan.value) return "/dosen/" + routeName;

  const baseRoute = activeJabatan.value.name.toLowerCase();
  return `/${baseRoute}/${routeName}`;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
  getUserJabatan();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
