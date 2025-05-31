<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import InputNumber from "@/components/Tugas-akhir/Forms/InputNumber.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useNilaiBimbingan } from "@/services/TugasAkhir/Dosen/nilaiBimbingan";

const route = useRoute();
const router = useRouter();

// Inisialisasi layanan nilai bimbingan
const { 
  nilaiBimbingan, 
  loading, 
  error, 
  success, 
  fetchNilaiBimbingan, 
  saveNilaiBimbingan 
} = useNilaiBimbingan();

// Data mahasiswa dari parameter query
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
  isSubmitting: false
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
        message: "Gagal memuat data nilai bimbingan: " + (err.response?.data?.message || err.message)
      };
    }
  }
};

// Ambil data dari parameter query dan muat nilai jika ada
onMounted(() => {
  const id = route.query.id;
  const nim = route.query.nim;
  const name = route.query.name;
  const category = route.query.category;
  const title = route.query.title;

  console.log("Nilai bimbingan query params:", { id, nim, name, category, title });

  if (nim) {
    studentInfo.value = {
      id,
      nim,
      name,
      category,
      title,
    };
    
    // Jika ada ID, coba muat nilai yang sudah ada
    if (id) {
      loadNilaiBimbingan(id);
    }
  }
});

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
      catatan_akhir_bimbingan: catatanAkhir.value || ""
    };
    
    console.log("Submitting nilai:", nilaiData);
    
    // Panggil API untuk menyimpan nilai
    const response = await saveNilaiBimbingan(studentInfo.value.id, nilaiData);
    
    // Tampilkan pesan sukses
    submissionStatus.value = {
      success: true,
      message: "Nilai bimbingan berhasil disimpan!",
      isSubmitting: false
    };
    
    // Kembali ke halaman detail setelah delay singkat
    setTimeout(() => {
      router.push({
        path: "/dosen/tugas-akhir/bimbingan/detail-bimbingan",
        query: {
          id: studentInfo.value.id,
          nim: studentInfo.value.nim,
          name: studentInfo.value.name,
          category: studentInfo.value.category,
          title: studentInfo.value.title,
          _t: Date.now() 
        },
      });
    }, 1500);
    
  } catch (err) {
    console.error("Error saving nilai:", err);
    submissionStatus.value = {
      success: false,
      message: "Gagal menyimpan nilai: " + (err.response?.data?.message || err.message),
      isSubmitting: false
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
  <!-- Status loading -->
  <Loading v-if="loading" />
  
  <!-- Konten utama -->
  <div v-else class="card-rounded bg-white p-6 lg:p-8">
    <!-- Bagian Header -->
    <div class="mb-6">
      <h4 class="heading4 font-semibold">Input Nilai Bimbingan</h4>
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
    
    <!-- Alert Sukses/Error -->
    <div v-if="submissionStatus.message" class="mb-4">
      <div 
        v-if="submissionStatus.success" 
        class="p-4 bg-green-100 text-green-700 rounded-lg alert-success"
      >
        {{ submissionStatus.message }}
      </div>
      <div 
        v-else 
        class="p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center alert-error"
      >
        <span>{{ submissionStatus.message }}</span>
        <button 
          @click="resetErrorMessage" 
          class="text-red-700 hover:text-red-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Bagian Form -->
    <div class="flex flex-wrap gap-4">
      <div class="w-full sm:w-[calc(50%-0.5rem)]">
        <InputNumber
          id="disiplin"
          label="Disiplin (20%) *"
          placeholder="Masukkan nilai kedisiplinan"
          v-model="disiplin"
          :class="{ 'border-red-500': formSubmitted && errors.disiplin }"
          required
        />
        <p
          v-if="formSubmitted && errors.disiplin"
          class="text-red-500 mt-1 error-text"
        >
          Nilai disiplin wajib diisi
        </p>
      </div>

      <div class="w-full sm:w-[calc(50%-0.5rem)]">
        <InputNumber
          id="komunikasi"
          label="Komunikasi (20%) *"
          placeholder="Masukkan nilai komunikasi"
          v-model="komunikasi"
          :class="{ 'border-red-500': formSubmitted && errors.komunikasi }"
          required
        />
        <p
          v-if="formSubmitted && errors.komunikasi"
          class="text-red-500 mt-1 error-text"
        >
          Nilai komunikasi wajib diisi
        </p>
      </div>

      <div class="w-full sm:w-[calc(50%-0.5rem)]">
        <InputNumber
          id="pengetahuan"
          label="Skill / Pengetahuan (45%) *"
          placeholder="Masukkan nilai pengetahuan"
          v-model="pengetahuan"
          :class="{ 'border-red-500': formSubmitted && errors.pengetahuan }"
          required
        />
        <p
          v-if="formSubmitted && errors.pengetahuan"
          class="text-red-500 mt-1 error-text"
        >
          Nilai pengetahuan wajib diisi
        </p>
      </div>

      <div class="w-full sm:w-[calc(50%-0.5rem)]">
        <InputNumber
          id="tingkahLaku"
          label="Tingkah Laku (15%) *"
          placeholder="Masukkan nilai tingkah laku"
          v-model="tingkahLaku"
          :class="{ 'border-red-500': formSubmitted && errors.tingkahLaku }"
          required
        />
        <p
          v-if="formSubmitted && errors.tingkahLaku"
          class="text-red-500 mt-1 error-text"
        >
          Nilai tingkah laku wajib diisi
        </p>
      </div>
      
      <!-- Rata-rata yang dihitung (Hanya baca) -->
      <div class="w-full sm:w-[calc(50%-0.5rem)]">
        <InputNumber
          id="rerataValue"
          label="Nilai Rata-Rata"
          :modelValue="rerataValue"
          disabled
          class="font-semibold"
        />
        <p class="text-gray-500 mt-1 text-sm">
          Nilai rata-rata dihitung otomatis berdasarkan bobot
        </p>
      </div>
      
      <!-- Catatan Akhir Bimbingan -->
      <div class="w-full mt-2">
        <InputTextarea
          id="catatanAkhir"
          label="Catatan Akhir Bimbingan"
          placeholder="Masukkan catatan untuk mahasiswa bimbingan"
          v-model="catatanAkhir"
          rows="4"
        />
      </div>
    </div>

    <!-- Bagian Tombol -->
    <div class="flex justify-end w-full mt-6">
      <Button 
        variant="secondary" 
        size="lg" 
        class="mr-2"
        @click="router.go(-1)"
      >
        Kembali
      </Button>
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