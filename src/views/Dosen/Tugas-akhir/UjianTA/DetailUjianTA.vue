<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import JadwalUjian from "@/components/Tugas-akhir/JadwalUjian.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Tooltip from "@/components/Tugas-akhir/Tooltip.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputNumber from "@/components/Tugas-akhir/Forms/InputNumber.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import Loading from "@/components/Loading.vue";
import router from "@/router";
import { useDetailUjianTA } from "@/services/TugasAkhir/Dosen/detailUjianTA.js";
import { useToast } from "vue-toastification";

const route = useRoute();
const { detailUjian, loading, error, fetchDetailUjian, refreshDetailUjian } =
  useDetailUjianTA();
const toast = useToast();

// App State
const showNilaiModal = ref(false);

// Watch the route params for changes and reload data when needed
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.tugas_akhir_id) {
      fetchDetailUjian(newQuery.tugas_akhir_id);

      // Show toast notification if returning from successful submission - simplified version
      if (newQuery.success === "true") {
        const message =
          newQuery.action === "update"
            ? "Nilai berhasil diperbarui"
            : "Nilai berhasil disimpan";
        toast.success(message);

        // Remove success param from URL to prevent showing toast on refresh
        const newRoute = {
          path: route.path,
          query: { ...route.query },
        };
        delete newRoute.query.success;
        delete newRoute.query.action;
        router.replace(newRoute);
      }
    }
  },
  { deep: true, immediate: true }
);

// Check if current user is Secretary or Supervising Lecturer
const isSecretary = computed(() => {
  if (!detailUjian.value) return false;

  // Check if current user is a Secretary among the examiners
  const isSecretaryExaminer = detailUjian.value.dosen_penguji?.some(
    (penguji) => {
      // The API marks current user by providing their nilai_ujian_ta data
      const isCurrentUser = penguji.nilai_ujian_ta !== null;
      const isSecretary =
        penguji.jabatan_penguji?.toLowerCase() === "sekretaris";
      return isCurrentUser && isSecretary;
    }
  );

  // Check if current user is the supervising lecturer
  const isSupervisingLecturer =
    detailUjian.value.dosen_pembimbing?.dosen_pembimbing_id ===
    detailUjian.value.dosen_penguji?.find((p) => p.nilai_ujian_ta !== null)
      ?.dosen_penguji_id;

  return isSecretaryExaminer || isSupervisingLecturer;
});

// Get nilai status - check if current user has given grade
const hasGiven = computed(() => {
  if (!detailUjian.value) return false;

  // Find if current user has already given grades
  const currentDosenPenguji = detailUjian.value.dosen_penguji.find(
    (penguji) => penguji.nilai_ujian_ta !== null
  );

  return !!currentDosenPenguji?.nilai_ujian_ta;
});

// PDF handling
const pdfUrl = computed(() => {
  if (detailUjian.value?.berkas && detailUjian.value.berkas.length > 0) {
    return detailUjian.value.berkas[0].file_path;
  }
  return null;
});

// Computed for examiners list
const examiners = computed(() => {
  if (!detailUjian.value?.dosen_penguji) return [];

  return detailUjian.value.dosen_penguji.map((penguji) => ({
    name: penguji.name,
    role: penguji.jabatan_penguji || "Dosen Penguji",
  }));
});

// Compute jadwal ujian from the API data
const schedule = computed(() => {
  if (!detailUjian.value?.ujian_ta) return { date: "", time: "", room: "" };

  const ujian = detailUjian.value.ujian_ta;
  return {
    date: ujian.tanggal_ujian || "",
    time:
      ujian.waktu_mulai && ujian.waktu_selesai
        ? `${ujian.waktu_mulai} - ${ujian.waktu_selesai}`
        : "",
    room: ujian.ruang || "",
  };
});

// Compute TA details from API data
const tugasAkhirDetails = computed(() => {
  if (!detailUjian.value) return {};

  return {
    nim: detailUjian.value.mahasiswa?.nim || "",
    nama: detailUjian.value.mahasiswa?.name || "",
    judul: detailUjian.value.judul_tugas_akhir || "",
    kategori: detailUjian.value.kategori?.nama_kategori || "",
    dosenPembimbing: detailUjian.value.dosen_pembimbing?.name || "",
    tahunAjaran: detailUjian.value.tahun_ajaran?.tahun_ajaran || "",
  };
});

// Get nilai data for the current dosen
const nilaiData = computed(() => {
  if (!detailUjian.value?.dosen_penguji) return null;

  const currentDosenPenguji = detailUjian.value.dosen_penguji.find(
    (penguji) => penguji.nilai_ujian_ta !== null
  );

  return currentDosenPenguji?.nilai_ujian_ta || null;
});

// Convert numeric status kelulusan to text
const statusKelulusanText = computed(() => {
  if (!detailUjian.value) return "";

  const statusMap = {
    1: "Lulus tanpa revisi",
    2: "Lulus dengan revisi",
    3: "Belum lulus perlu diuji lagi",
    4: "Tidak lulus",
  };

  return statusMap[detailUjian.value.status_kelulusan] || "Belum ada status";
});

// Data nilai mahasiswa untuk ditampilkan
const tataLaporan = computed(() => nilaiData.value?.kualitas_tata_laporan || 0);
const kemampuanTeknis = computed(() => nilaiData.value?.kemampuan_teknis || 0);
const hasilProduk = computed(() => nilaiData.value?.kualitas_produk || 0);
const presentasi = computed(() => nilaiData.value?.presentasi || 0);
const totalNilai = computed(() => nilaiData.value?.rerata_ujian_ta || 0);

// Get revision comments
const catatanRevisi = computed(() => {
  if (!detailUjian.value?.dosen_penguji) return "";

  const currentDosenPenguji = detailUjian.value.dosen_penguji.find(
    (penguji) => penguji.nilai_ujian_ta !== null
  );

  return currentDosenPenguji?.revisi || "";
});

// Load data when component is mounted
onMounted(() => {
  const tugasAkhirId = route.query.tugas_akhir_id;
  if (tugasAkhirId) {
    fetchDetailUjian(tugasAkhirId);
  }
});

// Methods
const openNilaiModal = () => {
  // Just open the modal without fetching data again
  showNilaiModal.value = true;
};

const closeNilaiModal = () => {
  showNilaiModal.value = false;
};

// Methods for edit nilai functionality
const goToEditNilai = () => {
  closeNilaiModal();

  // Add timestamp to query for cache busting
  const timestamp = Date.now();

  router.push({
    path: "/dosen/tugas-akhir/ujian-ta/detail-ujian-ta/input-nilai-ujian-ta",
    query: {
      tugas_akhir_id: route.query.tugas_akhir_id,
      nim: tugasAkhirDetails.value.nim,
      name: tugasAkhirDetails.value.nama,
      category: tugasAkhirDetails.value.kategori,
      title: tugasAkhirDetails.value.judul,
      edit: true,
      _t: timestamp, // Add timestamp for cache busting
    },
  });
};

// Computed for modal body text
const modalBodyText = computed(() => {
  return `${tugasAkhirDetails.value.nama} | ${tugasAkhirDetails.value.nim} | ${tugasAkhirDetails.value.judul}`;
});
</script>

<template>
  <!-- Loading state -->
  <div v-if="loading" class="flex items-center justify-center min-h-[80dvh]">
    <Loading />
  </div>

  <!-- Error state -->
  <div v-else-if="error" class="bg-red-100 p-4 rounded-lg mt-4">
    <p class="text-red-700">{{ error }}</p>
    <Button
      @click="fetchDetailUjian(route.query.tugas_akhir_id)"
      variant="outlined"
      size="sm"
      class="mt-2"
    >
      Coba Lagi
    </Button>
  </div>

  <div v-else-if="!$route.path.includes('input-nilai-ujian-ta') && detailUjian">
    <Breadcrumb :items="breadcrumbItems" />
    <!-- Jadwal Section -->
    <div class="card-rounded bg-white p-6 lg:p-8">
      <div class="max-w-screen-2xl mx-auto">
        <JadwalUjian :examiners="examiners" :jadwal="schedule" />
      </div>
    </div>

    <!-- Tugas Akhir Details Section -->
    <div class="card-rounded bg-white p-6 lg:p-8 mt-6">
      <div class="max-w-screen-2xl mx-auto">
        <div class="flex flex-col md:flex-row">
          <!-- PDF Preview (Left Side) -->
          <div class="basis-7/12 md:pe-8 order-last md:order-first">
            <object
              v-if="pdfUrl"
              :data="pdfUrl"
              type="application/pdf"
              class="w-full h-[750px] mt-6 md:mt-0"
            >
              <p class="p-4 text-center">
                Browser Anda tidak mendukung tampilan PDF.
                <a :href="pdfUrl" target="_blank" class="text-primary"
                  >Klik di sini</a
                >
                untuk membuka PDF.
              </p>
            </object>
            <div
              v-else
              class="w-full h-[750px] bg-gray-100 flex items-center justify-center"
            >
              <p class="text-gray-500">Berkas PDF tidak tersedia</p>
            </div>
          </div>

          <!-- Details (Right Side) -->
          <div class="basis-5/12 flex flex-col gap-4">
            <!-- Detail items -->
            <div class="flex flex-col gap-2">
              <div>
                <h5 class="body1-bold">Judul Tugas Akhir</h5>
                <p class="body1 text-primary">{{ tugasAkhirDetails.judul }}</p>
              </div>

              <div>
                <h5 class="body1-bold">Kategori</h5>
                <p class="body1 text-primary">
                  {{ tugasAkhirDetails.kategori }}
                </p>
              </div>

              <div>
                <h5 class="body1-bold">NIM</h5>
                <p class="body1 text-primary">{{ tugasAkhirDetails.nim }}</p>
              </div>

              <div>
                <h5 class="body1-bold">Nama Mahasiswa</h5>
                <p class="body1 text-primary">{{ tugasAkhirDetails.nama }}</p>
              </div>

              <div>
                <h5 class="body1-bold">Dosen Pembimbing</h5>
                <p class="body1 text-primary">
                  {{ tugasAkhirDetails.dosenPembimbing }}
                </p>
              </div>

              <div>
                <h5 class="body1-bold">Tahun Ajaran</h5>
                <p class="body1 text-primary">
                  {{ tugasAkhirDetails.tahunAjaran }}
                </p>
              </div>
            </div>

            <!-- Action Buttons - Modified to show either Input or View button -->
            <div class="flex flex-col gap-4">
              <div class="flex self-end gap-4 items-center">
                <!-- If nilai exists, show Lihat Nilai button -->
                <Button
                  v-if="hasGiven"
                  @click="openNilaiModal"
                  variant="success"
                  size="lg"
                  class="w-fit sm:flex hidden"
                >
                  Lihat Nilai
                </Button>

                <Button
                  v-if="hasGiven"
                  @click="openNilaiModal"
                  variant="success"
                  size="md"
                  class="w-fit sm:hidden"
                >
                  Lihat Nilai
                </Button>

                <!-- If nilai doesn't exist, show Input Nilai button -->
                <router-link
                  v-else
                  :to="{
                    path: '/dosen/tugas-akhir/ujian-ta/detail-ujian-ta/input-nilai-ujian-ta',
                    query: {
                      tugas_akhir_id: route.query.tugas_akhir_id,
                      nim: tugasAkhirDetails.nim,
                      name: tugasAkhirDetails.nama,
                      category: tugasAkhirDetails.kategori,
                      title: tugasAkhirDetails.judul,
                    },
                  }"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    class="w-fit sm:flex hidden"
                  >
                    Input Nilai
                  </Button>
                </router-link>

                <router-link
                  v-else
                  :to="{
                    path: '/dosen/tugas-akhir/ujian-ta/detail-ujian-ta/input-nilai-ujian-ta',
                    query: {
                      tugas_akhir_id: route.query.tugas_akhir_id,
                      nim: tugasAkhirDetails.nim,
                      name: tugasAkhirDetails.nama,
                      category: tugasAkhirDetails.kategori,
                      title: tugasAkhirDetails.judul,
                    },
                  }"
                >
                  <Button variant="primary" size="md" class="w-fit sm:hidden">
                    Input Nilai
                  </Button>
                </router-link>
              </div>

              <div v-if="hasGiven" class="text-green-600 text-sm self-end">
                Anda sudah memberikan nilai untuk ujian ini
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <router-view v-else></router-view>

  <!-- Modal Lihat Nilai - Similar to DetailBimbingan implementation -->
  <DefaultModal
    v-if="showNilaiModal"
    @close="closeNilaiModal"
    headText="Nilai Ujian Tugas Akhir"
    :bodyText="modalBodyText"
  >
    <div>
      <div v-if="isSecretary" class="my-3">
        <p class="heading5 text-[#00A2EA] font-semibold mb-2">
          Status Kelulusan
        </p>
        <p class="body1 font-medium">{{ statusKelulusanText }}</p>
      </div>
      <div class="my-5">
        <p class="heading5 text-[#00A2EA] font-semibold mb-5">Nilai Ujian</p>
        <div class="flex flex-wrap gap-4">
          <div class="w-full sm:w-[calc(50%-0.5rem)]">
            <InputNumber
              id="tataLaporan"
              label="Kualitas Tata Laporan Tugas Akhir (15%)"
              placeholder="85"
              v-model="tataLaporan"
              disabled
            />
          </div>

          <div class="w-full sm:w-[calc(50%-0.5rem)]">
            <InputNumber
              id="kemampuanTeknis"
              label="Kemampuan Teknis (35%)"
              placeholder="90"
              v-model="kemampuanTeknis"
              disabled
            />
          </div>

          <div class="w-full sm:w-[calc(50%-0.5rem)]">
            <InputNumber
              id="hasilProduk"
              label="Kualitas Produk yang Dihasilkan (25%)"
              placeholder="88"
              v-model="hasilProduk"
              disabled
            />
          </div>

          <div class="w-full sm:w-[calc(50%-0.5rem)]">
            <InputNumber
              id="presentasi"
              label="Presentasi dan Question Handling (25%)"
              placeholder="92"
              v-model="presentasi"
              disabled
            />
          </div>
        </div>
        <div class="my-3">
          <p class="heading5 text-[#00A2EA] font-semibold mb-2">
            Nilai Rata-Rata
          </p>
          <p class="body1 font-bold text-xl">{{ totalNilai }}</p>
        </div>
      </div>
      <div class="my-5" v-if="catatanRevisi">
        <p class="heading5 text-[#00A2EA] font-semibold mb-5">Catatan Revisi</p>
        <InputTextarea
          id="catatanRevisi"
          label=""
          placeholder="Masukkan catatan revisi"
          v-model="catatanRevisi"
          disabled
        ></InputTextarea>
      </div>

      <!-- Add Edit Nilai button -->
      <div class="mt-6 flex justify-end">
        <Button
          @click="goToEditNilai"
          variant="secondary"
          size="md"
          class="w-fit"
        >
          Edit Nilai
        </Button>
      </div>
    </div>
  </DefaultModal>
</template>
