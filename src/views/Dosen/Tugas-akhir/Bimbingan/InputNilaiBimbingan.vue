<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import QuillTextEditor from "@/components/Tugas-akhir/Forms/QuillTextEditor.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useNilaiBimbingan } from "@/services/TugasAkhir/Dosen/bimbingan";

const route = useRoute();
const router = useRouter();

// Inisialisasi layanan nilai bimbingan
const {
  nilaiBimbingan,
  loading,
  error,
  success,
  fetchNilaiBimbingan,
  saveNilaiBimbingan,
} = useNilaiBimbingan();

// Data mahasiswa dari parameter route
const studentInfo = ref({
  id: "",
  nim: "",
  name: "",
  category: "",
  title: "",
});

// Inisialisasi nilai form
const disiplin = ref("");
const komunikasi = ref("");
const pengetahuan = ref("");
const tingkahLaku = ref("");
const catatanAkhir = ref("");

// Computed property untuk nilai rata-rata berdasarkan rumus pembobotan
const rerataValue = computed(() => {
  // Cek apakah semua nilai sudah diisi
  if (
    disiplin.value === "" ||
    komunikasi.value === "" ||
    pengetahuan.value === "" ||
    tingkahLaku.value === ""
  ) {
    return "";
  }

  // Konversi ke angka dan terapkan bobot
  const d = parseFloat(disiplin.value) * 0.2; // 20%
  const k = parseFloat(komunikasi.value) * 0.2; // 20%
  const p = parseFloat(pengetahuan.value) * 0.45; // 45%
  const t = parseFloat(tingkahLaku.value) * 0.15; // 15%

  // Hitung rata-rata tertimbang dan bulatkan ke 2 desimal
  const average = d + k + p + t;
  return average.toFixed(2);
});

// Pelacakan error untuk validasi
const errors = ref({
  disiplin: false,
  komunikasi: false,
  pengetahuan: false,
  tingkahLaku: false,
});

// Pesan feedback
const submissionStatus = ref({
  success: false,
  message: "",
  isSubmitting: false,
});

// Pelacakan apakah form sudah pernah disubmit
const formSubmitted = ref(false);

// Validasi semua field yang wajib diisi
const validateForm = () => {
  let isValid = true;

  // Reset errors
  errors.value = {
    disiplin: false,
    komunikasi: false,
    pengetahuan: false,
    tingkahLaku: false,
  };

  // Cek field nilai - gunakan pengecekan eksplisit untuk string kosong
  if (
    disiplin.value === "" ||
    disiplin.value === null ||
    disiplin.value === undefined
  ) {
    errors.value.disiplin = true;
    isValid = false;
  }

  if (
    komunikasi.value === "" ||
    komunikasi.value === null ||
    komunikasi.value === undefined
  ) {
    errors.value.komunikasi = true;
    isValid = false;
  }

  if (
    pengetahuan.value === "" ||
    pengetahuan.value === null ||
    pengetahuan.value === undefined
  ) {
    errors.value.pengetahuan = true;
    isValid = false;
  }

  if (
    tingkahLaku.value === "" ||
    tingkahLaku.value === null ||
    tingkahLaku.value === undefined
  ) {
    errors.value.tingkahLaku = true;
    isValid = false;
  }

  return isValid;
};

// Muat nilai yang sudah ada jika tersedia
const loadNilaiBimbingan = async (tugasAkhirId) => {
  try {
    const data = await fetchNilaiBimbingan(tugasAkhirId);

    // Jika data ada, isi form
    if (data && data.data) {
      disiplin.value = data.data.disiplin;
      komunikasi.value = data.data.komunikasi;
      pengetahuan.value = data.data.skill_pengetahuan;
      tingkahLaku.value = data.data.tingkah_laku;
      catatanAkhir.value = data.data.catatan_akhir_bimbingan || "";
    }
  } catch (err) {
    console.error("Error loading nilai bimbingan:", err);
    // 404 diharapkan jika nilai belum ada, jangan tampilkan error
    if (err.response?.status !== 404) {
      submissionStatus.value = {
        success: false,
        message:
          "Gagal memuat data nilai bimbingan: " +
          (err.response?.data?.message || err.message),
      };
    }
  }
};

// Ambil data dari parameter route dan muat nilai jika ada
onMounted(() => {
  const id = route.params.tugas_akhir_id;

  console.log("Nilai bimbingan route params:", route.params);

  if (id) {
    // Fetch student info using the ID
    fetchStudentInfo(id);
    loadNilaiBimbingan(id);
  }
});

// Function to fetch student info from API
const fetchStudentInfo = async (id) => {
  try {
    // Here you would make an API call to get the student details
    // For now, we'll just set the ID
    studentInfo.value.id = id;

    // Note: In a real implementation, you would fetch the student's details
    // and update studentInfo.value with the response data
  } catch (err) {
    console.error("Error fetching student info:", err);
  }
};

// Tangani submit nilai
const handleSubmit = async () => {
  formSubmitted.value = true;

  // Validasi form sebelum submit
  if (!validateForm()) {
    // Scroll ke error pertama
    const firstErrorEl = document.querySelector(".error-text");
    if (firstErrorEl) {
      firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  // Cegah double submission
  if (submissionStatus.value.isSubmitting) {
    return;
  }

  submissionStatus.value.isSubmitting = true;

  try {
    // Siapkan data sesuai kebutuhan API
    const nilaiData = {
      disiplin: parseFloat(disiplin.value),
      komunikasi: parseFloat(komunikasi.value),
      skill_pengetahuan: parseFloat(pengetahuan.value),
      tingkah_laku: parseFloat(tingkahLaku.value),
      rerata_bimbingan: parseFloat(rerataValue.value),
      catatan_akhir_bimbingan: catatanAkhir.value || "",
    };

    console.log("Submitting nilai:", nilaiData);

    // Panggil API untuk menyimpan nilai
    const response = await saveNilaiBimbingan(studentInfo.value.id, nilaiData);

    // Tampilkan pesan sukses
    submissionStatus.value = {
      success: true,
      message: "Nilai bimbingan berhasil disimpan!",
      isSubmitting: false,
    };

    router.push({
      name: "DetailBimbinganforDosen",
      params: { tugas_akhir_id: studentInfo.value.id },
    });
  } catch (err) {
    console.error("Error saving nilai:", err);
    submissionStatus.value = {
      success: false,
      message:
        "Gagal menyimpan nilai: " +
        (err.response?.data?.message || err.message),
      isSubmitting: false,
    };

    // Scroll ke pesan error
    setTimeout(() => {
      const alertEl = document.querySelector(".alert-error");
      if (alertEl) {
        alertEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }
};

// Fungsi untuk mereset error validasi saat nilai berubah
const resetValidationError = (field) => {
  if (formSubmitted.value && errors.value[field]) {
    errors.value[field] = false;
  }
};

// Watch untuk perubahan input untuk menghapus error
watch(disiplin, () => resetValidationError("disiplin"));
watch(komunikasi, () => resetValidationError("komunikasi"));
watch(pengetahuan, () => resetValidationError("pengetahuan"));
watch(tingkahLaku, () => resetValidationError("tingkahLaku"));

// Reset pesan error ketika mencoba lagi
const resetErrorMessage = () => {
  submissionStatus.value.message = "";
};
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center min-h-[80dvh]">
    <Loading />
  </div>

  <!-- Konten utama -->
  <div v-else>
    <Breadcrumb :items="breadcrumbItems" />
    <div class="p-6 bg-white card-rounded lg:p-8">
      <!-- Bagian Header -->
      <div class="mb-6">
        <h4 class="font-semibold heading4">Input Nilai Bimbingan</h4>
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

      <!-- Bagian Form -->
      <div class="flex flex-wrap gap-4">
        <div class="w-full sm:w-[calc(50%-0.5rem)]">
          <InputText
            type="number"
            id="disiplin"
            label="Disiplin (20%)"
            placeholder="Masukkan nilai kedisiplinan"
            v-model="disiplin"
            :class="{ 'border-red-500': formSubmitted && errors.disiplin }"
            required
          />
          <p
            v-if="formSubmitted && errors.disiplin"
            class="mt-1 text-red-500 error-text"
          >
            Nilai disiplin wajib diisi
          </p>
        </div>

        <div class="w-full sm:w-[calc(50%-0.5rem)]">
          <InputText
            type="number"
            id="komunikasi"
            label="Komunikasi (20%)"
            placeholder="Masukkan nilai komunikasi"
            v-model="komunikasi"
            :class="{ 'border-red-500': formSubmitted && errors.komunikasi }"
            required
          />
          <p
            v-if="formSubmitted && errors.komunikasi"
            class="mt-1 text-red-500 error-text"
          >
            Nilai komunikasi wajib diisi
          </p>
        </div>

        <div class="w-full sm:w-[calc(50%-0.5rem)]">
          <InputText
            type="number"
            id="pengetahuan"
            label="Skill / Pengetahuan (45%)"
            placeholder="Masukkan nilai pengetahuan"
            v-model="pengetahuan"
            :class="{ 'border-red-500': formSubmitted && errors.pengetahuan }"
            required
          />
          <p
            v-if="formSubmitted && errors.pengetahuan"
            class="mt-1 text-red-500 error-text"
          >
            Nilai pengetahuan wajib diisi
          </p>
        </div>

        <div class="w-full sm:w-[calc(50%-0.5rem)]">
          <InputText
            type="number"
            id="tingkahLaku"
            label="Tingkah Laku (15%)"
            placeholder="Masukkan nilai tingkah laku"
            v-model="tingkahLaku"
            :class="{ 'border-red-500': formSubmitted && errors.tingkahLaku }"
            required
          />
          <p
            v-if="formSubmitted && errors.tingkahLaku"
            class="mt-1 text-red-500 error-text"
          >
            Nilai tingkah laku wajib diisi
          </p>
        </div>

        <!-- Rata-rata yang dihitung (Hanya baca) -->
        <div class="w-full">
          <InputText
            id="rerataValue"
            label="Nilai Rata-Rata"
            :modelValue="rerataValue"
            disabled
            class="font-semibold"
          />
          <p class="mt-1 text-sm text-gray-500">
            Nilai rata-rata dihitung otomatis berdasarkan bobot
          </p>
        </div>

        <!-- Catatan Akhir Bimbingan -->
        <div class="w-full mt-2">
          <QuillTextEditor
            id="catatanAkhir"
            label="Catatan Akhir Bimbingan"
            v-model="catatanAkhir"
          />
        </div>
      </div>

      <!-- Bagian Tombol -->
      <div class="flex justify-end w-full mt-6">
        <Button
          variant="primary"
          size="lg"
          @click="handleSubmit"
          :disabled="submissionStatus.isSubmitting"
        >
          <span v-if="submissionStatus.isSubmitting">Menyimpan...</span>
          <span v-else>Simpan Nilai</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add validation styling */
.error-text {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Add styles for required field indicator */
.required::after {
  content: "*";
  color: #ff0000;
  margin-left: 2px;
}
</style>
