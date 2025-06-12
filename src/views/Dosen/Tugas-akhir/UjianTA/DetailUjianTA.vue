<script setup>
import { ref, computed, onMounted, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { useToast } from "vue-toastification";

// Components
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import JadwalUjian from "@/components/Tugas-akhir/JadwalUjian.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Tooltip from "@/components/Tugas-akhir/Tooltip.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputNumber from "@/components/Tugas-akhir/Forms/InputNumber.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import Loading from "@/components/Loading.vue";

// Services
import {
  useUjianTAForDosen,
  getFileBlobUrl,
  fileNaskahTA,
} from "@/services/TugasAkhir/Dosen/ujianTA.js";

// Setup
const route = useRoute();
const toast = useToast();

// API data and loading states
const {
  detailUjian,
  loadingDetail: loading,
  errorDetail: error,
  fetchDetailUjian,
  refreshDetailUjian,
  dataBerkasTA,
} = useUjianTAForDosen();

// App State
const showNilaiModal = ref(false);
const pdfBlobUrl = ref(null);
const loadingPdf = ref(false);
const errorPdf = ref(null);

// ==================
// COMPUTED PROPERTIES
// ==================

// PDF handling - MOVED UP to avoid reference error
const pdfUrl = computed(() => {
  if (detailUjian.value?.berkas && detailUjian.value.berkas.length > 0) {
    return detailUjian.value.berkas[0].file_path;
  }
  return null;
});

// Check if current user is Secretary or Supervising Lecturer
const isSecretary = computed(() => {
  if (!detailUjian.value) return false;

  // Check if current user is a Secretary among the examiners
  const isSecretaryExaminer = detailUjian.value.dosen_penguji?.some(
    (penguji) => {
      // Use the explicit is_current_user flag from API
      const isCurrentUser = penguji.is_current_user === true;
      const isSecretary =
        penguji.jabatan_penguji?.toLowerCase() === "sekretaris";
      return isCurrentUser && isSecretary;
    }
  );

  // Check if current user is the supervising lecturer
  const isSupervisingLecturer =
    detailUjian.value.dosen_pembimbing?.dosen_pembimbing_id ===
    detailUjian.value.dosen_penguji?.find((p) => p.is_current_user === true)
      ?.dosen_penguji_id;

  return isSecretaryExaminer || isSupervisingLecturer;
});

// Get nilai status - check if current user has given grade
const hasGiven = computed(() => {
  if (!detailUjian.value) return false;

  // Find if current user has already given grades
  const currentDosenPenguji = detailUjian.value.dosen_penguji.find(
    (penguji) =>
      penguji.is_current_user === true && penguji.nilai_ujian_ta !== null
  );

  return !!currentDosenPenguji?.nilai_ujian_ta;
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
    (penguji) =>
      penguji.is_current_user === true && penguji.nilai_ujian_ta !== null
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
    (penguji) =>
      penguji.is_current_user === true && penguji.nilai_ujian_ta !== null
  );

  return currentDosenPenguji?.revisi || "";
});

// Computed for modal body text
const modalBodyText = computed(() => {
  return `${tugasAkhirDetails.value.nama} | ${tugasAkhirDetails.value.nim} | ${tugasAkhirDetails.value.judul}`;
});

// ==================
// WATCHERS
// ==================

// Watch for route parameter changes to load data
watch(
  () => route.params.tugas_akhir_id,
  (newTugasAkhirId) => {
    if (newTugasAkhirId) {
      fetchDetailUjian(newTugasAkhirId);
    }
  },
  { immediate: true }
);

// Watch for success query parameter to show toast notifications
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.success === "true") {
      const message =
        newQuery.action === "update"
          ? "Nilai berhasil diperbarui"
          : "Nilai berhasil disimpan";
      toast.success(message);

      // Check for refresh parameter to reload data
      if (newQuery.refresh) {
        refreshDetailUjian(route.params.tugas_akhir_id);
      }

      // Remove success param from URL to prevent showing toast on refresh
      const newRoute = {
        path: route.path,
        params: route.params,
      };
      router.replace(newRoute);
    }
  },
  { deep: true, immediate: true }
);

// Watch for PDF URL changes to load preview
watch(
  () => pdfUrl.value,
  (newPdfUrl) => {
    if (newPdfUrl) {
      loadPdfPreview();
    }
  },
  { immediate: true }
);

// ==================
// METHODS
// ==================

// PDF loading method
async function loadPdfPreview() {
  loadingPdf.value = true;
  errorPdf.value = null;
  try {
    if (fileNaskahTA.value) {
      console.log("Loading PDF preview for:", fileNaskahTA.value);
      pdfBlobUrl.value = await getFileBlobUrl(fileNaskahTA.value);
      console.log(
        "PDF blob URL created:",
        pdfBlobUrl.value ? "success" : "failed"
      );
    } else {
      console.log("No fileNaskahTA available");
    }
  } catch (err) {
    console.error("Error loading PDF:", err);
    errorPdf.value = "Gagal memuat file PDF";
  } finally {
    loadingPdf.value = false;
  }
}

// Modal methods
const openNilaiModal = () => {
  showNilaiModal.value = true;
};

const closeNilaiModal = () => {
  showNilaiModal.value = false;
};

// Navigation methods
const goToEditNilai = () => {
  closeNilaiModal();

  router.push({
    name: "InputNilaiUjianTAforDosen",
    params: {
      tugas_akhir_id: route.params.tugas_akhir_id,
    },
    query: {
      edit: "true",
    },
  });
};

// ==================
// LIFECYCLE HOOKS
// ==================

// Watch for fileNaskahTA changes to load PDF preview - matches student implementation
watchEffect(() => {
  if (detailUjian.value?.berkas) {
    // Map the berkas data structure to match what fileNaskahTA expects
    dataBerkasTA.value = {
      berkas: detailUjian.value.berkas.map((berkas) => ({
        nama_berkas: berkas.nama_berkas,
        download_url: berkas.download_url,
      })),
    };
    console.log("Updated dataBerkasTA:", dataBerkasTA.value);
  }
});

watchEffect(() => {
  if (fileNaskahTA.value) {
    console.log("fileNaskahTA changed, loading preview");
    loadPdfPreview();
  }
});

onMounted(() => {
  const tugasAkhirId = route.params.tugas_akhir_id;
  if (tugasAkhirId) {
    fetchDetailUjian(tugasAkhirId);
  }
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
      @click="fetchDetailUjian(route.params.tugas_akhir_id)"
      variant="outlined"
      size="sm"
      class="mt-2"
    >
      Coba Lagi
    </Button>
  </div>

  <div v-else-if="!$route.path.includes('input-nilai-ujian-ta') && detailUjian">
    <Breadcrumb />
    <!-- Jadwal Section -->
    <div class="card-rounded bg-white p-6 lg:p-8 shadow-custom">
      <div class="max-w-screen-2xl mx-auto">
        <JadwalUjian :examiners="examiners" :jadwal="schedule" />
      </div>
    </div>

    <!-- Tugas Akhir Details Section -->
    <div class="card-rounded bg-white p-6 lg:p-8 mt-6 shadow-custom">
      <div class="max-w-screen-2xl mx-auto">
        <div class="flex flex-col md:flex-row">
          <!-- PDF Preview (Left Side) -->
          <div class="order-last basis-7/12 md:pe-8 md:order-first">
            <div v-if="loadingPdf" class="py-8 text-center">Memuat file...</div>
            <div v-else-if="errorPdf" class="py-8 text-center text-red-500">
              {{ errorPdf }}
            </div>
            <object
              v-else-if="pdfBlobUrl"
              :data="pdfBlobUrl"
              type="application/pdf"
              class="w-full h-[750px] mt-6 md:mt-0"
            >
              <p class="p-4 text-center">
                Browser Anda tidak mendukung tampilan PDF.
                <a :href="pdfBlobUrl" target="_blank" class="text-primary"
                  >Klik di sini</a
                >
                untuk membuka PDF.
              </p>
            </object>
            <div v-else class="py-8 text-center">
              Tidak ada file naskah untuk ditampilkan.
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

            <!-- Action Buttons - Modified to use route params -->
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
                <template v-else>
                  <router-link
                    :to="{
                      name: 'InputNilaiUjianTAforDosen',
                      params: {
                        tugas_akhir_id: $route.params.tugas_akhir_id,
                      },
                    }"
                    class="sm:block hidden"
                  >
                    <Button variant="primary" size="lg" class="w-fit">
                      Input Nilai
                    </Button>
                  </router-link>

                  <router-link
                    :to="{
                      name: 'InputNilaiUjianTAforDosen',
                      params: {
                        tugas_akhir_id: $route.params.tugas_akhir_id,
                      },
                    }"
                    class="sm:hidden block"
                  >
                    <Button variant="primary" size="md" class="w-fit">
                      Input Nilai
                    </Button>
                  </router-link>
                </template>
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

  <!-- Modal Lihat Nilai -->
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
