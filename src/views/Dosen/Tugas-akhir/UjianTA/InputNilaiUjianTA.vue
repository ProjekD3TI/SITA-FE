<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import InputNumber from "@/components/Tugas-akhir/Forms/InputNumber.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import Button from "@/components/Tugas-akhir/Button.vue";

const route = useRoute();
const router = useRouter();

// Data mahasiswa dari query parameters
const studentInfo = ref({
  nim: "",
  name: "",
  category: "",
  title: "",
});

// Inisialisasi nilai form
const statusKelulusan = ref("");
const disiplin = ref("");
const komunikasi = ref("");
const pengetahuan = ref("");
const tingkahLaku = ref("");

// Tambahan variabel form yang diperlukan
const tataLaporan = ref("");
const kemampuanTeknis = ref("");
const hasilProduk = ref("");
const presentasi = ref("");
const catatanRevisi = ref("");

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

// Computed property untuk mengontrol status disabled pada textarea catatan revisi
const isCatatanRevisiDisabled = computed(() => {
  return (
    statusKelulusan.value === "Lulus tanpa revisi" ||
    statusKelulusan.value === "Tidak lulus"
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

  // Check status kelulusan
  if (!statusKelulusan.value) {
    errors.value.statusKelulusan = true;
    isValid = false;
  }

  // Check nilai fields - use explicit checks for empty string
  if (
    tataLaporan.value === "" ||
    tataLaporan.value === null ||
    tataLaporan.value === undefined
  ) {
    errors.value.tataLaporan = true;
    isValid = false;
  }

  if (
    kemampuanTeknis.value === "" ||
    kemampuanTeknis.value === null ||
    kemampuanTeknis.value === undefined
  ) {
    errors.value.kemampuanTeknis = true;
    isValid = false;
  }

  if (
    hasilProduk.value === "" ||
    hasilProduk.value === null ||
    hasilProduk.value === undefined
  ) {
    errors.value.hasilProduk = true;
    isValid = false;
  }

  if (
    presentasi.value === "" ||
    presentasi.value === null ||
    presentasi.value === undefined
  ) {
    errors.value.presentasi = true;
    isValid = false;
  }

  // Only validate catatan revisi if it's enabled
  if (
    !isCatatanRevisiDisabled.value &&
    (catatanRevisi.value === "" ||
      catatanRevisi.value === null ||
      catatanRevisi.value === undefined)
  ) {
    errors.value.catatanRevisi = true;
    isValid = false;
  }

  return isValid;
};

// Ambil data dari query parameters
onMounted(() => {
  const nim = route.query.nim;
  const name = route.query.name;
  const category = route.query.category;
  const title = route.query.title;

  console.log("Nilai bimbingan query params:", { nim, name, category, title });

  if (nim) {
    studentInfo.value = {
      nim,
      name,
      category,
      title,
    };
  }
});

// Handle submit nilai
const handleSubmit = () => {
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

  // Logic untuk submit nilai
  console.log("Submitting nilai:", {
    mahasiswa: studentInfo.value,
    statusKelulusan: statusKelulusan.value,
    nilai: {
      disiplin: disiplin.value,
      komunikasi: komunikasi.value,
      pengetahuan: pengetahuan.value,
      tingkahLaku: tingkahLaku.value,
      tataLaporan: tataLaporan.value,
      kemampuanTeknis: kemampuanTeknis.value,
      hasilProduk: hasilProduk.value,
      presentasi: presentasi.value,
    },
    catatanRevisi: catatanRevisi.value,
  });

  // Kembali ke halaman detail bimbingan
  router.push({
    path: "/dosen/tugas-akhir/ujian-ta/detail-ujian-ta",
    query: {
      nim: studentInfo.value.nim,
      name: studentInfo.value.name,
      category: studentInfo.value.category,
      title: studentInfo.value.title,
    },
  });
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
</script>
<template>
  <div class="card-rounded bg-white p-6 lg:p-8">
    <!-- Header Section -->
    <div class="mb-6">
      <h4 class="heading4 font-semibold">Input Nilai Ujian Tugas Akhir</h4>
      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
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
      <div class="my-5">
        <p class="heading5 text-[#00A2EA] font-semibold mb-3">
          Status Kelulusan <span class="text-red-500">*</span>
        </p>
        <div class="w-full flex flex-col sm:flex-row sm:justify-between">
          <div class="flex items-center mb-3 sm:mb-0 sm:flex-1">
            <div class="relative inline-flex items-center">
              <input
                type="radio"
                id="lulusTanpaRevisi"
                name="statusKelulusan"
                value="Lulus tanpa revisi"
                v-model="statusKelulusan"
                class="w-7 h-7 cursor-pointer appearance-none border-2 border-gray-300 rounded-full checked:border-[#00B69B] checked:bg-[#00B69B] focus:outline-none"
              />
              <svg
                v-if="statusKelulusan === 'Lulus tanpa revisi'"
                class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
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
            <label for="lulusTanpaRevisi" class="ml-2 body3-bold text-gray-700"
              >Lulus tanpa revisi</label
            >
          </div>

          <div class="flex items-center mb-3 sm:mb-0 sm:flex-1">
            <div class="relative inline-flex items-center">
              <input
                type="radio"
                id="lulusDenganRevisi"
                name="statusKelulusan"
                value="Lulus dengan revisi"
                v-model="statusKelulusan"
                class="w-7 h-7 cursor-pointer appearance-none border-2 border-gray-300 rounded-full checked:border-[#00B69B] checked:bg-[#00B69B] focus:outline-none"
              />
              <svg
                v-if="statusKelulusan === 'Lulus dengan revisi'"
                class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
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
            <label for="lulusDenganRevisi" class="ml-2 body3-bold text-gray-700"
              >Lulus dengan revisi</label
            >
          </div>

          <div class="flex items-center mb-3 sm:mb-0 sm:flex-1">
            <div class="relative inline-flex items-center">
              <input
                type="radio"
                id="belumLulus"
                name="statusKelulusan"
                value="Belum lulus perlu diuji lagi"
                v-model="statusKelulusan"
                class="w-7 h-7 cursor-pointer appearance-none border-2 border-gray-300 rounded-full checked:border-[#00B69B] checked:bg-[#00B69B] focus:outline-none"
              />
              <svg
                v-if="statusKelulusan === 'Belum lulus perlu diuji lagi'"
                class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
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
            <label for="belumLulus" class="ml-2 body3-bold text-gray-700"
              >Belum lulus perlu diuji lagi</label
            >
          </div>

          <div class="flex items-center sm:flex-1">
            <div class="relative inline-flex items-center">
              <input
                type="radio"
                id="tidakLulus"
                name="statusKelulusan"
                value="Tidak lulus"
                v-model="statusKelulusan"
                class="w-7 h-7 cursor-pointer appearance-none border-2 border-gray-300 rounded-full checked:border-[#00B69B] checked:bg-[#00B69B] focus:outline-none"
              />
              <svg
                v-if="statusKelulusan === 'Tidak lulus'"
                class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
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
            <label for="tidakLulus" class="ml-2 body3-bold text-gray-700"
              >Tidak lulus</label
            >
          </div>
        </div>
        <p
          v-if="formSubmitted && errors.statusKelulusan"
          class="text-red-500 mt-2 error-text"
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
            <InputNumber
              id="tataLaporan"
              label="Kualitas Tata Laporan Tugas Akhir(15%) *"
              placeholder="Masukkan nilai tata laporan"
              v-model="tataLaporan"
              :class="{ 'border-red-500': formSubmitted && errors.tataLaporan }"
              required
            />
            <p
              v-if="formSubmitted && errors.tataLaporan"
              class="text-red-500 mt-1 error-text"
            >
              Nilai tata laporan wajib diisi
            </p>
          </div>

          <div class="w-full sm:w-[calc(50%-0.5rem)]">
            <InputNumber
              id="kemampuanTeknis"
              label="KemampuanTeknis (35%) *"
              placeholder="Masukkan nilai kemampuan teknis"
              v-model="kemampuanTeknis"
              :class="{
                'border-red-500': formSubmitted && errors.kemampuanTeknis,
              }"
              required
            />
            <p
              v-if="formSubmitted && errors.kemampuanTeknis"
              class="text-red-500 mt-1 error-text"
            >
              Nilai kemampuan teknis wajib diisi
            </p>
          </div>

          <div class="w-full sm:w-[calc(50%-0.5rem)]">
            <InputNumber
              id="hasilProduk"
              label="Kualitas Produk yang Dihasilkan (25%) *"
              placeholder="Masukkan nilai hasil produk"
              v-model="hasilProduk"
              :class="{ 'border-red-500': formSubmitted && errors.hasilProduk }"
              required
            />
            <p
              v-if="formSubmitted && errors.hasilProduk"
              class="text-red-500 mt-1 error-text"
            >
              Nilai hasil produk wajib diisi
            </p>
          </div>

          <div class="w-full sm:w-[calc(50%-0.5rem)]">
            <InputNumber
              id="presentasi"
              label="Presentasi dan Question Handling (25%) *"
              placeholder="Masukkan nilai presentasi"
              v-model="presentasi"
              :class="{ 'border-red-500': formSubmitted && errors.presentasi }"
              required
            />
            <p
              v-if="formSubmitted && errors.presentasi"
              class="text-red-500 mt-1 error-text"
            >
              Nilai presentasi wajib diisi
            </p>
          </div>
        </div>
      </div>
      <div class="my-5" :class="{ 'opacity-50': isCatatanRevisiDisabled }">
        <p class="heading5 text-[#00A2EA] font-semibold mb-5">
          Catatan Revisi
          <span v-if="!isCatatanRevisiDisabled" class="text-red-500">*</span>
        </p>
        <InputTextarea
          id="catatanRevisi"
          label="Catatan Revisi"
          placeholder="Masukkan catatan revisi"
          v-model="catatanRevisi"
          :disabled="isCatatanRevisiDisabled"
          :class="{ 'border-red-500': formSubmitted && errors.catatanRevisi }"
          required
        ></InputTextarea>
        <p
          v-if="formSubmitted && errors.catatanRevisi"
          class="text-red-500 mt-1 error-text"
        >
          Catatan revisi wajib diisi
        </p>
      </div>
    </div>

    <!-- Button Section -->
    <div class="flex justify-end w-full mt-6">
      <Button variant="primary" size="lg" @click="handleSubmit">
        Simpan Nilai
      </Button>
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
