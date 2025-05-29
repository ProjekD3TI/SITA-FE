<script setup>
import { ref, computed } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import LineChart from "@/components/Tugas-akhir/Dashboard/LineChart.vue";
import DoughnutChart from "@/components/Tugas-akhir/Dashboard/DoughnutChart.vue";
import SummaryCard from "@/components/Tugas-akhir/Dashboard/SummaryCard.vue";
import {useDashboard} from "@/services/TugasAkhir/Dosen/dashboard.js";
const { data, loading, error } = useDashboard();


function handleRowClick(item) {
  // aksi saat klik baris
  console.log(item);
}

// Summary cards data
const iconPaths = {
  requestPembimbing:
    "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  proposal:
    "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75",
  ujianTA:
    "M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12",
  book: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  calendar:
    "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z",
  graduation:
    "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
};

// Summary cards configuration
const TAdibimbing = computed(()=> data.value?.summary_card?.ta_yang_dibimbing ?? "0");
const UjianTerjadwal = computed(()=> data.value?.summary_card?.ujian_terjadwal ?? "0");
const RequestPembimbing = computed(() => data.value?.summary_card?.permintaan_bimbingan ?? "0");
const summaryCards = [
  {
    icon: iconPaths.book,
    iconColor: "danger",
    title: TAdibimbing,
    subtitle: "TA yang dibimbing",
  },
  {
    icon: iconPaths.calendar,
    iconColor: "success",
    title: UjianTerjadwal,
    subtitle: "Ujian Terjadwal",
  },
  {
    icon: iconPaths.graduation,
    iconColor: "warning",
    title: RequestPembimbing,
    subtitle: "Permintaan Bimbingan",
  },
];

// Data yang sama dengan yang dikirim ke DoughnutChart
const doughnutLabels = ["BAB I", "BAB II", "BAB III", "BAB IV", "BAB V"];
const doughnutData = computed(() => {
  const obj = data.value?.doughnat_chart ?? {};
  return [1,2,3,4,5].map(key => obj[key]??0);
});
const doughnutColors = ["#62B2FD", "#9BDFC4", "#F99BAB", "#FFB44F", "#9F97F7"];

const JadwalHariIni =computed(() => {
  return data.value?.ujian_hari_ini ?? [];
});
const PermintaanBimbingan =computed(() => {
  return data.value?.permintaan_bimbingan ?? [];
});
</script>
<template>
  <Breadcrumb :items="breadcrumbItems" />
  <div class="grid lg:grid-cols-3 gap-4 w-auto">
    <div class="card-style">
      <h5 class="body2-bold mb-4">Progress Bimbingan Mahasiswa</h5>
      <DoughnutChart
        class="w-44 h-44"
        :labels="doughnutLabels"
        datasetsLabel="Tugas Akhir Mahasiswa"
        :dataValues="doughnutData"
        :showCenterText="false"
        :showInsideText="false"
        :backgroundColor="doughnutColors"
      />
      <div class="flex flex-wrap gap-2 sm:gap-4 justify-center mt-2">
        <template v-for="(label, idx) in doughnutLabels" :key="idx">
          <p class="flex items-center gap-1 text-placeholder body5">
            <span
              class="w-2 h-2 inline-block rounded-full"
              :style="{ backgroundColor: doughnutColors[idx] }"
            ></span>
            {{ label }}
          </p>
        </template>
      </div>
    </div>
    <div
      class="lg:col-span-2 card-style p-4 flex sm:flex-row flex-col justify-evenly flex-grow"
    >
      <template v-for="(card, index) in summaryCards" :key="index">
        <!-- Card -->
        <SummaryCard
          :icon="card.icon"
          :iconColor="card.iconColor"
          :title="card.title || '-'"
          :subtitle="card.subtitle"
        />

        <!-- Divider (except after last card) -->
        <template v-if="index < summaryCards.length - 1">
          <div
            class="hidden sm:flex h-auto w-px my-8 bg-placeholder mx-4 self-stretch"
          ></div>
          <div
            class="sm:hidden max-w-[240px] w-10/12 h-px bg-placeholder mx-auto my-4"
          ></div>
        </template>
      </template>
    </div>
    <div class="lg:col-span-3 grid lg:grid-cols-2 gap-4">
      <div class="card-style">
        <div class="flex justify-between items-center mb-2">
          <h1 class="body1">Jadwal Ujian Hari ini</h1>
          <router-link
            to="/dosen/tugas-akhir/ujian-ta"
            title="Lihat Jadwal Ujian"
            aria-label="Navigasi ke halaman Ujian TA"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-[var(--secondary)] cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </router-link>
        </div>
        <table class="w-full text-left rtl:text-right">
          <thead class="body5-bold uppercase text-white bg-[var(--primary)]">
            <tr>
              <th scope="col" class="px-3 py-2 rounded-l-lg">NIM</th>
              <th scope="col" class="px-3 py-2">Sesi</th>
              <th scope="col" class="px-3 py-2 rounded-r-lg">Ruang</th>
            </tr>
          </thead>
          <tbody class="body5">
            <tr
              v-for="(item, index) in JadwalHariIni"
              :key="index"
              class="bg-white border-b rounded-l-lg hover:bg-gray-50 cursor-pointer transition-colors"
              @click="handleRowClick(item)"
              role="button"
              tabindex="0"
            >
              <td class="px-3 py-2">
                <div class="flex items-center gap-2">
                  <img
                    class="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                    :src="item.avatar"
                    alt=""
                  />
                  <span>{{ item.nama }}</span>
                </div>
              </td>
              <td class="px-3 py-2">
                {{ item.waktu }}
              </td>
              <td class="px-3 py-2">
                {{ item.ruang }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-style">
        <div class="flex justify-between items-center mb-2">
          <h1 class="body1">Permintaan Bimbingan</h1>
          <router-link
            to="/dosen/tugas-akhir/bimbingan"
            title="Lihat Permintaan Bimbingan"
            aria-label="Navigasi ke halaman Ujian TA"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-[var(--secondary)]"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </router-link>
        </div>
        <table class="w-full text-left rtl:text-right w-min-[350px]">
          <thead class="body5-bold uppercase text-white bg-[var(--primary)]">
            <tr>
              <th scope="col" class="px-3 py-2 rounded-l-lg">NIM</th>
              <th scope="col" class="px-3 py-2">Nama</th>
              <th scope="col" class="px-3 py-2 rounded-r-lg">Kategori</th>
            </tr>
          </thead>
          <tbody class="body5">
            <tr
              v-for="(item, index) in PermintaanBimbingan"
              :key="index"
              class="bg-white border-b rounded-l-lg hover:bg-gray-50 cursor-pointer transition-colors"
              @click="handleRowClick(item)"
              role="button"
              tabindex="0"
            >
              <td class="px-3 py-2">
                {{ item.nim }}
              </td>
              <td class="px-3 py-2 w-fit">
                <div class="flex items-center gap-2">
                  <img
                    class="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                    :src="item.avatar"
                    alt=""
                  />
                  <span>{{ item.nama }}</span>
                </div>
              </td>
              <td class="px-3 py-2">
                {{ item.kategori }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
