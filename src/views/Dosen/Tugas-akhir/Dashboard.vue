<script setup>
import { ref, computed } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import ModalResponBimbingan from "@/components/Tugas-akhir/Modals/ModalResponBimbingan.vue";
import LineChart from "@/components/Tugas-akhir/Dashboard/LineChart.vue";
import DoughnutChart from "@/components/Tugas-akhir/Dashboard/DoughnutChart.vue";
import SummaryCard from "@/components/Tugas-akhir/Dashboard/SummaryCard.vue";
import { useDashboard } from "@/services/TugasAkhir/Dosen/dashboard.js";
import { useRequestPembimbing } from "@/services/TugasAkhir/Dosen/bimbingan.js";
import Loading from "@/components/Loading.vue";
import { RouterLink, useRouter } from "vue-router";
const router = useRouter();
const { data, loading: loadingDashboard, error, fetchData } = useDashboard();

// Set up the useRequestPembimbing hook
const { updateApproval } = useRequestPembimbing();

// Add necessary refs for the modal
const modalRef = ref(null);
const selectedItem = ref(null);
const modalTitle = ref("Respon Permintaan Bimbingan");
const modalContent = ref("");

// Function to show the modal when clicking Respon button
const showResponModal = (item) => {
  selectedItem.value = item;
  modalContent.value = `Respon permintaan ${item.nama} sebagai mahasiswa bimbingan anda.`;
  modalRef.value.open();
};

// Functions to handle accept and reject actions
const handleAcceptRequest = async () => {
  try {
    await updateApproval(selectedItem.value.id, 1);
    // Proper refresh of dashboard data
    await fetchData();
    modalRef.value.close();
  } catch (err) {
    console.error("Error saat menerima permintaan:", err);
  }
};

const handleRejectRequest = async () => {
  try {
    await updateApproval(selectedItem.value.id, 2);
    // Proper refresh of dashboard data
    await fetchData();
    modalRef.value.close();
  } catch (err) {
    console.error("Error saat menolak permintaan:", err);
  }
};

function handleRowClick(item) {
  // aksi saat klik baris
  console.log(item);
}

const tableHeaders = ["NIM", "NAMA", "Sesi", "Ruang"];

// Update your navigateToDetail function to log data and handle missing IDs
const navigateToDetail = (item) => {
  router.push({
    name: "DetailUjianTAforDosen",
    params: { tugas_akhir_id: item.tugas_akhir_id },
  });
};

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
const TAdibimbing = computed(
  () => data.value?.summary_card?.ta_yang_dibimbing ?? "0"
);
const UjianTerjadwal = computed(
  () => data.value?.summary_card?.ujian_terjadwal ?? "0"
);
const RequestPembimbing = computed(
  () => data.value?.summary_card?.permintaan_bimbingan ?? "0"
);
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
  return [1, 2, 3, 4, 5].map((key) => obj[key] ?? 0);
});
const doughnutColors = ["#62B2FD", "#9BDFC4", "#F99BAB", "#FFB44F", "#9F97F7"];

const JadwalHariIni = computed(() => {
  return data.value?.ujian_hari_ini ?? [];
});
const PermintaanBimbingan = computed(() => {
  return data.value?.permintaan_bimbingan ?? [];
});
</script>
<template>
  <div
    v-if="loadingDashboard"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>
  <div v-else class="px-2 sm:px-0">
    <Breadcrumb />
    <div class="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <!-- Summary Cards -->
      <template v-for="(card, index) in summaryCards" :key="index">
        <div
          class="p-3 bg-white card-rounded lg:p-6 shadow-custom min-w-[120px] sm:min-w-[170px] flex items-center"
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
    <div
      class="flex flex-col lg:flex-row flex-wrap gap-3 sm:gap-4 mt-3 sm:mt-4"
    >
      <!-- Doughnut Card -->
      <div
        class="card-rounded bg-white p-3 sm:p-4 pb-6 sm:pb-8 lg:p-6 w-full lg:w-auto lg:flex-1 min-w-[250px] sm:min-w-[320px] shadow-custom"
      >
        <h5 class="body2-bold mb-3 sm:mb-4 text-center sm:text-left">
          Progress Bimbingan Mahasiswa
        </h5>
        <div class="flex justify-center">
          <DoughnutChart
            class="w-36 h-36 sm:w-44 sm:h-44"
            :labels="doughnutLabels"
            datasetsLabel="Tugas Akhir Mahasiswa"
            :dataValues="doughnutData"
            :showCenterText="false"
            :showInsideText="false"
            :backgroundColor="doughnutColors"
          />
        </div>
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

      <!-- Jadwal Ujian Card -->
      <div
        class="flex-grow p-3 sm:p-4 lg:p-6 bg-white card-rounded shadow-custom w-full lg:w-auto"
      >
        <div class="flex justify-between items-center mb-2">
          <h1 class="body2-bold">Jadwal Ujian Hari ini</h1>
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
              class="w-5 h-5 sm:w-6 sm:h-6 text-[var(--secondary)] cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </router-link>
        </div>

        <div class="overflow-x-auto">
          <Table
            :headers="tableHeaders"
            :items="JadwalHariIni"
            :showPagination="false"
            @rowClick="navigateToDetail"
            min-width="min-w-[400px]"
          >
            <template #row="{ item }">
              <td class="px-3 py-2 whitespace-nowrap rounded-l-lg">
                {{ item.nim }}
              </td>
              <td class="px-3 py-2">
                {{ item.nama }}
              </td>
              <td class="px-3 py-2">
                {{ item.waktu }}
              </td>
              <td class="px-3 py-2 rounded-r-lg">
                {{ item.ruang }}
              </td>
            </template>
            <template #empty>
              <tr>
                <td colspan="4">
                  <div class="text-center text-placeholder py-6 sm:py-8">
                    Tidak ada data
                  </div>
                </td>
              </tr>
            </template>
          </Table>
        </div>
      </div>

      <!-- Permintaan Bimbingan Card -->
      <div
        class="flex-grow p-3 sm:p-4 lg:p-6 bg-white card-rounded shadow-custom w-full lg:w-auto"
      >
        <div class="flex justify-between items-center mb-2">
          <h1 class="body2-bold">Permintaan Bimbingan</h1>
          <router-link
            to="/dosen/tugas-akhir/bimbingan"
            title="Lihat Permintaan Bimbingan"
            aria-label="Navigasi ke halaman Bimbingan"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 sm:w-6 sm:h-6 text-[var(--secondary)]"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <tbody class="body5">
              <template v-if="PermintaanBimbingan.length">
                <tr
                  v-for="(item, index) in PermintaanBimbingan"
                  :key="index"
                  class="border-b hover:bg-gray-50 transition"
                  role="button"
                  tabindex="0"
                >
                  <td class="p-2 sm:p-3">
                    <div class="body5-bold sm:body4-bold">
                      {{ item.nama }}
                      <span class="block sm:inline">| {{ item.nim }}</span>
                    </div>
                    <div class="body6 sm:body5">{{ item.kategori }}</div>
                  </td>
                  <td class="p-2 sm:p-3 text-right align-middle">
                    <div class="flex justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        class="sm:hidden"
                        @click.stop="showResponModal(item)"
                        >Respon</Button
                      >
                      <Button
                        variant="secondary"
                        size="md"
                        class="hidden sm:inline-flex"
                        @click.stop="showResponModal(item)"
                        >Respon</Button
                      >
                    </div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="2">
                    <div class="text-center text-placeholder py-6 sm:py-8">
                      Tidak ada permintaan
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal Respon Bimbingan -->
  <ModalResponBimbingan
    ref="modalRef"
    :title="modalTitle"
    :content="modalContent"
    @accept="handleAcceptRequest"
    @reject="handleRejectRequest"
  />
</template>

<style scoped>
/* Add responsive styles */
@media (max-width: 640px) {
  .overflow-x-auto {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  /* Additional mobile styles can be added here */
}
</style>
