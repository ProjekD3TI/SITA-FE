<script setup>
import { ref, computed } from 'vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import Table from '@/components/Tugas-akhir/Table.vue';
import ProgressBarBAB from '@/components/Tugas-akhir/ProgressBarBAB.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import StatusLabel from '@/components/Tugas-akhir/Label.vue';
import UserData from '@/components/Tugas-akhir/UserData.vue';
import DefaultAvatar from '@/assets/images/Profile Avatar.svg';
import DefaultModal from '@/components/Tugas-akhir/Modals/DefaultModal.vue';
import InputText from '@/components/Tugas-akhir/Forms/InputText.vue';
import InputTextarea from '@/components/Tugas-akhir/Forms/InputTextarea.vue';
import Tooltip from '@/components/Tugas-akhir/Tooltip.vue';
import ModalDetailBimbingan from '@/components/Tugas-akhir/Modals/ModalDetailBimbingan.vue';
import Loading from '@/components/Loading.vue';
import ErrorMsg from '@/components/ErrorMsg.vue';

const loading = ref(false);
const error = ref(null);
const dinilai = ref(false);
const modalDetailRef = ref(null);
const showNilaiModal = ref(false);
const showBimbinganModal = ref(false);
const selectedBimbingan = ref(null);
const mahasiswa = {
  nim: '12345678',
  nama: 'John Doe',
  img: DefaultAvatar,
};
const tugas_akhir = {
  judul_proposal_ta: 'Sistem Informasi Akademik',
  kategori: 'Internet Of Things',
  dosen_pembimbing: 'Dr. Budi Santoso',
};
const nilai_bimbingan = {
  disiplin: 80,
  komunikasi: 85,
  skill: 90,
  tingkah_laku: 75,
  catatan: 'Mahasiswa sangat disiplin dan komunikatif.',
  rerata_bimbingan: 82.5,
};
const defaultTahunAjaran = ref('2023/2024');
const formattedBimbinganData = [
  {
    no: 1,
    tanggal: '2024-05-01',
    bab: 1,
    catatan: 'Revisi pendahuluan, perbaiki rumusan masalah.',
    status: 1, // Disetujui
  },
  {
    no: 2,
    tanggal: '2024-05-08',
    bab: 2,
    catatan: 'Tinjauan pustaka sudah baik, tambahkan referensi terbaru.',
    status: 1, // Menunggu
  },
  {
    no: 3,
    tanggal: '2024-05-15',
    bab: 3,
    catatan: 'Metodologi perlu penjelasan lebih detail.',
    status: 2, // Ditolak
  },
  {
    no: 4,
    tanggal: '2024-05-22',
    bab: 4,
    catatan: 'Analisis data sudah lengkap.',
    status: 1, // Disetujui
  },
  {
    no: 5,
    tanggal: '2024-05-29',
    bab: 5,
    catatan: 'Kesimpulan dan saran sudah sesuai.',
    status: 0, // Disetujui
  },
];
// Format tanggal dari YYYY-MM-DD menjadi DD MMM YYYY
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
// Mendapatkan kelas CSS untuk status
function getStatusClass(status) {
  if (status === 1) return 'success';
  if (status === 0) return 'warning';
  return 'danger';
}

// Mendapatkan label untuk status
function getStatusLabel(status) {
  if (status === 1) return 'Diterima';
  if (status === 0) return 'Menunggu';
  return 'Ditolak';
}
// Bab tertinggi yang sudah diterima
const highestChapter = computed(() => {
  // Hanya ambil bimbingan yang sudah diterima
  const acceptedSubmissions = formattedBimbinganData.filter(item => item.status === 1);
  
  if (acceptedSubmissions.length === 0) {
    return 0;
  }
  
  // Ambil bab tertinggi
  const chapters = acceptedSubmissions.map(item => parseInt(item.bab, 10));
  return Math.max(...chapters);
});
const buttonClasses = computed(() => {
  return dinilai.value ? 'opacity-100' : 'opacity-50';
});
const handleRowClick = (item) => {
  selectedBimbingan.value = item;
  modalDetailRef.value?.open();
};
function toRoman(num) {
  const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return romans[num - 1] || num;
}
</script>
<template>
    <Breadcrumb />
    <Loading v-if="loading" />
    <ErrorMsg v-else-if="error" :message="errorMessage" />
    <div v-else>
      <!-- Header: Info Dosen & Progress BAB -->
      <div class="card-rounded bg-white p-6 lg:p-8">
        <!-- Info Dosen Pembimbing -->
        <UserData
            class="max-w-screen-xl mx-auto mb-4"
            :headText="mahasiswa.nama"
            :bodyText="mahasiswa.nim"
            headText2="Dosen Pembimbing"
            :bodyText2="tugas_akhir.dosen_pembimbing"
            :headText3="tugas_akhir.kategori"
            :bodyText3="tugas_akhir.judul_proposal_ta"
            :tahunAjaran="defaultTahunAjaran"
        />

        <!-- Progress BAB & Tombol Tambah -->
        <div class="flex flex-col md:gap-8 md:flex-row justify-between items-center max-w-screen-xl mx-auto">
            <!-- Progress Bar BAB -->
            <ProgressBarBAB
            class="sm:ms-3"
            :currentStep="highestChapter"
            />
            
            <!-- Tombol Tambah Bimbingan -->
            <div class="flex gap-2 items-center w-full md:w-fit">
              <!-- Desktop Button -->
            <Tooltip v-if="!dinilai" text="Menunggu Dinilai" size="md" position="bottom">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="2" 
                stroke="currentColor" 
                class="w-6 h-6"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" 
                />
              </svg>
            </Tooltip>
              <Button
                  class="hidden lg:inline w-full"
                  :class="buttonClasses"
                  variant="success"
                  size="lg"
                  @click="showNilaiModal = true"
                  :disabled="!dinilai"
              >
                  Lihat Nilai
              </Button>
              
              <!-- Mobile Button -->
              <Button
                  class="lg:hidden w-full"
                  :class="buttonClasses"
                  variant="success"
                  size="md"
                  @click="showNilaiModal = true"
                  :disabled="!dinilai"
              >
                  Lihat Nilai
              </Button>
            </div>
        </div>
        </div>

        <!-- Tabel Riwayat Bimbingan -->
        <div class="card-rounded bg-white p-4 lg:p-8 mt-4">
        <Table
            :headers="['No', 'Tanggal','BAB', 'Catatan' , 'Status']"
            :items="formattedBimbinganData"
            @rowClick="handleRowClick"
        >
            <template #row="{ item }">
            <!-- Kolom No -->
            <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-l-lg border-r border-white">
                {{ item.no }}
            </td>
            
            <!-- Kolom Tanggal -->
            <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
                {{ formatDate(item.tanggal) }}
            </td>
            
            <!-- Kolom BAB -->
            <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
              BAB {{ toRoman(item.bab) }}
            </td>
            
            <!-- Kolom Catatan -->
            <td class="py-3 px-3 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-3 sm:px-6 border-r border-white">
                {{ item.catatan }}
            </td>
            
            <!-- Kolom Status -->
            <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-r-lg border-r border-white">
                <!-- Desktop Status -->
                <StatusLabel
                class="w-fit hidden lg:block "
                :status="getStatusClass(item.status)"
                size="md"
                :label="getStatusLabel(item.status)"
                />
                
                <!-- Mobile Status -->
                <StatusLabel
                class="w-fit lg:hidden block "
                :status="getStatusClass(item.status)"
                size="sm"
                :label="getStatusLabel(item.status)"
                />
            </td>
            </template>
        </Table>
        </div>

        <!-- Modal -->
        <DefaultModal
          v-if="showNilaiModal"
          headText="Nilai Bimbingan"
          bodyText="Nama Mahasiswa | V3423999 | Judul Tugas Akhir"
          @close="showNilaiModal = false"
        >
        <div class="flex flex-wrap gap-4">
          <InputText
            class="min-w-[300px] flex-grow"
            label="Disiplin (20%)"
            :value="nilai_bimbingan.disiplin"
            disabled="true"
          />
          <InputText
            class="min-w-[300px] flex-grow"
            label="Komunikasi (20%)"
            :value="nilai_bimbingan.komunikasi"
            disabled="true"
          />
          <InputText
            class="min-w-[300px] flex-grow"
            label="Skill / Pengetahuan (45%)"
            :value="nilai_bimbingan.skill"
            disabled="true"
          />
          <InputText
            class="min-w-[300px] flex-grow"
            label="Tingkah Laku (15%)"
            :value="nilai_bimbingan.tingkah_laku"
            disabled="true"
          />
          <InputTextarea
            label="Catatan"
            :modelValue="nilai_bimbingan.catatan"
            disabled="true"
          />
          <InputText
            class="flex-grow"
            label="Nilai rata-rata"
            :value="nilai_bimbingan.rerata_bimbingan"
            disabled="true"
          />
        </div>
          
        </DefaultModal>

        <ModalDetailBimbingan
          ref="modalDetailRef"
          v-if="selectedBimbingan"
          :bimbinganKe="selectedBimbingan.no"
          :tanggalBimbingan="formatDate(selectedBimbingan.tanggal)"
          :bab="toRoman(selectedBimbingan.bab)"
          :catatan="selectedBimbingan.catatan"
          :status="getStatusClass(selectedBimbingan.status)"
          :statusLabel="getStatusLabel(selectedBimbingan.status)"
          @close="showBimbinganModal = false"
        />
    </div>
</template>