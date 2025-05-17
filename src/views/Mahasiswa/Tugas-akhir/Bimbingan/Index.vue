<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import InputText from '@/components/Tugas-akhir/Forms/InputText.vue';
import InputDropdown from '@/components/Tugas-akhir/Forms/InputDropdown.vue';
import UserData from '@/components/Tugas-akhir/UserData.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import StatusLabel from '@/components/Tugas-akhir/Label.vue';
import ProgressBarBAB from '@/components/Tugas-akhir/ProgressBarBAB.vue';
import Table from '@/components/Tugas-akhir/Table.vue';
import Loading from '@/components/Loading.vue';
import ErrorMsg from '@/components/ErrorMsg.vue';
import ModalTimer from '@/components/Tugas-akhir/Modals/ModalTimer.vue';

// Import services
import { mhsBimbingan } from '@/services/TugasAkhir/Mhs/bimbingan';
import { general } from '@/services/general';

// ============================================
// KONFIGURASI AWAL DAN STATE MANAGEMENT
// ============================================

// Variabel untuk input form
const selectedCategory = ref('');
const selectedPembimbing = ref('');
const showModal = ref(false);

// Tambahkan variabel untuk memantau status data
const isDataLoaded = ref(false);

// Opsi kategori tugas akhir
const categories = ref([
  { value: 'Internet of Thing', label: 'Internet of Things' },
  { value: 'Virtual Reality', label: 'Virtual Reality' },
  { value: 'Sistem Informasi', label: 'Sistem Informasi' },
  { value: 'Mobile App', label: 'Mobile App' },
  { value: 'Augmented Reality', label: 'Augmented Reality' },
]);

// ============================================
// SERVICE INITIALIZATION & API DATA
// ============================================

// Inisialisasi service untuk bimbingan
const { 
  bimbingan,         // Data bimbingan
  loading,           // Status loading
  error,             // Error message jika ada
  statusReqPembimbing, // Fungsi untuk mendapatkan status request pembimbing
  requestStatus,     // Data status request pembimbing
  checkActiveTA,     // Fungsi untuk memeriksa TA aktif
  activeTA           // Data TA aktif
} = mhsBimbingan();

// Inisialisasi service untuk data umum
const { 
  getDefaultTahunAjaran, // Fungsi untuk mendapatkan tahun ajaran
  tahunAjaran,         // Data tahun ajaran
  getAllDosen,         // Fungsi untuk mendapatkan semua dosen
  dosens               // Data dosen
} = general();

// ============================================
// COMPUTED PROPERTIES
// ============================================

// Mendapatkan data dosen yang dipilih
const selectedDosenData = computed(() => {
  if (!selectedPembimbing.value || !dosens.value || dosens.value.length === 0) {
    return null;
  }
  
  // Cari dosen berdasarkan ID (pastikan perbandingan sama tipe datanya)
  return dosens.value.find(dosen => 
    dosen.id.toString() === selectedPembimbing.value.toString()
  );
});

// Daftar pilihan dosen untuk dropdown
const pembimbings = computed(() => {
  if (!dosens.value || dosens.value.length === 0) {
    return [];
  }
  
  return dosens.value.map(dosen => ({
    value: dosen.id.toString(),
    label: `${dosen.name} (${dosen.nik})`
  }));
});

// Mendapatkan tahun ajaran default
const defaultTahunAjaran = computed(() => {
  return tahunAjaran.value?.tahun_ajaran;
});

// Status permintaan pembimbing dengan fallback
const statusRequestValue = computed(() => {
  if (!requestStatus.value) return 0; // Default ke 0 (menunggu) jika tidak ada response
  return requestStatus.value.status_request ?? 0;
});

// ID dosen pembimbing jika sudah ada
const dospemValue = computed(() => {
  return activeTA.value?.dosen_pembimbing_id; 
});

// Apakah memiliki TA aktif
const hasActiveTA = computed(() => {
  return activeTA.value ? activeTA.value.status_aktif === 1 : false;
});

// Apakah belum memiliki pembimbing
const noPembimbing = computed(() => {
  return dospemValue.value === null || dospemValue.value === undefined;
});

// Apakah sudah memiliki pembimbing
const hasPembimbing = computed(() => {
  return !noPembimbing.value;
});

// Status permintaan pembimbing
const waitingResponse = computed(() => statusRequestValue.value === 0);
const declined = computed(() => statusRequestValue.value === 2);

// Data bimbingan untuk tabel
const formattedBimbinganData = computed(() => {
  if (!bimbingan.value || bimbingan.value.length === 0) {
    return [];
  }
  
  // Format data bimbingan untuk ditampilkan di tabel
  return bimbingan.value.map((item, index) => {
    return {
      no: (index + 1).toString(),
      tanggal: formatDate(item.tanggal_bimbingan || item.created_at),
      bab: item.bab ? item.bab.toString() : '-',
      catatan: item.catatan || '-',
      status: item.status_verifikasi
    };
  });
});

// Bab tertinggi yang sudah diterima
const highestChapter = computed(() => {
  // Hanya ambil bimbingan yang sudah diterima
  const acceptedSubmissions = formattedBimbinganData.value.filter(item => item.status === 1);
  
  if (acceptedSubmissions.length === 0) {
    return 0;
  }
  
  // Ambil bab tertinggi
  const chapters = acceptedSubmissions.map(item => parseInt(item.bab, 10));
  return Math.max(...chapters);
});

// ============================================
// METHODS & HANDLERS
// ============================================

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

// Menampilkan modal konfirmasi
const openModal = () => {
  showModal.value = true;
};

// Menutup modal konfirmasi
const closeModal = () => {
  showModal.value = false;
};

// Handler untuk submit form
const handleSubmit = () => {
  console.log('Form submitted');
  // Implementasi logika kirim request pembimbing
};

// Handler untuk klik baris pada tabel
const handleRowClick = (item) => {
  console.log('Baris yang diklik:', item);
  // Implementasi detail bimbingan
};

// ============================================
// LIFECYCLE HOOKS
// ============================================

// Mengambil data saat komponen dimuat
onMounted(async () => {
  try {
    // Ambil semua data awal secara parallel
    await Promise.all([
      statusReqPembimbing().catch(err => {
        console.error('Error mengambil status request:', err);
        return null;
      }),
      checkActiveTA().catch(err => {
        console.error('Error mengambil TA aktif:', err);
        return null;
      }),
      getDefaultTahunAjaran().catch(err => {
        console.error('Error mengambil tahun ajaran:', err);
        return null;
      }),
      getAllDosen().catch(err => {
        console.error('Error mengambil data dosen:', err);
        return null;
      })
    ]);

    // Tandai bahwa data telah dimuat
    isDataLoaded.value = true;
  } catch (error) {
    console.error('Error saat memuat komponen:', error);
  }
});
</script>

<template>
  <div v-if="!isDataLoaded">
    <!-- Loading State -->
    <Loading />

  </div>
  <div v-else>
    <router-view v-if="$route.path.includes('tambah-bimbingan')"></router-view>

    <div v-else>
      <!-- Breadcrumb untuk navigasi -->
      <Breadcrumb :items="breadcrumbItems" />

      <!-- Error State -->
      <ErrorMsg v-if="error" :msg="error" />

      <!-- STATE 1: BELUM ADA TA AKTIF - FORM REQUEST PEMBIMBING -->
      <div v-else-if="!hasActiveTA && !hasPembimbing" class="card-rounded bg-white p-4 lg:p-8">
        <div class="flex flex-col gap-4 max-w-screen-2xl mx-auto">
          <h5 class="body3-bold sm:body2-bold lg:body1-bold">
            Anda belum memiliki pembimbing, silahkan pilih dosen untuk diminta menjadi pembimbing terlebih dahulu!
          </h5>
          
          <!-- Form Request Pembimbing -->
          <form class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Input Kategori -->
              <InputDropdown
                id="kategori-dropdown"
                label="Kategori Tugas Akhir"
                :options="categories"
                placeholder="Pilih kategori tugas akhir"
                v-model="selectedCategory"
              />
              
              <!-- Input Tahun Ajaran (Disabled) -->
              <InputText
                id="tahun-ajaran"
                label="Tahun Ajaran"
                placeholder="Tahun Ajaran"
                :value="defaultTahunAjaran"
                :disabled="true"
              />
              
              <!-- Input Dosen Pembimbing -->
              <InputDropdown
                class="sm:col-span-2"
                id="dosen-dropdown"
                label="Dosen Pembimbing"
                :options="pembimbings"
                placeholder="Pilih dosen pembimbing"
                v-model="selectedPembimbing"
              />
            </div>

            <!-- Preview Dosen Terpilih -->
            <div class="flex gap-2 sm:gap-4">
              <div v-if="selectedDosenData" class="flex gap-2 sm:gap-4">
                <!-- Icon Dosen -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                
                <!-- Informasi Dosen -->
                <div class="self-center">
                  <h5 class="body4-bold sm:body2-bold lg:body1-bold text-primary">{{ selectedDosenData.name }}</h5>
                  <span class="body5 lg:body4">{{ selectedDosenData.nik }} | D-3 Teknik Informatika</span>
                </div>
              </div>
            </div>

            <!-- Tombol Submit -->
            <Button
              class="w-fit self-end"
              type="button"
              variant="primary"
              size="lg"
              @click="openModal"
              :disabled="!selectedDosenData || !selectedCategory"
            >
              Kirim
            </Button>
          </form>
        </div>
        
        <!-- Modal Konfirmasi -->
        <ModalTimer
          v-if="showModal"
          @close="closeModal"
          @submit="handleSubmit"
          headText="Pastikan Dosen dan Kategori yang Dipilih Benar."
          bodyText="Anda tidak dapat merubah atau menghapus permintaan yang telah terkirim."
          submitText="Kirim"
          :showCancel="false"
          enableTimer="true"
          timerDuration="5"
        />
      </div>

      <!-- STATE 2: MENUNGGU RESPON DOSEN -->
      <div v-else-if="!hasPembimbing && waitingResponse" class="card-rounded bg-white p-4 lg:p-8">
        <div class="flex flex-col gap-4 max-w-screen-2xl mx-auto">
          <h5 class="body3-bold sm:body2-bold lg:body1-bold">
            Permintaan anda kepada dosen untuk menjadi pembimbing telah terkirim. Mohon tunggu untuk dosen merespon permintaan anda.
          </h5>
          
          <!-- Info Dosen & Status Request -->
          <UserData
            headText="Dosen Pembimbing"
            bodyText="Prof. Dr. Budi Santoso, M.Kom"
            headText2="Kategori TA"
            bodyText2="Internet of Things"
            :tahunAjaran="defaultTahunAjaran"
            :showStatus="true"
            status="warning"
            statusLabel="Menunggu"
          />
        </div>
      </div>

      <!-- STATE 3: REQUEST DITOLAK DOSEN -->
      <div v-else-if="!hasPembimbing && declined" class="card-rounded bg-white p-4 lg:p-8">
        <div class="flex flex-col gap-4 max-w-screen-2xl mx-auto">
          <h5 class="body3-bold sm:body2-bold lg:body1-bold">
            Mohon maaf dosen menolak permintaan anda, mohon tunggu admin untuk menentukan dosen pembimbing untuk anda.
          </h5>
          
          <!-- Info Dosen & Status Request -->
          <div class="flex gap-2 sm:gap-4">
            <!-- Icon Dosen -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            
            <!-- Detail Informasi -->
            <div class="self-center flex flex-wrap justify-between w-full">
              <!-- Dosen Pembimbing -->
              <div>
                <span class="body5 sm:body4-bold">Dosen Pembimbing</span>
                <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">John Batubara balbdlabw S.T., M.Info.Tech., Ph.D.</h5>
              </div>
              
              <!-- Kategori TA -->
              <div class="lg:border-l-2 border-black lg:pl-4">
                <span class="body5 sm:body5-bold">Kategori TA</span>
                <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">Internet Of Things</h5>
              </div>
              
              <!-- Tahun Ajaran -->
              <div>
                <span class="body5 sm:body4-bold">Tahun Ajaran</span>
                <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">2024/2025</h5>
              </div>
              
              <!-- Status Label -->
              <div class="text-center">
                <span class="body5 sm:body4-bold">Status</span>
                <StatusLabel
                  class="w-fit hidden lg:block"
                  status="danger"
                  size="md"
                  label="Ditolak"
                />
                <StatusLabel
                  class="w-fit lg:hidden block"
                  status="danger"
                  size="sm"
                  label="Ditolak"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STATE 4: PUNYA PEMBIMBING - TAMPILKAN DATA BIMBINGAN -->
      <div v-else-if="hasPembimbing">
        <!-- Header: Info Dosen & Progress BAB -->
        <div class="card-rounded bg-white p-6 lg:p-8">
          <!-- Info Dosen Pembimbing -->
          <div class="flex gap-2 sm:gap-4 max-w-screen-xl mx-auto">
            <!-- Icon Dosen -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            
            <!-- Detail Informasi -->
            <div class="self-center flex flex-wrap justify-between w-full">
              <!-- Dosen Pembimbing -->
              <div>
                <span class="body5 sm:body4-bold">Dosen Pembimbing</span>
                <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">John Batubara balbdlabw S.T., M.Info.Tech., Ph.D.</h5>
              </div>
              
              <!-- Kategori TA -->
              <div class="lg:border-l-2 border-black lg:pl-4">
                <span class="body5 sm:body5-bold">Kategori TA</span>
                <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">Internet Of Things</h5>
              </div>
              
              <!-- Tahun Ajaran -->
              <div>
                <span class="body5 sm:body4-bold">Tahun Ajaran</span>
                <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">{{ defaultTahunAjaran }}</h5>
              </div>
            </div>
          </div>
          
          <!-- Progress BAB & Tombol Tambah -->
          <div class="flex flex-wrap justify-between items-center max-w-screen-xl mx-auto">
            <!-- Progress Bar BAB -->
            <ProgressBarBAB
              class="sm:ms-3"
              :currentStep="highestChapter"
            />
            
            <!-- Tombol Tambah Bimbingan -->
            <router-link to="/mahasiswa/tugas-akhir/bimbingan/tambah-bimbingan">
              <!-- Desktop Button -->
              <Button
                class="hidden lg:flex"
                variant="primary"
                size="xl"
                left-icon-path="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
              >
                Tambah
              </Button>
              
              <!-- Mobile Button -->
              <Button
                class="lg:hidden"
                variant="primary"
                size="md"
                left-icon-path="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
              >
                Tambah
              </Button>
            </router-link>
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
              <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-l-lg">
                {{ item.no }}
              </td>
              
              <!-- Kolom Tanggal -->
              <td class="sm:py-3 py-3 sm:px-4 px-1">
                {{ item.tanggal }}
              </td>
              
              <!-- Kolom BAB -->
              <td class="sm:py-3 py-3 sm:px-4 px-1">
                {{ item.bab === '1' ? 'BAB I' : 
                  item.bab === '2' ? 'BAB II' : 
                  item.bab === '3' ? 'BAB III' : 
                  item.bab === '4' ? 'BAB IV' : 
                  item.bab === '5' ? 'BAB V' : 
                  'BAB ' + item.bab }}
              </td>
              
              <!-- Kolom Catatan -->
              <td class="py-3 px-1 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-3 sm:px-4">
                {{ item.catatan }}
              </td>
              
              <!-- Kolom Status -->
              <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-r-lg">
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
            </template>
          </Table>
        </div>
      </div>
    </div>
    
  </div>

</template>@/services/TugasAkhir/Dosen/Dosen/Mhs/bimbingan