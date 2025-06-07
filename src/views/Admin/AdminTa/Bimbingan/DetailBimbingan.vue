<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import ProgressBarBAB from "@/components/Tugas-akhir/ProgressBarBAB.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import StatusLabel from "@/components/Tugas-akhir/Label.vue";
import UserData from "@/components/Tugas-akhir/UserData.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import Tooltip from "@/components/Tugas-akhir/Tooltip.vue";
import ModalDetailBimbingan from "@/components/Tugas-akhir/Modals/ModalDetailBimbingan.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useRoute } from "vue-router";
import { useShowBimbingan } from "@/services/TugasAkhir/Admin/bimbingan.js";
const {
  dataShowBimbingan,
  fetchData,
  loadingShowBimbingan,
  errorShowBimbingan,
  paginationShowBimbingan,
} = useShowBimbingan();

const route = useRoute();
const currentPageNum = ref(1);

// Fungsi untuk fetch data dengan parameter yang benar
const loadData = () => {
  if (route.params.tugas_akhir_id) {
    fetchData(route.params.tugas_akhir_id, currentPageNum.value);
  }
};

onMounted(loadData);

// Watch hanya untuk perubahan halaman setelah mounted
watch(currentPageNum, (newPage, oldPage) => {
  // Hanya fetch jika page benar-benar berubah dan bukan initial load
  if (newPage !== oldPage && oldPage !== undefined) {
    loadData();
  }
});

const dinilai = computed(() => {
  return dataShowBimbingan.value?.nilai_bimbingan?.nilai_bimbingan_id;
});
const modalDetailRef = ref(null);
const showNilaiModal = ref(false);
const showBimbinganModal = ref(false);
const selectedBimbingan = ref(null);

const listBimbingan = computed(() => {
  // Data dari API ada di dataTabelBimbingan.value.data
  return Array.isArray(dataShowBimbingan.value?.bimbingan)
    ? dataShowBimbingan.value?.bimbingan
    : [];
});

// Format tanggal dari YYYY-MM-DD menjadi DD MMM YYYY
function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
// Mendapatkan kelas CSS untuk status
function getStatusClass(status) {
  if (status === 1) return "success";
  if (status === 0) return "warning";
  return "danger";
}

// Mendapatkan label untuk status
function getStatusLabel(status) {
  if (status === 1) return "Diterima";
  if (status === 0) return "Menunggu";
  return "Ditolak";
}
// Bab tertinggi yang sudah diterima
const highestChapter = computed(() => {
  return dataShowBimbingan.value?.bab_tertinggi || 0;
});

const buttonClasses = computed(() => {
  return dinilai.value ? "opacity-100" : "opacity-50";
});
const handleRowClick = (item) => {
  selectedBimbingan.value = item;
  showBimbinganModal.value = true;
  nextTick(() => {
    modalDetailRef.value?.open();
  });
};
function toRoman(num) {
  const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return romans[num - 1] || num;
}
const closeDetailModal = () => {
  showBimbinganModal.value = false;
  selectedBimbingan.value = null;
};

// Ganti listBimbingan dengan numberedBimbingan yang sudah include nomor urut
const numberedBimbingan = computed(() => {
  const currentPage = Number(currentPageNum.value) || 1;
  const perPage = Number(paginationShowBimbingan.value?.per_page) || 10;
  const startNumber = perPage * (currentPage - 1) + 1;

  return listBimbingan.value.map((item, index) => ({
    ...item,
    rowNumber: startNumber + index,
  }));
});
</script>

<template>
  <div
    v-if="loadingShowBimbingan"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>
  <div v-else-if="errorShowBimbingan" class="p-4">
    <ErrorMsg :message="errorShowBimbingan" />
  </div>
  <div v-else>
    <Breadcrumb />
    <!-- Header: Info Dosen & Progress BAB -->
    <div class="p-6 bg-white card-rounded lg:p-8">
      <!-- Info Dosen Pembimbing -->
      <UserData
        class="max-w-screen-xl mx-auto mb-4"
        :headText="dataShowBimbingan?.mahasiswa?.name || 'Nama Mahasiswa'"
        :bodyText="dataShowBimbingan?.mahasiswa?.nim || 'NIM Mahasiswa'"
        headText2="Dosen Pembimbing"
        :bodyText2="
          dataShowBimbingan?.dosen_pembimbing?.name || 'Nama Dosen Pembimbing'
        "
        headText3="Kategori"
        :bodyText3="
          dataShowBimbingan?.kategori?.nama_kategori || 'Kategori Tugas Akhir'
        "
        :tahunAjaran="
          dataShowBimbingan?.tahun_ajaran?.tahun_ajaran || 'Tahun Ajaran'
        "
      />

      <!-- Progress BAB & Tombol Tambah -->
      <div
        class="flex flex-col items-center justify-between max-w-screen-xl mx-auto md:gap-8 md:flex-row"
      >
        <!-- Progress Bar BAB -->
        <ProgressBarBAB class="sm:ms-3" :currentStep="highestChapter" />

        <!-- Tombol Tambah Bimbingan -->
        <div class="flex items-center w-full gap-2 md:w-fit">
          <!-- Desktop Button -->
          <Tooltip
            v-if="!dinilai"
            text="Menunggu Dinilai"
            size="md"
            position="bottom"
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
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              />
            </svg>
          </Tooltip>
          <Button
            class="hidden w-full lg:inline"
            :class="buttonClasses"
            variant="success"
            size="lg"
            @click="showNilaiModal = true"
            :disabled="!dinilai"
          >
            Lihat Nilai
          </Button>

          <!-- Mobile Button -->
          <Button
            class="w-full lg:hidden"
            :class="buttonClasses"
            variant="success"
            size="md"
            @click="showNilaiModal = true"
            :disabled="!dinilai"
          >
            Lihat Nilai
          </Button>
        </div>
      </div>
    </div>

    <!-- Tabel Riwayat Bimbingan -->
    <div class="p-4 mt-4 bg-white card-rounded lg:p-8">
      <Table
        :headers="['No', 'Tanggal', 'BAB', 'Catatan', 'Status']"
        :items="numberedBimbingan"
        @rowClick="handleRowClick"
        :pagination="paginationShowBimbingan"
        @pageChange="
          (page) => {
            currentPageNum = page;
          }
        "
      >
        <template #row="{ item }">
          <!-- Kolom No -->
          <td
            class="px-3 py-3 border-r border-white rounded-l-lg sm:py-3 sm:px-6 body5 sm:body4"
          >
            {{ item.rowNumber }}
          </td>

          <!-- Kolom Tanggal -->
          <td
            class="px-3 py-3 border-r border-white sm:py-3 sm:px-6 body5 sm:body4"
          >
            {{ item.tanggal_bimbingan }}
          </td>

          <!-- Kolom BAB -->
          <td
            class="px-3 py-3 border-r border-white sm:py-3 sm:px-6 body5 sm:body4"
          >
            BAB {{ toRoman(item.bab) }}
          </td>

          <!-- Kolom Catatan -->
          <td
            class="body5 sm:body4 py-3 px-3 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-3 sm:px-6 border-r border-white"
          >
            {{ item.catatan }}
          </td>

          <!-- Kolom Status -->
          <td
            class="px-3 py-3 border-r border-white rounded-r-lg sm:py-3 sm:px-6body5 sm:body4"
          >
            <StatusLabel
              class="hidden w-fit lg:block"
              :status="getStatusClass(item.status_verifikasi)"
              size="md"
              :label="getStatusLabel(item.status_verifikasi)"
            />

            <StatusLabel
              class="block w-fit lg:hidden"
              :status="getStatusClass(item.status_verifikasi)"
              size="sm"
              :label="getStatusLabel(item.status_verifikasi)"
            />
          </td>
        </template>
      </Table>
    </div>
  </div>

  <!-- Modal -->
  <DefaultModal
    v-if="showNilaiModal"
    headText="Nilai Bimbingan"
    :bodyText="`${dataShowBimbingan?.mahasiswa?.name} | ${dataShowBimbingan?.mahasiswa?.nim}`"
    @close="showNilaiModal = false"
  >
    <div class="flex flex-wrap gap-4">
      <InputText
        id="nilai-disiplin"
        class="sm:min-w-[300px] flex-grow"
        label="Disiplin (20%)"
        :modelValue="dataShowBimbingan?.nilai_bimbingan?.disiplin"
        :disabled="true"
      />
      <InputText
        id="nilai-komunikasi"
        class="sm:min-w-[300px] flex-grow"
        label="Komunikasi (20%)"
        :modelValue="dataShowBimbingan?.nilai_bimbingan?.komunikasi"
        :disabled="true"
      />
      <InputText
        id="nilai-skill-pengetahuan"
        class="sm:min-w-[300px] flex-grow"
        label="Skill / Pengetahuan (45%)"
        :modelValue="dataShowBimbingan?.nilai_bimbingan?.skill_pengetahuan"
        :disabled="true"
      />
      <InputText
        id="nilai-tingkah-laku"
        class="sm:min-w-[300px] flex-grow"
        label="Tingkah Laku (15%)"
        :modelValue="dataShowBimbingan?.nilai_bimbingan?.tingkah_laku"
        :disabled="true"
      />
    </div>
    <InputText
      id="nilai-rerata"
      class="flex-grow mt-4"
      label="Nilai rata-rata"
      :modelValue="dataShowBimbingan?.nilai_bimbingan?.rerata_bimbingan"
      :disabled="true"
    />
  </DefaultModal>

  <ModalDetailBimbingan
    ref="modalDetailRef"
    v-if="showBimbinganModal && selectedBimbingan"
    :bimbinganKe="selectedBimbingan.rowNumber"
    :tanggalBimbingan="selectedBimbingan.tanggal_bimbingan"
    :bab="selectedBimbingan.bab"
    :catatan="selectedBimbingan.catatan"
    :status="getStatusClass(selectedBimbingan.status_verifikasi)"
    :statusLabel="getStatusLabel(selectedBimbingan.status_verifikasi)"
    @close="closeDetailModal"
  />
</template>
