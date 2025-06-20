<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import QuillTextEditor from "@/components/Tugas-akhir/Forms/QuillTextEditor.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Loading from "@/components/Loading.vue";
// Updated import - using the combined function only
import { useUjianTAForDosen } from "@/services/TugasAkhir/Dosen/ujianTA.js";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Use the combined function and other utilities
const {
  submitNilaiDanStatus,
  loadingNilai: loading,
  errorNilai: error,
  detailUjian,
  loadingDetail,
  fetchDetailUjian,
} = useUjianTAForDosen();

// Data mahasiswa dari params dan detail ujian
const studentInfo = ref({
  nim: "",
  name: "",
  category: "",
  title: "",
});

// Inisialisasi nilai form
const statusKelulusan = ref("");
const tataLaporan = ref("");
const kemampuanTeknis = ref("");
const hasilProduk = ref("");
const presentasi = ref("");
const catatanRevisi = ref("");
const isEdit = ref(false);

// Total nilai computed property based on weighted average
const totalNilai = computed(() => {
  if (
    !tataLaporan.value ||
    !kemampuanTeknis.value ||
    !hasilProduk.value ||
    !presentasi.value
  ) {
    return "";
  }

  // Calculate weighted average based on percentages
  const total =
    parseFloat(tataLaporan.value) * 0.15 +
    parseFloat(kemampuanTeknis.value) * 0.35 +
    parseFloat(hasilProduk.value) * 0.25 +
    parseFloat(presentasi.value) * 0.25;

  return total.toFixed(2);
});

// Error tracking for validation
const errors = ref({
  statusKelulusan: false,
  tataLaporan: false,
  kemampuanTeknis: false,
  hasilProduk: false,
  presentasi: false,
  catatanRevisi: false,
});

// Track if form has been submitted at least once
const formSubmitted = ref(false);

// Check if current user is Secretary (can edit status kelulusan)
const isSecretary = computed(() => {
  if (!detailUjian.value) return false;
  // Cari dosen penguji yang sedang login
  const currentPenguji = detailUjian.value.dosen_penguji?.find(
    (penguji) => penguji.is_current_user === true
  );
  // Cek apakah jabatan penguji adalah sekretaris
  return currentPenguji?.jabatan_penguji?.toLowerCase() === "sekretaris";
});

// Computed property untuk mengontrol status disabled pada textarea catatan revisi
const isCatatanRevisiDisabled = computed(() => {
  return (
    statusKelulusan.value === "1" // Lulus tanpa revisi
  );
});

// Validate all required fields
const validateForm = () => {
  let isValid = true;

  // Reset errors
  errors.value = {
    statusKelulusan: false,
    tataLaporan: false,
    kemampuanTeknis: false,
    hasilProduk: false,
    presentasi: false,
    catatanRevisi: false,
  };

  // Check status kelulusan (only if secretary)
  if (isSecretary.value && !statusKelulusan.value) {
    errors.value.statusKelulusan = true;
    isValid = false;
  }

  // Check nilai fields - use explicit checks for empty string
  if (
    tataLaporan.value === "" ||
    tataLaporan.value === null ||
    tataLaporan.value === undefined ||
    isNaN(parseFloat(tataLaporan.value)) ||
    parseFloat(tataLaporan.value) < 0 ||
    parseFloat(tataLaporan.value) > 100
  ) {
    errors.value.tataLaporan = true;
    isValid = false;
  }

  if (
    kemampuanTeknis.value === "" ||
    kemampuanTeknis.value === null ||
    kemampuanTeknis.value === undefined ||
    isNaN(parseFloat(kemampuanTeknis.value)) ||
    parseFloat(kemampuanTeknis.value) < 0 ||
    parseFloat(kemampuanTeknis.value) > 100
  ) {
    errors.value.kemampuanTeknis = true;
    isValid = false;
  }

  if (
    hasilProduk.value === "" ||
    hasilProduk.value === null ||
    hasilProduk.value === undefined ||
    isNaN(parseFloat(hasilProduk.value)) ||
    parseFloat(hasilProduk.value) < 0 ||
    parseFloat(hasilProduk.value) > 100
  ) {
    errors.value.hasilProduk = true;
    isValid = false;
  }

  if (
    presentasi.value === "" ||
    presentasi.value === null ||
    presentasi.value === undefined ||
    isNaN(parseFloat(presentasi.value)) ||
    parseFloat(presentasi.value) < 0 ||
    parseFloat(presentasi.value) > 100
  ) {
    errors.value.presentasi = true;
    isValid = false;
  }

  // Only validate catatan revisi if it's enabled and required
  if (
    !isCatatanRevisiDisabled.value &&
    statusKelulusan.value === "2" && // Lulus dengan revisi
    (catatanRevisi.value === "" ||
      catatanRevisi.value === null ||
      catatanRevisi.value === undefined)
  ) {
    errors.value.catatanRevisi = true;
    isValid = false;
  }

  return isValid;
};

// Load data from API using route params
const loadData = async () => {
  const ujianTaId = route.params.ujian_ta_id;
  if (ujianTaId) {
    await fetchDetailUjian(ujianTaId);

    if (detailUjian.value) {
      studentInfo.value = {
        nim: detailUjian.value?.mahasiswa?.nim || "",
        name: detailUjian.value?.mahasiswa?.name || "",
        category: detailUjian.value?.kategori?.nama_kategori || "",
        title: detailUjian.value?.judul_tugas_akhir || "",
      };

      // Initialize status kelulusan for secretary regardless of edit mode
      if (isSecretary.value) {
        statusKelulusan.value =
          detailUjian.value?.status_kelulusan?.toString() || "";
      }
    }

    // Check if we're in edit mode - this query parameter is necessary
    isEdit.value = route.query.edit === "true";

    // If editing, pre-populate form with existing data
    if (isEdit.value && detailUjian.value) {
      // BUG FIX: Find the currently logged-in user's data, not the first one found.
      const currentDosenPenguji = detailUjian.value.dosen_penguji.find(
        (penguji) => penguji.is_current_user === true
      );

      // Check if the current user has existing grades
      if (currentDosenPenguji && currentDosenPenguji.nilai_ujian_ta) {
        const nilai = currentDosenPenguji.nilai_ujian_ta;
        tataLaporan.value = nilai?.kualitas_tata_laporan ?? "";
        kemampuanTeknis.value = nilai?.kemampuan_teknis ?? "";
        hasilProduk.value = nilai?.kualitas_produk ?? "";
        presentasi.value = nilai?.presentasi ?? "";
        catatanRevisi.value = nilai?.revisi ?? "";
      }
    }
  }
};

// Handle submit nilai
const handleSubmit = async () => {
  formSubmitted.value = true;

  // Validate form before submitting
  if (!validateForm()) {
    // Scroll to first error
    const firstErrorEl = document.querySelector(".error-text");
    if (firstErrorEl) {
      firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  // Create data object with all required fields
  const nilaiData = {
    tugas_akhir_id: detailUjian.value?.tugas_akhir_id,
    ujian_ta_id: detailUjian.value?.ujian_ta_id || null,
    tataLaporan: tataLaporan.value,
    kemampuanTeknis: kemampuanTeknis.value,
    hasilProduk: hasilProduk.value,
    presentasi: presentasi.value,
    totalNilai: totalNilai.value,
    catatanRevisi: catatanRevisi.value,
  };

  // Add statusKelulusan if user is secretary
  if (isSecretary.value && statusKelulusan.value) {
    nilaiData.statusKelulusan = statusKelulusan.value;
  }

  // Submit nilai and status in one call
  const result = await submitNilaiDanStatus(nilaiData, isEdit.value);

  if (!error.value) {
    // Return to detail page with success parameter
    router.push({
      name: "DetailUjianTAforDosen",
      params: { ujian_ta_id: detailUjian.value?.ujian_ta_id },
      query: {
        success: "true",
        action: isEdit.value ? "update" : "input",
        refresh: Date.now().toString(), // Add timestamp to force refresh
      },
    });
  }
};

// Add a function to reset validation errors when value changes
const resetValidationError = (field) => {
  if (formSubmitted.value && errors.value[field]) {
    errors.value[field] = false;
  }
};

// Watch for input changes to clear errors
watch(tataLaporan, () => resetValidationError("tataLaporan"));
watch(kemampuanTeknis, () => resetValidationError("kemampuanTeknis"));
watch(hasilProduk, () => resetValidationError("hasilProduk"));
watch(presentasi, () => resetValidationError("presentasi"));
watch(catatanRevisi, () => resetValidationError("catatanRevisi"));
watch(statusKelulusan, () => resetValidationError("statusKelulusan"));
watch(error, (newError) => {
  if (newError) {
    toast.error(newError);
  }
});

// Load data when component is mounted
onMounted(() => {
  loadData();
});
</script>
<template>
  <div
    v-if="loading || loadingDetail"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>

  <div v-else>
    <Breadcrumb />
    <div class="p-6 bg-white card-rounded lg:p-8">
      <!-- Header Section -->
      <div class="mb-6">
        <h4 class="font-semibold heading4">Input Nilai Ujian Tugas Akhir</h4>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <p class="body4-bold text-black/70">{{ studentInfo.name }}</p>
          <p class="body4-bold text-black/70 sm:border-l-2 sm:pl-2">
            {{ studentInfo.nim }}
          </p>
          <p class="body4-bold text-black/70 sm:border-l-2 sm:pl-2">
            {{ studentInfo.title }}
          </p>
        </div>
      </div>

      <!-- Form Section -->
      <div>
        <!-- Status Kelulusan (only visible to secretary) -->
        <div v-if="isSecretary" class="my-5">
          <p class="heading5 text-[#00A2EA] font-semibold mb-3">
            Status Kelulusan <span class="text-red-500">*</span>
          </p>
          <div class="flex flex-col w-full sm:flex-row sm:justify-between">
            <div class="flex items-center mb-3 sm:mb-0 sm:flex-1">
              <div class="relative inline-flex items-center">
                <input
                  type="radio"
                  id="lulusTanpaRevisi"
                  name="statusKelulusan"
                  value="1"
                  v-model="statusKelulusan"
                  class="w-7 h-7 cursor-pointer appearance-none border-2 border-gray-300 rounded-full checked:border-[#00B69B] checked:bg-[#00B69B] focus:outline-none"
                />
                <svg
                  v-if="statusKelulusan === '1'"
                  class="absolute w-4 h-4 text-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none left-1/2 top-1/2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <label
                for="lulusTanpaRevisi"
                class="ml-2 text-gray-700 body3-bold"
                >Lulus tanpa revisi</label
              >
            </div>

            <div class="flex items-center mb-3 sm:mb-0 sm:flex-1">
              <div class="relative inline-flex items-center">
                <input
                  type="radio"
                  id="lulusDenganRevisi"
                  name="statusKelulusan"
                  value="2"
                  v-model="statusKelulusan"
                  class="w-7 h-7 cursor-pointer appearance-none border-2 border-gray-300 rounded-full checked:border-[#00B69B] checked:bg-[#00B69B] focus:outline-none"
                />
                <svg
                  v-if="statusKelulusan === '2'"
                  class="absolute w-4 h-4 text-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none left-1/2 top-1/2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <label
                for="lulusDenganRevisi"
                class="ml-2 text-gray-700 body3-bold"
                >Lulus dengan revisi</label
              >
            </div>

            <div class="flex items-center mb-3 sm:mb-0 sm:flex-1">
              <div class="relative inline-flex items-center">
                <input
                  type="radio"
                  id="belumLulus"
                  name="statusKelulusan"
                  value="3"
                  v-model="statusKelulusan"
                  class="w-7 h-7 cursor-pointer appearance-none border-2 border-gray-300 rounded-full checked:border-[#00B69B] checked:bg-[#00B69B] focus:outline-none"
                />
                <svg
                  v-if="statusKelulusan === '3'"
                  class="absolute w-4 h-4 text-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none left-1/2 top-1/2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <label for="belumLulus" class="ml-2 text-gray-700 body3-bold"
                >Belum lulus perlu diuji lagi</label
              >
            </div>

            <div class="flex items-center sm:flex-1">
              <div class="relative inline-flex items-center">
                <input
                  type="radio"
                  id="tidakLulus"
                  name="statusKelulusan"
                  value="4"
                  v-model="statusKelulusan"
                  class="w-7 h-7 cursor-pointer appearance-none border-2 border-gray-300 rounded-full checked:border-[#00B69B] checked:bg-[#00B69B] focus:outline-none"
                />
                <svg
                  v-if="statusKelulusan === '4'"
                  class="absolute w-4 h-4 text-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none left-1/2 top-1/2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <label for="tidakLulus" class="ml-2 text-gray-700 body3-bold"
                >Tidak lulus</label
              >
            </div>
          </div>
          <p
            v-if="formSubmitted && errors.statusKelulusan"
            class="mt-2 text-red-500 error-text"
          >
            Status kelulusan wajib dipilih
          </p>
        </div>

        <div class="my-5">
          <p class="heading5 text-[#00A2EA] font-semibold mb-5">
            Nilai Ujian <span class="text-red-500">*</span>
          </p>
          <div class="flex flex-wrap gap-4">
            <div class="w-full sm:w-[calc(50%-0.5rem)]">
              <InputText
                type="number"
                id="tataLaporan"
                label="Kualitas Tata Laporan Tugas Akhir(15%)"
                placeholder="Masukkan nilai tata laporan"
                v-model="tataLaporan"
                :class="{
                  'border-red-500': formSubmitted && errors.tataLaporan,
                }"
                required
              />
              <p
                v-if="formSubmitted && errors.tataLaporan"
                class="mt-1 text-red-500 error-text"
              >
                Nilai tata laporan wajib diisi (0-100)
              </p>
            </div>

            <div class="w-full sm:w-[calc(50%-0.5rem)]">
              <InputText
                type="number"
                id="kemampuanTeknis"
                label="Kemampuan Teknis (35%)"
                placeholder="Masukkan nilai kemampuan teknis"
                v-model="kemampuanTeknis"
                :class="{
                  'border-red-500': formSubmitted && errors.kemampuanTeknis,
                }"
                required
              />
              <p
                v-if="formSubmitted && errors.kemampuanTeknis"
                class="mt-1 text-red-500 error-text"
              >
                Nilai kemampuan teknis wajib diisi (0-100)
              </p>
            </div>

            <div class="w-full sm:w-[calc(50%-0.5rem)]">
              <InputText
                type="number"
                id="hasilProduk"
                label="Kualitas Produk yang Dihasilkan (25%)"
                placeholder="Masukkan nilai hasil produk"
                v-model="hasilProduk"
                :class="{
                  'border-red-500': formSubmitted && errors.hasilProduk,
                }"
                required
              />
              <p
                v-if="formSubmitted && errors.hasilProduk"
                class="mt-1 text-red-500 error-text"
              >
                Nilai hasil produk wajib diisi (0-100)
              </p>
            </div>

            <div class="w-full sm:w-[calc(50%-0.5rem)]">
              <InputText
                type="number"
                id="presentasi"
                label="Presentasi dan Question Handling (25%)"
                placeholder="Masukkan nilai presentasi"
                v-model="presentasi"
                :class="{
                  'border-red-500': formSubmitted && errors.presentasi,
                }"
                required
              />
              <p
                v-if="formSubmitted && errors.presentasi"
                class="mt-1 text-red-500 error-text"
              >
                Nilai presentasi wajib diisi (0-100)
              </p>
            </div>
            <!-- Show calculated total -->
            <div class="w-full">
              <InputText
                id="rerataValue"
                label="Nilai Akhir"
                :modelValue="totalNilai"
                disabled
                class="font-semibold"
              />
              <p class="mt-1 text-sm text-gray-500">
                Nilai Akhir dihitung otomatis berdasarkan bobot
              </p>
            </div>
          </div>
        </div>

        <div class="my-5" :class="{ 'opacity-50': isCatatanRevisiDisabled }">
          <p class="heading5 text-[#00A2EA] font-semibold mb-5">
            Catatan Revisi
            <span
              v-if="
                !isCatatanRevisiDisabled &&
                (statusKelulusan === '2' ||
                  statusKelulusan === '3' ||
                  statusKelulusan === '4')
              "
              class="text-red-500"
              >*</span
            >
          </p>
          <QuillTextEditor
            id="catatanRevisi"
            label="Catatan Revisi"
            v-model="catatanRevisi"
            :disabled="isCatatanRevisiDisabled"
          />

          <p
            v-if="formSubmitted && errors.catatanRevisi"
            class="mt-1 text-red-500 error-text"
          >
            Catatan revisi wajib diisi
          </p>
        </div>
      </div>

      <!-- Button Section -->
      <div class="flex justify-end w-full mt-6">
        <Button
          variant="primary"
          size="lg"
          @click="handleSubmit"
          :disabled="loading"
        >
          {{ isEdit ? "Update Nilai" : "Simpan Nilai" }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Beberapa browser mungkin masih menampilkan tampilan default dari radio button */
/* Kode ini memastikan tampilan radio button kustom di semua browser */
input[type="radio"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-clip: content-box;
}

/* Hover state */
input[type="radio"]:hover {
  border-color: #00b69b;
}

/* Focus state */
input[type="radio"]:focus {
  border-color: #00b69b;
  box-shadow: 0 0 0 2px rgba(0, 182, 155, 0.2);
}

/* Add smooth transition for opacity changes */
.my-5 {
  transition: opacity 0.3s ease;
}

/* Add styles for required field indicator */
.required::after {
  content: "*";
  color: #ff0000;
  margin-left: 2px;
}

/* Add validation styling */
.error-text {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
