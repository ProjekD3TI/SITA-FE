<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import InputNumber from "@/components/Tugas-akhir/Forms/InputNumber.vue";
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
const disiplin = ref("");
const komunikasi = ref("");
const pengetahuan = ref("");
const tingkahLaku = ref("");

// Error tracking for validation
const errors = ref({
  disiplin: false,
  komunikasi: false,
  pengetahuan: false,
  tingkahLaku: false,
});

// Track if form has been submitted at least once
const formSubmitted = ref(false);

// Validate all required fields
const validateForm = () => {
  let isValid = true;

  // Reset errors
  errors.value = {
    disiplin: false,
    komunikasi: false,
    pengetahuan: false,
    tingkahLaku: false,
  };

  // Check nilai fields - use explicit checks for empty string
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
    nilai: {
      disiplin: disiplin.value,
      komunikasi: komunikasi.value,
      pengetahuan: pengetahuan.value,
      tingkahLaku: tingkahLaku.value,
    },
  });

  // Kembali ke halaman detail bimbingan
  router.push({
    path: "/dosen/tugas-akhir/bimbingan/detail-bimbingan",
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
watch(disiplin, () => resetValidationError("disiplin"));
watch(komunikasi, () => resetValidationError("komunikasi"));
watch(pengetahuan, () => resetValidationError("pengetahuan"));
watch(tingkahLaku, () => resetValidationError("tingkahLaku"));
</script>

<template>
  <div class="card-rounded bg-white p-6 lg:p-8">
    <!-- Header Section -->
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

    <!-- Form Section -->
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
