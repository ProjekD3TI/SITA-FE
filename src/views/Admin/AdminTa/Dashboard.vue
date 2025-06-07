<script setup>
import { ref, onMounted, watch, computed } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import SummaryCard from "@/components/Tugas-akhir/Dashboard/SummaryCard.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import DefaultAvatar from "@/assets/images/Profile Avatar.svg";
import router from "@/router";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import DoughnutChart from "@/components/Tugas-akhir/Dashboard/DoughnutChart.vue";
import BarChart from "@/components/Tugas-akhir/Dashboard/BarChart.vue";
import { useDashboard } from "@/services/TugasAkhir/Admin/dashboard.js";
const { data, loading, error } = useDashboard();

const proposalValid = computed(
  () => data.value?.validasi_berkas?.proposal?.valid ?? 0
);
const proposalMenunggu = computed(
  () => data.value?.validasi_berkas?.proposal?.menunggu ?? 0
);
const ujianValid = computed(
  () => data.value?.validasi_berkas?.ujian_tugas_akhir?.valid ?? 0
);
const ujianMenunggu = computed(
  () => data.value?.validasi_berkas?.ujian_tugas_akhir?.menunggu ?? 0
);

const ActiveTA = computed(
  () => data.value?.summary_card?.tugas_akhir_aktif ?? 0
);
const ScheduledUjian = computed(
  () => data.value?.summary_card?.ujian_terjadwal ?? 0
);
const TotalMahasiswaAktif = computed(() => data.value?.mahasiswa_akses_ta ?? 0);
const TotalDosenAktif = computed(() => data.value?.dosen_akses_ta ?? 0);

// Icon paths
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
const summaryCards = computed(() => [
  {
    icon: iconPaths.book,
    iconColor: "danger",
    title: ActiveTA.value,
    subtitle: "Tugas Akhir Aktif",
  },
  {
    icon: iconPaths.calendar,
    iconColor: "success",
    title: ScheduledUjian.value,
    subtitle: "Ujian Terjadwal",
  },
  {
    icon: iconPaths.graduation,
    iconColor: "warning",
    title: TotalMahasiswaAktif.value,
    subtitle: "Mahasiswa Terdaftar",
  },
  {
    icon: iconPaths.graduation,
    iconColor: "primary",
    title: TotalDosenAktif.value,
    subtitle: "Dosen Aktif",
  },
]);

// Data dummy

const filteredTugasAkhir = computed(
  () => data.value?.tabel_validasi_berkas_ujian ?? []
);
const filteredPlottingProposal = computed(
  () => data.value?.tabel_validasi_berkas_sempro ?? []
);
const handleRowClickProposal = (item) => {
  router.push({
    name: "DetailPengajuanForAdmin",
    params: { proposal_id: item.proposal_id },
  });
  console.log("Row clicked:", item);
};
const handleRowClickUjianTA = (item) => {
  router.push({
    name: "DetailPendaftarForAdmin",
    params: { tugas_akhir_id: item.tugas_akhir_id },
  });
};

import "vue3-carousel/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { Navigation as CarouselNavigation } from "vue3-carousel";
import { Pagination as CarouselPagination } from "vue3-carousel";
const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
  autoplay: 5000,
  pauseAutoplayOnHover: true,
};

const BarChartData = ref({
  labels: [
    "Sistem Informasi",
    "Internet Of Things",
    "Game Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
  ],
  datasetsLabel: ["2023", "2024", "2025"],
  datasetsBgColor: ["#f87979", "#36a2eb", "#4bc0c0"],
  datasetsData: [
    [40, 20, 12, 30, 25, 18],
    [35, 25, 18, 28, 30, 22],
    [12, 22, 32, 18, 20, 25],
  ],
});

watch(data, (val) => {
  // console.log("API dashboard:", val);
});
</script>
<template>
  <div v-if="loading" class="flex items-center justify-center min-h-[80dvh]">
    <Loading />
  </div>

  <div v-else-if="error" class="p-4">
    <ErrorMsg :message="error" />
  </div>
  <div v-else>
    <Breadcrumb />
    <!-- Status card & Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Summary Cards -->

      <template v-for="(card, index) in summaryCards" :key="index">
        <div
          class="p-4 bg-white card-rounded lg:p-6 shadow-custom min-w-[170px] flex items-center"
        >
          <!-- Card -->
          <SummaryCard
            :icon="card.icon"
            :iconColor="card.iconColor"
            :title="card.title || '-'"
            :subtitle="card.subtitle"
          />
        </div>
      </template>
    </div>
    <div class="flex flex-wrap gap-4 mt-4">
      <!-- Doughnut Card -->
      <div
        class="card-rounded bg-white p-4 pb-8 lg:p-6 flex-1 min-w-[320px] shadow-custom"
      >
        <h5 class="mb-4 text-blackText body3-bold">Validasi Berkas</h5>
        <Carousel v-bind="carouselConfig">
          <Slide>
            <div>
              <DoughnutChart
                class="w-40 h-40 mb-4"
                :labels="['Menunggu', 'Diterima']"
                :dataValues="[proposalMenunggu, proposalValid]"
                :centerTextValue="[
                  proposalValid,
                  proposalValid + proposalMenunggu,
                ]"
                insideText="Proposal"
              />
            </div>
          </Slide>
          <Slide>
            <div>
              <DoughnutChart
                class="w-40 h-40 mb-4"
                :labels="['Menunggu', 'Diterima']"
                :dataValues="[ujianMenunggu, ujianValid]"
                :centerTextValue="[ujianValid, ujianMenunggu + ujianValid]"
                insideText="Ujian TA"
              />
            </div>
          </Slide>
          <template #addons>
            <CarouselPagination />
          </template>
        </Carousel>
      </div>
      <div class="flex-grow p-4 bg-white card-rounded lg:p-6 shadow-custom">
        <div class="flex items-center justify-between mb-4">
          <h5 class="body3-bold text-blackText">
            Validasi Berkas Seminar Proposal
          </h5>
          <router-link class="text-secondary" to="tugas-akhir/proposal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </router-link>
        </div>
        <div v-if="filteredPlottingProposal.length">
          <div
            v-for="item in filteredPlottingProposal"
            :key="item.nim"
            class="flex items-center gap-4 rounded"
          >
            <button
              @click="handleRowClickProposal(item)"
              class="flex items-center w-full gap-2 p-2 border-b rounded-sm hover:bg-gray-100"
            >
              <img :src="DefaultAvatar" alt="" class="w-10 h-10" />
              <div class="flex flex-col">
                <p class="text-left body5 text-blackText">{{ item.nim }}</p>
                <p class="body4 text-blackText">{{ item.mahasiswa }}</p>
              </div>
            </button>
          </div>
        </div>
        <div v-else class="py-4 mx-auto text-center text-gray-400 body4">
          Tidak ada data.
        </div>
      </div>
      <div class="flex-grow p-4 bg-white card-rounded lg:p-6 shadow-custom">
        <div class="flex items-center justify-between mb-2">
          <h5 class="body3-bold text-blackText">
            Validasi Berkas Ujian Tugas Akhir
          </h5>
          <router-link
            class="text-secondary"
            :to="{ name: 'UjianTAforAdmin', query: { tab: 'tab2' } }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </router-link>
        </div>
        <div v-if="filteredTugasAkhir.length">
          <div
            v-for="item in filteredTugasAkhir"
            :key="item.nim"
            class="flex items-center gap-4 rounded"
          >
            <button
              @click="handleRowClickUjianTA(item)"
              class="flex items-center w-full gap-2 p-2 border-b rounded-sm hover:bg-gray-100"
            >
              <img :src="DefaultAvatar" alt="" class="w-10 h-10" />
              <div class="flex flex-col">
                <p class="text-left body5 text-blackText">{{ item.nim }}</p>
                <p class="body4 text-blackText">{{ item.mahasiswa }}</p>
              </div>
            </button>
          </div>
        </div>
        <div v-else class="py-4 mx-auto text-center text-gray-400 body4">
          Tidak ada data.
        </div>
      </div>
    </div>

    <div class="p-4 mt-4 bg-white card-rounded lg:p-8 h-96 shadow-custom">
      <BarChart
        :labels="BarChartData.labels"
        :datasets-label="BarChartData.datasetsLabel"
        :datasets-bg-color="BarChartData.datasetsBgColor"
        :datasets-data="BarChartData.datasetsData"
      />
    </div>
  </div>
</template>
<style scoped>
.carousel {
  --vc-pgn-border-radius: 7px;
  --vc-pgn-height: 7px;
  --vc-pgn-width: 7px;
  --vc-png-bottom: -15px;
}
</style>
