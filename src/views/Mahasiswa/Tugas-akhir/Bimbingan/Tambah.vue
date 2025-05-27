<script setup>
import { ref, computed, onMounted } from 'vue';
import InputDate from '@/components/Tugas-akhir/Forms/InputDate.vue';
import InputDropdown from '@/components/Tugas-akhir/Forms/InputDropdown.vue';
import InputTextArea from '@/components/Tugas-akhir/Forms/InputTextarea.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'; // Tambahkan ini
import { useBimbingan } from '@/services/TugasAkhir/Mhs/bimbingan.js';

// ============================================
// STATE MANAGEMENT
// ============================================

// Inisialisasi router untuk navigasi
const router = useRouter();
const { fetchData, submitBimbingan } = useBimbingan(); // Jika ingin refresh setelah submit

// Form state
const today = ref(new Date().toISOString().split('T')[0]); // Format YYYY-MM-DD untuk hari ini
const bimbinganDate = ref(today.value); // Tanggal default untuk bimbingan
const selectedBAB = ref(''); // BAB yang dipilih
const catatan = ref(''); // Catatan bimbingan
const isSubmitting = ref(false); // Status submit form

// Service initialization
const toast = useToast(); // Tambahkan ini

// ============================================
// COMPUTED PROPERTIES
// ============================================

// Opsi BAB untuk dropdown
const babOptions = computed(() => [
  { value: '1', label: 'BAB I' },
  { value: '2', label: 'BAB II' },
  { value: '3', label: 'BAB III' },
  { value: '4', label: 'BAB IV' },
  { value: '5', label: 'BAB V' }
]);

// Validasi form
const isFormValid = computed(() => {
  return bimbinganDate.value && selectedBAB.value && catatan.value;
});

// ============================================
// METHODS
// ============================================

/**
 * Menangani submit form bimbingan
 * Menyimpan data bimbingan ke API dan kembali ke halaman bimbingan
 */
const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.error('Mohon lengkapi semua field yang diperlukan');
    return;
  }
  isSubmitting.value = true;
  try {
    const success = await submitBimbingan({
      tanggal_bimbingan: bimbinganDate.value,
      bab: selectedBAB.value,
      catatan: catatan.value
    });
    if (success) {
      // Optional: reset form
      // bimbinganDate.value = today.value;
      // selectedBAB.value = '';
      // catatan.value = '';
      router.push('/mahasiswa/tugas-akhir/bimbingan');
    }
  } catch (e) {
    toast.error('Terjadi kesalahan saat submit.');
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * Membatalkan input dan kembali ke halaman bimbingan
 */
const handleCancel = () => {
  router.push('/mahasiswa/tugas-akhir/bimbingan');
};

</script>

<template>
  <!-- Navigation Breadcrumb -->
  <Breadcrumb />

  <!-- Card Form Tambah Bimbingan -->
  <div class="p-4 bg-white card-rounded lg:p-8">
    <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
      <!-- Judul Form -->
      <h5 class="font-bold body2-bold sm:font-bold sm:body1-bold lg:heading5 xl:heading4">
        Tambah Bimbingan
      </h5>

      <!-- Form Bimbingan -->
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <!-- Input Tanggal Bimbingan -->
          <InputDate id="date-input" label="Tanggal Bimbingan" placeholder="Pilih tanggal bimbingan"
            v-model="bimbinganDate" :value="today" :max="today" required />

          <!-- Input BAB -->
          <InputDropdown id="bab-dropdown" label="BAB" :options="babOptions" placeholder="Pilih BAB yang dibahas"
            v-model="selectedBAB" required />

          <!-- Input Catatan -->
          <InputTextArea class="sm:col-span-2" id="catatan-input" label="Catatan Bimbingan"
            placeholder="Masukkan ringkasan hasil bimbingan atau progress yang dicapai" v-model="catatan" required />
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 mt-2">
          <!-- Submit Button -->
          <Button type="submit" variant="primary" size="lg" :disabled="!isFormValid || isSubmitting">
            {{ isSubmitting ? 'Mengirim...' : 'Kirim' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>