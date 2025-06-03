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
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useDibimbing } from "@/services/TugasAkhir/Dosen/dibimbing";

const route = useRoute();
const router = useRouter();

// Inisialisasi layanan dibimbing
const { 
  bimbinganList, 
  loadingBimbingan, 
  errorBimbingan, 
  fetchBimbingan,
  updateVerifikasiBimbingan 
} = useDibimbing();

// Informasi mahasiswa dari parameter query route
const studentInfo = ref({
  nim: "",
  name: "",
  category: "",
  title: "",
});

// Tambahkan di bagian awal script, dekat dengan deklarasi data lainnya
const breadcrumbItems = computed(() => [
  { label: "Tugas Akhir", path: "/dosen/tugas-akhir" },
  { label: "Bimbingan", path: "/dosen/tugas-akhir/bimbingan" },
  { label: "Detail Bimbingan", path: `/dosen/tugas-akhir/bimbingan/detail-bimbingan?id=${studentInfo.value.id}` }
]);

// Pesan error untuk ditampilkan
const errorMessage = computed(() => {
  return errorBimbingan.value || "Terjadi kesalahan saat memuat data.";
});

// Format data bimbingan untuk tampilan tabel
const formattedBimbinganData = computed(() => {
  if (!bimbinganList.value || !bimbinganList.value.bimbingan) {
    return [];
  }
  
  console.log("Raw bimbingan data:", bimbinganList.value.bimbingan);
  
  // Urutkan berdasarkan ID (terbaru di atas)
  const sortedData = [...bimbinganList.value.bimbingan].sort((a, b) => {
    return b.id - a.id;
  });
  
  // Petakan data ke format tabel
  return sortedData.map((item, index) => {
    // Untuk tanggal, gunakan tanggal_bimbingan langsung jika tersedia dalam format teks
    let formattedDate = "Tanggal tidak tersedia";
    
    if (item.tanggal_bimbingan) {
      // Gunakan langsung nilai tanggal dari API jika sudah dalam format teks
      formattedDate = item.tanggal_bimbingan;
      console.log(`Using tanggal_bimbingan directly: ${formattedDate}`);
    } else {
      // Fallback jika tidak ada tanggal_bimbingan
      try {
        // Coba parse created_at jika tersedia
        if (item.created_at) {
          const date = new Date(item.created_at);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
          }
        } else {
          // Fallback ke tanggal hari ini
          const today = new Date();
          formattedDate = today.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        }
      } catch (e) {
        console.error("Error formatting date:", e);
        // Gunakan tanggal hari ini sebagai fallback
        const today = new Date();
        formattedDate = today.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    }
    
    return {
      id: item.id,
      no: index + 1,
      tanggal: formattedDate,
      bab: item.bab?.toString() || "0",
      catatan: item.catatan || "",
      status: mapStatusToText(item.status_verifikasi)
    };
  });
});

// Pemetaan status numerik ke teks
function mapStatusToText(status) {
  switch (status) {
    case 1:
      return "Diterima";
    case 2:
      return "Ditolak";
    case 0:
    default:
      return "Menunggu";
  }
}

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
  return status;
};

// Menentukan BAB tertinggi yang sudah di-ACC
const highestChapter = computed(() => {
  try {
    if (!bimbinganList.value || !bimbinganList.value.bimbingan) {
      console.log("No bimbingan data available");
      return 0;
    }
    
    // Log untuk debugging
    console.log("All bimbingan entries:", bimbinganList.value.bimbingan);
    
    // Hanya ambil BAB yang sudah disetujui (status_verifikasi = 1)
    const accBimbingan = bimbinganList.value.bimbingan.filter(item => item.status_verifikasi === 1);
    console.log("Accepted bimbingan entries:", accBimbingan);
    
    // Jika tidak ada BAB yang disetujui, kembalikan 0
    if (accBimbingan.length === 0) {
      console.log("No accepted chapters found");
      return 0;
    }
    
    // Map ke nomor BAB dan filter nilai yang valid
    const accChapters = accBimbingan
      .map(item => {
        // Pastikan bab adalah angka
        const babStr = item.bab?.toString() || "0";
        const babNumber = parseInt(babStr);
        console.log(`Chapter mapping: original=${babStr}, parsed=${babNumber}`);
        return isNaN(babNumber) ? 0 : babNumber;
      })
      .filter(num => num > 0); // Hanya ambil BAB yang valid (> 0)
    
    console.log("Valid accepted chapter numbers:", accChapters);
    
    // Jika tidak ada BAB valid yang disetujui, kembalikan 0
    if (accChapters.length === 0) {
      console.log("No valid accepted chapter numbers");
      return 0;
    }
    
    // Cek jika ada nilai bab_tertinggi dari API
    if (bimbinganList.value.bab_tertinggi !== undefined && 
        bimbinganList.value.bab_tertinggi !== null) {
      const highest = parseInt(bimbinganList.value.bab_tertinggi);
      console.log(`Using API bab_tertinggi value: ${highest}`);
      
      // Verifikasi nilai bab_tertinggi (harus valid dan <= BAB tertinggi yang disetujui)
      if (!isNaN(highest) && highest > 0) {
        const maxAccChapter = Math.max(...accChapters);
        // Jika bab_tertinggi > BAB tertinggi yang disetujui, gunakan BAB tertinggi yang disetujui
        if (highest > maxAccChapter) {
          console.log(`API bab_tertinggi (${highest}) > max accepted chapter (${maxAccChapter}), using max accepted chapter`);
          return maxAccChapter;
        }
        return highest;
      }
    }
    
    // Jika tidak ada bab_tertinggi yang valid, gunakan BAB tertinggi yang sudah di-ACC
    const maxChapter = Math.max(...accChapters);
    console.log(`Using calculated max chapter: ${maxChapter}`);
    return maxChapter;
  } catch (err) {
    console.error("Error calculating highest chapter:", err);
    return 0; // Default ke 0 jika terjadi error
  }
});

// Computed property untuk tahun ajaran
const tahunAjaran = computed(() => {
  if (bimbinganList.value && bimbinganList.value.tahun_ajaran) {
    return bimbinganList.value.tahun_ajaran.tahun_ajaran;
  }
  return "2024/2025";
});

// Fungsi untuk mengupdate data dari parameter query dan response API
const updateStudentInfo = async () => {
  const nim = route.query.nim;
  const name = route.query.name;
  const category = route.query.category;
  const title = route.query.title;
  const id = route.query.id;

  console.log("Query params received:", { id, nim, name, category, title });

  if (nim) {
    studentInfo.value = {
      id,
      nim,
      name: name || "Unknown",
      category: category || "Uncategorized",
      title: title || "Judul Tidak Tersedia",
    };
    console.log("Updated student info from query params:", studentInfo.value);
  }
  
  if (id) {
    try {
      const response = await fetchBimbingan(id);
      
      // Update judul dari response API jika tersedia
      if (response.data?.judul_tugas_akhir) {
        studentInfo.value.title = response.data.judul_tugas_akhir;
        console.log("Updated title from API:", studentInfo.value.title);
      }
    } catch (err) {
      console.error("Error fetching bimbingan data:", err);
    }
  }
};

// Panggil saat komponen dimount
onMounted(() => {
  console.log("DetailBimbingan mounted with route:", route.fullPath);
  updateStudentInfo();
});

// Watch untuk perubahan route.query
watch(
  () => route.query,
  (newQuery) => {
    console.log("Route query changed:", newQuery);
    updateStudentInfo();
  },
  { deep: true, immediate: true }
);

// Data untuk detail bimbingan (untuk modal nilai)
const bimbinganDetail = computed(() => {
  if (!bimbinganList.value || !bimbinganList.value.nilai_bimbingan) {
    return {
      nilaiDisiplin: 0,
      nilaiKomunikasi: 0,
      nilaiPengetahuan: 0,
      nilaiTingkahLaku: 0,
      catatanRevisi: "",
      nilaiRataRata: 0,
    };
  }
  
  const nilai = bimbinganList.value.nilai_bimbingan;
  return {
    nilaiDisiplin: nilai.disiplin || 0,
    nilaiKomunikasi: nilai.komunikasi || 0,
    nilaiPengetahuan: nilai.skill_pengetahuan || 0,
    nilaiTingkahLaku: nilai.tingkah_laku || 0,
    catatanRevisi: nilai.catatan || "",
    nilaiRataRata: nilai.rerata_bimbingan || 0,
  };
});

// Ref untuk komponen modal
const verifikasiModal = ref(null);
const detailModal = ref(null);
const nilaiModal = ref(false);

// Ref untuk data form modal
const id = ref(0);
const tanggal = ref("");
const bab = ref(0);
const catatan = ref("");
const status = ref("");
const statusLabel = ref("");
const noBimbingan = ref(0);

// Fungsi untuk penanganan modal
const openVerifikasiModal = (item) => {
  id.value = item.id;
  tanggal.value = item.tanggal;
  bab.value = parseInt(item.bab) || 0;
  catatan.value = item.catatan;
  
  verifikasiModal.value.open();
};

const openDetailModal = (item) => {
  id.value = item.id;
  tanggal.value = item.tanggal;
  bab.value = parseInt(item.bab) || 0;
  catatan.value = item.catatan;
  status.value = getStatusClass(item.status);
  statusLabel.value = getStatusLabel(item.status);
  
  // Tambahkan properti untuk nomor bimbingan
  noBimbingan.value = item.no;
  
  detailModal.value.open();
};

// Fungsi untuk membuka modal nilai
const openNilaiModal = () => {
  nilaiModal.value = true;
  console.log("Nilai modal opened");
};

const closeNilaiModal = () => {
  console.log("Modal closed");
  nilaiModal.value = false;
};

const closeModal = () => {
  console.log("Modal closed");
};

// Menangani aksi terima verifikasi
const handleAccept = async () => {
  try {
    await updateVerifikasiBimbingan(id.value, 1);
    if (studentInfo.value.id) {
      fetchBimbingan(studentInfo.value.id);
    }
    verifikasiModal.value.close();
  } catch (err) {
    console.error("Error accepting bimbingan:", err);
  }
};

// Menangani aksi tolak verifikasi
const handleReject = async () => {
  try {
    await updateVerifikasiBimbingan(id.value, 2);
    if (studentInfo.value.id) {
      fetchBimbingan(studentInfo.value.id);
    }
    verifikasiModal.value.close();
  } catch (err) {
    console.error("Error rejecting bimbingan:", err);
  }
};

// Penanganan tombol aksi
const handleActionClick = (item, action) => {
  console.log(`Action ${action} clicked for item:`, item);

  if (action === "verifikasi") {
    openVerifikasiModal(item);
  } else if (action === "detail") {
    openDetailModal(item);
  }

  event.stopPropagation();
};
</script>

<template>

<Breadcrumb :items="breadcrumbItems" />

  <Loading v-if="loadingBimbingan" />
  <ErrorMsg v-else-if="errorBimbingan" :message="errorMessage" />
  <div v-else-if="!$route.path.includes('input-nilai-bimbingan')">
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
          <!-- Mahasiswa Info -->
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
              {{ tahunAjaran }}
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
                id: studentInfo.id,
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
        :headers="['No', 'Tanggal', 'BAB', 'Catatan', 'Status', 'Aksi']"
        :items="formattedBimbinganData"
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
          <td class="sm:py-3 py-3 sm:px-4 px-1">
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

          <!-- Kolom Aksi -->
          <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-r-lg">
            <!-- Button for Menunggu status -->
            <Button
              v-if="item.status === 'Menunggu'"
              variant="secondary"
              size="md"
              @click.stop="handleActionClick(item, 'verifikasi')"
              class="w-full sm:w-auto"
            >
              Verifikasi
            </Button>

            <!-- Button for Diterima or Ditolak status -->
            <Button
              v-else
              variant="primary"
              size="md"
              @click.stop="handleActionClick(item, 'detail')"
              class="w-full sm:w-auto"
            >
              Detail
            </Button>
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
    @accept="handleAccept"
    @reject="handleReject"
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
  :bimbinganKe="noBimbingan"
  :tanggalBimbingan="tanggal"
  :bab="bab"
  :catatan="catatan"
  :status="status"
  :statusLabel="statusLabel"
></ModalDetailBimbingan>

  <!-- Modal Lihat Nilai -->
  <DefaultModal
    v-if="nilaiModal"
    @close="closeNilaiModal"
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