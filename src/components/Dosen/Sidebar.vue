<template>
  <div>
    <!-- Mobile menu button -->
    <button
      class="fixed top-2 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md text-gray-800 focus:outline-none"
      @click="toggleSidebar"
      v-if="isCollapsed && isMobile"
    >
      <i class="fas fa-bars text-xl text-blue-500"></i>
    </button>

    <!-- Sidebar -->
    <aside
      class="fixed left-0 top-0 h-screen bg-white border-r border-gray-300 transition-all duration-300 z-40"
      :class="{
        'w-64': !isCollapsed,
        'w-16': isCollapsed && !isMobile,
        'w-64 -translate-x-full': isCollapsed && isMobile,
      }"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between h-16 px-4 border-b border-gray-300"
      >
      <router-link
        :to="getDashboardRoute()"
        class="flex items-center"
        v-if="!isCollapsed || isMobile"
      >
        <img src="../../assets/images/d3ti-logo.png" alt="D3TI Logo" class="h-8 w-auto">
      </router-link>
        <button
          class="p-1 hover:bg-blue-50 rounded-md transition-colors"
          @click="toggleSidebar"
        >
          <i
            :class="[
              'fas',
              isCollapsed && !isMobile ? 'fa-chevron-right' : 'fa-chevron-left',
              'text-blue-500'
            ]"
          ></i>
        </button>
      </div>

      <!-- Sidebar content -->
      <nav class="flex flex-col p-2 overflow-y-auto h-[calc(100vh-4rem)]">
        <!-- Current Role Section -->
        <div
          v-if="(!isCollapsed || isMobile) && activeJabatan"
          class="bg-blue-50 p-3 rounded-md mb-3"
        >
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-sm font-semibold text-blue-500">Jabatan Saat Ini</h2>
            <span
              class="px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs font-medium"
            >
              {{ activeJabatan.name }}
            </span>
          </div>

          <div class="mt-2">
            <select
              v-model="selectedJabatan"
              class="w-full p-1.5 text-sm bg-white border border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-blue-500"
            >
              <option
                v-for="jabatan in availableJabatan"
                :key="jabatan.id"
                :value="jabatan.id"
              >
                {{ jabatan.name }}
                {{ jabatan.is_active ? "(Aktif)" : "" }}
              </option>
            </select>

            <button
              @click="handleSwitchJabatan"
              class="w-full mt-2 bg-blue-500 text-white py-1.5 px-3 rounded-md hover:bg-blue-400 transition-colors text-sm font-light"
            >
              Ganti Jabatan
            </button>
          </div>
        </div>

        <div
          v-if="isCollapsed && !isMobile && activeJabatan"
          class="flex justify-center mb-3 py-2"
          title="Jabatan Saat Ini: Klik untuk membuka"
          @click="toggleSidebar"
        >
          <i class="fas fa-id-badge text-xl text-blue-500"></i>
        </div>

        <!-- Dashboard Link -->
        <router-link
          :to="getDashboardRoute()"
          class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors mb-2"
          :class="{'bg-blue-500': isActiveRoute('dashboard'), 'text-white': isActiveRoute('dashboard'), 'text-gray-700': !isActiveRoute('dashboard')}"
          @click="closeSidebar"
        >
          <i class="fas fa-tachometer-alt text-xl" :class="{'text-white': isActiveRoute('dashboard'), 'text-gray-700': !isActiveRoute('dashboard')}"></i>
          <span class="ml-3 font-medium" :class="{ hidden: isCollapsed && !isMobile }">Dashboard</span>
        </router-link>

        <!-- Only show Alat dropdown if user is Kalab (not Dosen as Kalab) or regular Petugas (not Dosen as Petugas) -->
        <div class="mt-2" v-if="(hasAccess(['Kalab']) && !isDosenAsKalab) || (hasAccess(['Petugas']) && !isDosenAsStaff)">
          <button
            class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
            :class="{'bg-blue-500': isDropdownActive(['alat', 'pinjamalat', 'kembalikanalat']), 'text-white': isDropdownActive(['alat', 'pinjamalat', 'kembalikanalat']), 'text-gray-700': !isDropdownActive(['alat', 'pinjamalat', 'kembalikanalat'])}"
            @click="handleDropdownClick(0)"
          >
            <div class="flex items-center">
              <i class="fas fa-tools text-xl" :class="{'text-white': isDropdownActive(['alat', 'pinjamalat', 'kembalikanalat']), 'text-gray-700': !isDropdownActive(['alat', 'pinjamalat', 'kembalikanalat'])}"></i>
              <span class="ml-3 font-medium" :class="{ hidden: isCollapsed && !isMobile }">Alat</span>
            </div>
            <i
              class="fas"
              :class="[
                dropdownStates[0] ? 'fa-chevron-up' : 'fa-chevron-down',
                { hidden: isCollapsed && !isMobile },
                {'text-white': isDropdownActive(['alat', 'pinjamalat', 'kembalikanalat']), 'text-gray-700': !isDropdownActive(['alat', 'pinjamalat', 'kembalikanalat'])}
              ]"
            ></i>
          </button>

          <div v-if="dropdownStates[0]" class="pl-4 mt-1 space-y-1">
            <router-link
              :to="getRouteByJabatan('alat')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('alat'), 'text-white': isActiveRoute('alat'), 'text-gray-700': !isActiveRoute('alat')}"
              @click.native="closeSidebar"
            >
              <span>Informasi Alat</span>
            </router-link>
            <router-link
              :to="getRouteByJabatan('pinjamalat')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('pinjamalat'), 'text-white': isActiveRoute('pinjamalat'), 'text-gray-700': !isActiveRoute('pinjamalat')}"
              @click.native="closeSidebar"
            >
              <span>Pinjam</span>
            </router-link>
            <router-link
              :to="getRouteByJabatan('kembalikanalat')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('kembalikanalat'), 'text-white': isActiveRoute('kembalikanalat'), 'text-gray-700': !isActiveRoute('kembalikanalat')}"
              @click.native="closeSidebar"
            >
              <span>Kembalikan</span>
            </router-link>
          </div>
        </div>

        <!-- BHP Dropdown -->
        <div class="mt-2" v-if="hasAccess(['Dosen', 'Petugas']) && !isDosenAsStaff">
          <button
            class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
            :class="{'bg-blue-500': isDropdownActive(['bhp', 'pakaibhp']), 'text-white': isDropdownActive(['bhp', 'pakaibhp']), 'text-gray-700': !isDropdownActive(['bhp', 'pakaibhp'])}"
            @click="handleDropdownClick(1)"
          >
            <div class="flex items-center">
              <i class="fas fa-shopping-cart text-xl" :class="{'text-white': isDropdownActive(['bhp', 'pakaibhp']), 'text-gray-700': !isDropdownActive(['bhp', 'pakaibhp'])}"></i>
              <span class="ml-3 font-medium" :class="{ hidden: isCollapsed && !isMobile }">BHP</span>
            </div>
            <i
              class="fas"
              :class="[
                dropdownStates[1] ? 'fa-chevron-up' : 'fa-chevron-down',
                { hidden: isCollapsed && !isMobile },
                {'text-white': isDropdownActive(['bhp', 'pakaibhp']), 'text-gray-700': !isDropdownActive(['bhp', 'pakaibhp'])}
              ]"
            ></i>
          </button>

          <div v-if="dropdownStates[1]" class="pl-4 mt-1 space-y-1">
            <router-link
              :to="getRouteByJabatan('bhp')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('bhp'), 'text-white': isActiveRoute('bhp'), 'text-gray-700': !isActiveRoute('bhp')}"
              @click.native="closeSidebar"
            >
              <span>Informasi BHP</span>
            </router-link>
            <router-link
              :to="getRouteByJabatan('pakaibhp')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('pakaibhp'), 'text-white': isActiveRoute('pakaibhp'), 'text-gray-700': !isActiveRoute('pakaibhp')}"
              @click.native="closeSidebar"
            >
              <span>Pakai</span>
            </router-link>
          </div>

          <!-- Pelaporan Kejadian for Dosen role -->
          <button
            class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors mt-2"
            :class="{'bg-blue-500': isDropdownActive(['dashboardpkdosen', 'dashboardksdosen']), 'text-white': isDropdownActive(['dashboardpkdosen', 'dashboardksdosen']), 'text-gray-700': !isDropdownActive(['dashboardpkdosen', 'dashboardksdosen'])}"
            @click="handleDropdownClick(2)"
          >
            <div class="flex items-center">
              <i class="fas fa-exclamation-triangle text-xl" :class="{'text-white': isDropdownActive(['dashboardpkdosen', 'dashboardksdosen']), 'text-gray-700': !isDropdownActive(['dashboardpkdosen', 'dashboardksdosen'])}"></i>
              <span class="ml-3 font-medium" :class="{ hidden: isCollapsed && !isMobile }">Pelaporan Kejadian</span>
            </div>
            <i
              class="fas"
              :class="[
                dropdownStates[2] ? 'fa-chevron-up' : 'fa-chevron-down',
                { hidden: isCollapsed && !isMobile },
                {'text-white': isDropdownActive(['dashboardpkdosen', 'dashboardksdosen']), 'text-gray-700': !isDropdownActive(['dashboardpkdosen', 'dashboardksdosen'])}
              ]"
            ></i>
          </button>

          <div v-if="dropdownStates[2]" class="pl-4 mt-1 space-y-1">
            <router-link
              :to="getRouteByJabatan('dashboardpkdosen')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('dashboardpkdosen'), 'text-white': isActiveRoute('dashboardpkdosen'), 'text-gray-700': !isActiveRoute('dashboardpkdosen')}"
              @click.native="closeSidebar"
            >
              <span>Pelaporan Kejadian</span>
            </router-link>
            <router-link
              :to="getRouteByJabatan('dashboardksdosen')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('dashboardksdosen'), 'text-white': isActiveRoute('dashboardksdosen'), 'text-gray-700': !isActiveRoute('dashboardksdosen')}"
              @click.native="closeSidebar"
            >
              <span>Pelaporan Kekerasan Seksual</span>
            </router-link>
          </div>
        </div>

        <!-- Only show Ruangan dropdown if user is Kalab (not Dosen as Kalab) or regular Petugas (not Dosen as Petugas) -->
        <div class="mt-2" v-if="(hasAccess(['Kalab']) && !isDosenAsKalab) || (hasAccess(['Petugas']) && !isDosenAsStaff)">
          <button
            class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
            :class="{'bg-blue-500': isDropdownActive(['ruang', 'pinjamruang', 'kembalikanruang']), 'text-white': isDropdownActive(['ruang', 'pinjamruang', 'kembalikanruang']), 'text-gray-700': !isDropdownActive(['ruang', 'pinjamruang', 'kembalikanruang'])}"
            @click="handleDropdownClick(3)"
          >
            <div class="flex items-center">
              <i class="fas fa-building text-xl" :class="{'text-white': isDropdownActive(['ruang', 'pinjamruang', 'kembalikanruang']), 'text-gray-700': !isDropdownActive(['ruang', 'pinjamruang', 'kembalikanruang'])}"></i>
              <span class="ml-3 font-medium" :class="{ hidden: isCollapsed && !isMobile }">Ruangan</span>
            </div>
            <i
              class="fas"
              :class="[
                dropdownStates[3] ? 'fa-chevron-up' : 'fa-chevron-down',
                { hidden: isCollapsed && !isMobile },
                {'text-white': isDropdownActive(['ruang', 'pinjamruang', 'kembalikanruang']), 'text-gray-700': !isDropdownActive(['ruang', 'pinjamruang', 'kembalikanruang'])}
              ]"
            ></i>
          </button>

          <div v-if="dropdownStates[3]" class="pl-4 mt-1 space-y-1">
            <router-link
              :to="getRouteByJabatan('ruang')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('ruang'), 'text-white': isActiveRoute('ruang'), 'text-gray-700': !isActiveRoute('ruang')}"
              @click.native="closeSidebar"
            >
              <span>Informasi Ruang</span>
            </router-link>
            <router-link
              :to="getRouteByJabatan('pinjamruang')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('pinjamruang'), 'text-white': isActiveRoute('pinjamruang'), 'text-gray-700': !isActiveRoute('pinjamruang')}"
              @click.native="closeSidebar"
            >
              <span>Pinjam</span>
            </router-link>
            <router-link
              :to="getRouteByJabatan('kembalikanruang')"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('kembalikanruang'), 'text-white': isActiveRoute('kembalikanruang'), 'text-gray-700': !isActiveRoute('kembalikanruang')}"
              @click.native="closeSidebar"
            >
              <span>Kembalikan</span>
            </router-link>
          </div>
        </div>

        <!-- Kategori Laporan Kejadian -->
        <router-link
          :to="getRouteByJabatan('kategoripelaporan')"
          class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors mt-2"
          :class="{'bg-blue-500': isActiveRoute('kategoripelaporan'), 'text-white': isActiveRoute('kategoripelaporan'), 'text-gray-700': !isActiveRoute('kategoripelaporan')}"
          @click="closeSidebar"
          v-if="hasAccess(['Kalab']) || (hasAccess(['Petugas']) && !isDosenAsStaff)"
        >
          <i class="fas fa-list-alt text-xl" :class="{'text-white': isActiveRoute('kategoripelaporan'), 'text-gray-700': !isActiveRoute('kategoripelaporan')}"></i>
          <span class="ml-3 font-medium" :class="{ hidden: isCollapsed && !isMobile }">Kategori Laporan</span>
        </router-link>

        <!-- Pelaporan Kejadian for Kalab & Petugas -->
        <router-link
          :to="getRouteByJabatan('pelaporankejadiankalab')"
          class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors mt-2"
          :class="{'bg-blue-500': isActiveRoute('pelaporankejadiankalab'), 'text-white': isActiveRoute('pelaporankejadiankalab'), 'text-gray-700': !isActiveRoute('pelaporankejadiankalab')}"
          @click="closeSidebar"
          v-if="hasAccess(['Kalab']) || (hasAccess(['Petugas']) && !isDosenAsStaff)"
        >
          <i class="fas fa-exclamation-circle text-xl" :class="{'text-white': isActiveRoute('pelaporankejadiankalab'), 'text-gray-700': !isActiveRoute('pelaporankejadiankalab')}"></i>
          <span class="ml-3 font-medium" :class="{ hidden: isCollapsed && !isMobile }">Pelaporan Kejadian</span>
        </router-link>

        <!-- Separate Pelaporan Kekerasan Seksual links for Kalab and Petugas -->
        <!-- For Petugas -->
        <router-link
          :to="{ name: 'PelaporanKekerasanSeksualPetugas' }"
          class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors mt-2"
          :class="{'bg-blue-500': isActiveRoute('pelaporankekerasanseksualpetugas'), 'text-white': isActiveRoute('pelaporankekerasanseksualpetugas'), 'text-gray-700': !isActiveRoute('pelaporankekerasanseksualpetugas')}"
          @click="closeSidebar"
          v-if="hasAccess(['Petugas'])"
        >
          <i class="fas fa-shield-alt text-xl" :class="{'text-white': isActiveRoute('pelaporankekerasanseksualpetugas'), 'text-gray-700': !isActiveRoute('pelaporankekerasanseksualpetugas')}"></i>
          <span class="ml-3 font-medium" :class="{ hidden: isCollapsed && !isMobile }">Pelaporan KS</span>
        </router-link>
        
        <!-- Kaprodi Section -->
        <div class="mt-2" v-if="hasAccess(['Kaprodi'])">
          <button
            class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
            :class="{'bg-blue-500': isKaprodiActive, 'text-white': isKaprodiActive, 'text-gray-700': !isKaprodiActive}"
            @click="handleDropdownClick(6)"
          >
            <div class="flex items-center">
              <i class="fas fa-graduation-cap text-xl" :class="{'text-white': isKaprodiActive, 'text-gray-700': !isKaprodiActive}"></i>
              <span class="ml-3 font-medium" :class="{ hidden: isCollapsed && !isMobile }">Kaprodi</span>
            </div>
            <i
              class="fas"
              :class="[
                dropdownStates[6] ? 'fa-chevron-up' : 'fa-chevron-down',
                { hidden: isCollapsed && !isMobile },
                {'text-white': isKaprodiActive, 'text-gray-700': !isKaprodiActive}
              ]"
            ></i>
          </button>

          <div v-if="dropdownStates[6]" class="pl-4 mt-1 space-y-1">
            <router-link
              to="/kaprodi/laporan"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('kaprodi/laporan'), 'text-white': isActiveRoute('kaprodi/laporan'), 'text-gray-700': !isActiveRoute('kaprodi/laporan')}"
              @click.native="closeSidebar"
            >
              <span>Laporan</span>
            </router-link>
            <router-link
              to="/kaprodi/pengajuan"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('kaprodi/pengajuan'), 'text-white': isActiveRoute('kaprodi/pengajuan'), 'text-gray-700': !isActiveRoute('kaprodi/pengajuan')}"
              @click.native="closeSidebar"
            >
              <span>Pengajuan</span>
            </router-link>
          </div>
        </div>

        <!-- Only show Petugas dropdown if the user is a regular Petugas (not Dosen as Petugas) -->
        <div class="mt-2" v-if="hasAccess(['Petugas']) && !isDosenAsStaff">
          <button
            class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
            :class="{'bg-blue-500': isPetugasActive, 'text-white': isPetugasActive, 'text-gray-700': !isPetugasActive}"
            @click="handleDropdownClick(7)"
          >
            <div class="flex items-center">
              <i class="fas fa-clipboard-list text-xl" :class="{'text-white': isPetugasActive, 'text-gray-700': !isPetugasActive}"></i>
              <span class="ml-3 font-medium" :class="{ hidden: isCollapsed && !isMobile }">Petugas</span>
            </div>
            <i
              class="fas"
              :class="[
                dropdownStates[7] ? 'fa-chevron-up' : 'fa-chevron-down',
                { hidden: isCollapsed && !isMobile },
                {'text-white': isPetugasActive, 'text-gray-700': !isPetugasActive}
              ]"
            ></i>
          </button>

          <div v-if="dropdownStates[7]" class="pl-4 mt-1 space-y-1">
            <router-link
              to="/petugas/inventaris"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('petugas/inventaris'), 'text-white': isActiveRoute('petugas/inventaris'), 'text-gray-700': !isActiveRoute('petugas/inventaris')}"
              @click.native="closeSidebar"
            >
              <span>Inventaris</span>
            </router-link>
            <router-link
              to="/petugas/pemeliharaan"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('petugas/pemeliharaan'), 'text-white': isActiveRoute('petugas/pemeliharaan'), 'text-gray-700': !isActiveRoute('petugas/pemeliharaan')}"
              @click.native="closeSidebar"
            >
              <span>Pemeliharaan</span>
            </router-link>
            <router-link
              to="/petugas/pengadaan"
              class="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              :class="{'bg-blue-500': isActiveRoute('petugas/pengadaan'), 'text-white': isActiveRoute('petugas/pengadaan'), 'text-gray-700': !isActiveRoute('petugas/pengadaan')}"
              @click.native="closeSidebar"
            >
              <span>Pengadaan</span>
            </router-link>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Backdrop for mobile menu -->
    <div
      v-if="!isCollapsed && isMobile"
      class="fixed inset-0 bg-black bg-opacity-50 z-30"
      @click="closeSidebar"
    ></div>
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
import { useRouter, useRoute } from "vue-router";

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
const route = useRoute();

const { currentJabatan, availableJabatan, switchJabatan, getUserJabatan } =
  authDosen();
const selectedJabatan = ref(null);

const activeJabatan = computed(() => {
  return (
    availableJabatan.value?.find((j) => j.is_active) || currentJabatan.value
  );
});

// Compute whether the user is a Dosen acting as Petugas
const isDosenAsStaff = computed(() => {
  // Check if user has Dosen role and is currently in Petugas role
  const hasDosenRole = availableJabatan.value?.some(j => j.name === "Dosen");
  return hasDosenRole && activeJabatan.value?.name === "Petugas";
});

// Compute whether the user is a Dosen acting as Kalab
const isDosenAsKalab = computed(() => {
  // Check if user has Dosen role and is currently in Kalab role
  const hasDosenRole = availableJabatan.value?.some(j => j.name === "Dosen");
  return hasDosenRole && activeJabatan.value?.name === "Kalab";
});

// Check if any routes in the provided array are active
const isDropdownActive = (routes) => {
  return routes.some(r => isActiveRoute(r));
};

// Check for Kaprodi section active
const isKaprodiActive = computed(() => {
  return isActiveRoute('kaprodi');
});

// Check for Petugas section active
const isPetugasActive = computed(() => {
  return isActiveRoute('petugas/inventaris') || isActiveRoute('petugas/pemeliharaan') || isActiveRoute('petugas/pengadaan');
});

const isActiveRoute = (routeName) => {
  return route.path.includes(routeName);
};

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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.bg-blue-50 {
  background-color: #CFE9FD;
}

.text-blue-500 {
  color: #56B3F7;
}

.bg-blue-500 {
  background-color: #00A2EA;
}

.border-blue-500 {
  border-color: #00A2EA;
}

.hover\:bg-blue-50:hover {
  background-color: #CFE9FD;
}

.hover\:bg-blue-500:hover {
  background-color: #00A2EA;
}

.hover\:bg-blue-400:hover {
  background-color: #56B3F7;
}

.border-gray-300 {
  border-color: #BBBBBB;
}

.text-gray-700 {
  color: #303030;
}

.fas {
  font-family: 'Font Awesome 5 Free' !important;
  font-weight: 900 !important;
}
</style>