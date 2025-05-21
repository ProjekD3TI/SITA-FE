<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import ProgressBarBAB from "@/components/Tugas-akhir/ProgressBarBAB.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import StatusLabel from "@/components/Tugas-akhir/Label.vue";
import ModalVerifikasiBimbingan from "@/components/Tugas-akhir/Modals/ModalVerifikasiBimbingan.vue";
import ModalDetailBimbingan from "@/components/Tugas-akhir/Modals/ModalDetailBimbingan.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputNumber from "@/components/Tugas-akhir/Forms/InputNumber.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";

const route = useRoute();
const router = useRouter();
const studentInfo = ref({
  nim: "",
  name: "",
  category: "",
  title: "",
});

// Data riwayat bimbingan (seeder)
const bimbinganData = ref([
  {
    id: 1,
    tanggal: "10 Januari 2024",
    bab: "1",
    catatan: "Perlu perbaikan pada latar belakang dan rumusan masalah",
    status: "Diterima", // revisi, acc, pending
  },
  {
    id: 2,
    tanggal: "25 Januari 2024",
    bab: "1",
    catatan:
      "Latar belakang sudah diperbaiki, rumusan masalah masih perlu tambahan data pendukung",
    status: "Diterima",
  },
  {
    id: 3,
    tanggal: "15 Februari 2024",
    bab: "1",
    catatan: "Semua sudah baik, bisa lanjut ke BAB II",
    status: "Diterima",
  },
  {
    id: 4,
    tanggal: "5 Maret 2024",
    bab: "2",
    catatan:
      "Kajian pustaka perlu diperdalam, landasan teori kurang komprehensif",
    status: "Ditolak",
  },
  {
    id: 5,
    tanggal: "20 Maret 2024",
    bab: "2",
    catatan: "Kajian pustaka sudah diperbaiki, lanjutkan ke BAB III",
    status: "Diterima",
  },
  {
    id: 6,
    tanggal: "10 April 2024",
    bab: "3",
    catatan: "Metodologi penelitian perlu diperjelas tahapannya",
    status: "Menunggu",
  },
]);

// Format data untuk tabel (terbaru di atas)
const formattedBimbinganData = computed(() => {
  // Salin array untuk menghindari mutasi data asli
  const sortedData = [...bimbinganData.value];

  // Urutkan berdasarkan tanggal terbaru
  sortedData.sort((a, b) => {
    // Konversi tanggal dari string ke Date object
    const dateA = new Date(a.tanggal.split(" ").reverse().join(" "));
    const dateB = new Date(b.tanggal.split(" ").reverse().join(" "));
    return dateB - dateA; // Urutan menurun (terbaru di atas)
  });

  // Tambahkan nomor urut sesuai urutan tampilan
  return sortedData.map((item, index) => ({
    ...item,
    no: index + 1,
  }));
});

// Fungsi untuk menentukan kelas status
const getStatusClass = (status) => {
  switch (status) {
    case "Diterima":
      return "success";
    case "Menunggu":
      return "warning";
    case "Ditolak":
      return "danger";
    default:
      return "inactive";
  }
};

// Fungsi untuk menentukan label status
const getStatusLabel = (status) => {
  switch (status) {
    case "Diterima":
      return "Diterima";
    case "Menunggu":
      return "Menunggu";
    case "Ditolak":
      return "Ditolak";
    default:
      return "Unknown";
  }
};

// Menentukan BAB tertinggi yang sudah di-ACC
const highestChapter = computed(() => {
  const accChapters = bimbinganData.value
    .filter((item) => item.status === "Diterima")
    .map((item) => parseInt(item.bab));

  return Math.max(...accChapters, 0);
});

// Handler untuk klik baris tabel (modal verifikasi bimbingan)
const handleRowClick = (item) => {
  console.log("Row clicked:", item);
};

// Fungsi untuk mengupdate data dari query parameters
const updateStudentInfo = () => {
  const nim = route.query.nim;
  const name = route.query.name;
  const category = route.query.category;
  const title = route.query.title;

  console.log("Query params received:", { nim, name, category, title });

  // Update hanya jika ada data query parameter
  if (nim) {
    studentInfo.value = {
      nim: nim,
      name: name || "John Batubara",
      category: category || "Internet of Things",
      title: title || "Pengembangan El Pikir",
    };
    console.log("Updated student info:", studentInfo.value);
  }
};

// Panggil saat komponen dimount
onMounted(() => {
  console.log("DetailBimbingan mounted with route:", route.fullPath);
  updateStudentInfo();

  // Simulasi loading data bimbingan dari API berdasarkan NIM
  // Di sini kita menggunakan data statis, dalam implementasi nyata
  // Anda akan mengambil data dari API berdasarkan studentInfo.value.nim
});

// Watch untuk perubahan route.query dengan immediate true
watch(
  () => route.query,
  (newQuery) => {
    console.log("Route query changed:", newQuery);
    updateStudentInfo();
  },
  { deep: true, immediate: true }
);

// Ref for modal components
const verifikasiModal = ref(null);
const detailModal = ref(null);
const nilaiModal = ref(false); // Changed to boolean for visibility control

// Data for bimbingan detail (needed for nilai modal)
const bimbinganDetail = ref({
  nilaiDisiplin: 85,
  nilaiKomunikasi: 80,
  nilaiPengetahuan: 90,
  nilaiTingkahLaku: 85,
  catatanRevisi:
    "Perbaikan pada metodologi dan analisis data sudah dilakukan dengan baik.",
  nilaiRataRata: 86.25,
});

// Create refs for modal form data
const id = ref(0);
const tanggal = ref("");
const bab = ref("");
const catatan = ref("");
const status = ref("");
const statusLabel = ref("");

// Functions for modal handling
const openVerifikasiModal = () => {
  // Find bimbingan data with id 6
  const bimbingan = bimbinganData.value.find((item) => item.id === 6);

  if (bimbingan) {
    // Set modal data from bimbingan data
    id.value = bimbingan.id;
    tanggal.value = bimbingan.tanggal;
    bab.value = bimbingan.bab;
    catatan.value = bimbingan.catatan;
  }

  // Open the modal using the exposed method
  verifikasiModal.value.open();
};

const openDetailModal = () => {
  // Find bimbingan data with id 6
  const bimbingan = bimbinganData.value.find((item) => item.id === 6);

  if (bimbingan) {
    // Set modal data from bimbingan data
    id.value = bimbingan.id;
    tanggal.value = bimbingan.tanggal;
    bab.value = bimbingan.bab;
    catatan.value = bimbingan.catatan;
    status.value = getStatusClass(bimbingan.status); // Pass the CSS class name instead of the status text
    statusLabel.value = getStatusLabel(bimbingan.status);
  }

  // Open the modal using the exposed method
  detailModal.value.open();
};

// Function to open nilai modal
const openNilaiModal = () => {
  nilaiModal.value = true;
  console.log("Nilai modal opened");
};

const closeModal = () => {
  console.log("Modal closed");
  nilaiModal.value = false;
  // Any cleanup logic here
};
</script>

<template>
  <div v-if="!$route.path.includes('input-nilai-bimbingan')">
    <!-- Header: Info Dosen & Progress BAB -->
    <div class="card-rounded bg-white p-6 lg:p-8">
      <!-- Info Dosen Pembimbing -->
      <div class="flex gap-2 sm:gap-4 max-w-screen-xl mx-auto">
        <!-- Icon Dosen -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>

        <!-- Detail Informasi -->
        <div class="self-center flex flex-wrap justify-between w-full">
          <!-- Dosen Pembimbing -->
          <div>
            <span class="body5 sm:body4-bold">{{ studentInfo.name }}</span>
            <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">
              {{ studentInfo.nim }}
            </h5>
          </div>

          <!-- Kategori TA -->
          <div class="lg:border-l-2 border-black lg:pl-4">
            <span class="body5 sm:body5-bold">{{ studentInfo.category }}</span>
            <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">
              {{ studentInfo.title }}
            </h5>
          </div>

          <!-- Tahun Ajaran -->
          <div class="lg:border-l-2 border-black lg:pl-4">
            <span class="body5 sm:body4-bold">Tahun Ajaran</span>
            <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">
              2024/2025
            </h5>
          </div>
        </div>
      </div>

      <!-- Progress BAB & Tombol Input -->
      <div
        class="flex flex-wrap justify-between items-center max-w-screen-xl mx-auto"
      >
        <!-- Progress Bar BAB -->
        <ProgressBarBAB class="sm:ms-3" :currentStep="highestChapter" />

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <!-- Tombol Nilai (Desktop) -->
          <router-link
            :to="{
              path: '/dosen/tugas-akhir/bimbingan/detail-bimbingan/input-nilai-bimbingan',
              query: {
                nim: studentInfo.nim,
                name: studentInfo.name,
                category: studentInfo.category,
                title: studentInfo.title,
              },
            }"
          >
            <Button
              class="hidden lg:flex"
              variant="primary"
              size="xl"
              left-icon-path="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
            >
              Nilai
            </Button>

            <!-- Tombol Nilai (Mobile) -->
            <Button
              class="lg:hidden"
              variant="primary"
              size="md"
              left-icon-path="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
            >
              Nilai
            </Button>
          </router-link>
        </div>
      </div>
    </div>
    <!-- Tabel Riwayat Bimbingan -->
    <div class="card-rounded bg-white p-4 lg:p-8 mt-4">
      <Table
        :headers="['No', 'Tanggal', 'BAB', 'Catatan', 'Status']"
        :items="formattedBimbinganData"
        @rowClick="handleRowClick"
      >
        <template #row="{ item }">
          <!-- Kolom No -->
          <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-l-lg">
            {{ item.no }}
          </td>

          <!-- Kolom Tanggal -->
          <td class="sm:py-3 py-3 sm:px-4 px-1">
            {{ item.tanggal }}
          </td>

          <!-- Kolom BAB -->
          <td class="sm:py-3 py-3 sm:px-4 px-1">
            {{
              item.bab === "1"
                ? "BAB I"
                : item.bab === "2"
                ? "BAB II"
                : item.bab === "3"
                ? "BAB III"
                : item.bab === "4"
                ? "BAB IV"
                : item.bab === "5"
                ? "BAB V"
                : "BAB " + item.bab
            }}
          </td>

          <!-- Kolom Catatan -->
          <td
            class="py-3 px-1 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-3 sm:px-4"
          >
            {{ item.catatan }}
          </td>

          <!-- Kolom Status -->
          <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-r-lg">
            <!-- Desktop Status -->
            <StatusLabel
              class="w-fit hidden lg:block mx-auto"
              :status="getStatusClass(item.status)"
              size="md"
              :label="getStatusLabel(item.status)"
            />

            <!-- Mobile Status -->
            <StatusLabel
              class="w-fit lg:hidden block mx-auto"
              :status="getStatusClass(item.status)"
              size="sm"
              :label="getStatusLabel(item.status)"
            />
          </td>
        </template>
      </Table>
    </div>
  </div>
  <router-view v-else></router-view>

  <!-- Modal Verifikasi Bimbingan with ref -->
  <ModalVerifikasiBimbingan
    ref="verifikasiModal"
    @close="closeModal"
    title="Verfikasi Bimbingan"
    :bimbinganKe="id"
    :tanggalBimbingan="tanggal"
    :bab="bab"
    :catatan="catatan"
  ></ModalVerifikasiBimbingan>

  <!-- Modal Detail Bimbingan -->
  <ModalDetailBimbingan
    ref="detailModal"
    @close="closeModal"
    title="Detail Bimbingan"
    :bimbinganKe="id"
    :tanggalBimbingan="tanggal"
    :bab="bab"
    :catatan="catatan"
    :status="status"
    :statusLabel="statusLabel"
  ></ModalDetailBimbingan>

  <!-- Modal Lihat Nilai -->
  <DefaultModal
    v-if="nilaiModal"
    @close="closeModal"
    headText="Nilai Bimbingan"
    :bodyText="`${studentInfo.name} | ${studentInfo.nim} | ${studentInfo.title}`"
  >
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <InputNumber
          id="disiplin"
          label="Disiplin (20%)"
          :modelValue="bimbinganDetail.nilaiDisiplin"
          disabled
        ></InputNumber>
        <InputNumber
          id="komunikasi"
          label="Komunikasi (20%)"
          :modelValue="bimbinganDetail.nilaiKomunikasi"
          disabled
        ></InputNumber>
        <InputNumber
          id="pengetahuan"
          label="Skill / Pengetahuan (45%)"
          :modelValue="bimbinganDetail.nilaiPengetahuan"
          disabled
        ></InputNumber>
        <InputNumber
          id="tingkahLaku"
          label="Tingkah Laku (15%)"
          :modelValue="bimbinganDetail.nilaiTingkahLaku"
          disabled
        ></InputNumber>
      </div>

      <div>
        <InputTextarea
          id="catatanRevisi"
          label="Catatan Revisi"
          :modelValue="bimbinganDetail.catatanRevisi"
          disabled
        ></InputTextarea>
      </div>

      <div class="">
        <InputNumber
          id="nilaiRataRata"
          label="Nilai Rata-Rata"
          :modelValue="bimbinganDetail.nilaiRataRata"
          class="font-semibold"
          disabled
        ></InputNumber>
      </div>

      <div class="flex justify-end mt-6">
        <Button variant="secondary" size="lg"> Edit Nilai </Button>
      </div>
    </div>
  </DefaultModal>
</template>
