<script setup>
import { ref, computed, onMounted } from 'vue';
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
import {
  useBimbingan,
  useRequestPembimbing,
  getStatusClass,
  getStatusLabel,
  defaultTahunAjaran,
  hasActiveTA,
  hasPembimbing,
  waitingResponse,
  declined,
  namaDosenRequestPembimbing,
  kategoriTA,
  tahunAjaranTA,
  pembimbings,
  selectedDosenData,
  formattedBimbinganData,
  categories,
  
} from '@/services/TugasAkhir/Mhs/Bimbingan.js';

const { loadingBimbingan, errorBimbingan, highestBAB } = useBimbingan();

const { loadingRequest,
  errorRequest,
  submitRequestPembimbing }
  = useRequestPembimbing();

// Dummy dosen


// ============================================
// KONFIGURASI AWAL DAN STATE MANAGEMENT
// ============================================

const selectedCategory = ref('');
const selectedPembimbing = ref('');
const showModal = ref(false);

// ============================================
// METHODS & HANDLERS
// ============================================

const openModal = () => { showModal.value = true; };
const closeModal = () => { showModal.value = false; };
const handleSubmit = () => { console.log('Form submitted'); };
const handleRowClick = (item) => { console.log('Baris yang diklik:', item); };

</script>

<template>
  <div v-if="loadingBimbingan || loadingRequest" class="flex items-center justify-center min-h-[80dvh]">
    <Loading />
  </div>

  <div v-else-if="errorBimbingan || errorRequest" class="p-4">
    <ErrorMsg :msg="errorBimbingan || errorRequest" />
  </div>

  <div v-else>
    <router-view v-if="$route.path.includes('tambah-bimbingan')"></router-view>

    <div v-else>
      <!-- Breadcrumb untuk navigasi -->
      <Breadcrumb />

      <!-- Error State -->
      <ErrorMsg v-if="error" :msg="error" />

      <!-- STATE 1: BELUM ADA TA AKTIF - FORM REQUEST PEMBIMBING -->
      <div v-else-if="!hasActiveTA && !hasPembimbing" class="p-4 bg-white card-rounded lg:p-8">
        <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
          <h5 class="body3-bold sm:body2-bold lg:body1-bold">
            Anda belum memiliki pembimbing, silahkan pilih dosen untuk diminta menjadi pembimbing terlebih dahulu!
          </h5>

          <!-- Form Request Pembimbing -->
          <form class="flex flex-col gap-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Input Kategori -->
              <InputDropdown id="kategori-dropdown" label="Kategori Tugas Akhir" :options="categories"
                placeholder="Pilih kategori tugas akhir" v-model="selectedCategory" />

              <!-- Input Tahun Ajaran (Disabled) -->
              <InputText id="tahun-ajaran" label="Tahun Ajaran" placeholder="Tahun Ajaran" :value="defaultTahunAjaran"
                :disabled="true" />

              <!-- Input Dosen Pembimbing -->
              <InputDropdown class="sm:col-span-2" id="dosen-dropdown" label="Dosen Pembimbing" :options="pembimbings"
                placeholder="Pilih dosen pembimbing" v-model="selectedPembimbing" />
            </div>

            <!-- Preview Dosen Terpilih -->
            <div class="flex gap-2 sm:gap-4">
              <div v-if="selectedDosenData" class="flex gap-2 sm:gap-4">
                <!-- Icon Dosen -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

                <!-- Informasi Dosen -->
                <div class="self-center">
                  <h5 class="body4-bold sm:body2-bold lg:body1-bold text-primary">{{ selectedDosenData.name }}</h5>
                  <span class="body5 lg:body4">{{ selectedDosenData.nik }} | D-3 Teknik Informatika</span>
                </div>
              </div>
            </div>

            <!-- Tombol Submit -->
            <Button class="self-end w-fit" type="button" variant="primary" size="lg" @click="openModal"
              :disabled="!selectedDosenData || !selectedCategory">
              Kirim
            </Button>
          </form>
        </div>

        <!-- Modal Konfirmasi -->
        <ModalTimer v-if="showModal" @close="closeModal" @submit="handleSubmit"
          headText="Pastikan Dosen dan Kategori yang Dipilih Benar."
          bodyText="Anda tidak dapat merubah atau menghapus permintaan yang telah terkirim." submitText="Kirim"
          :showCancel="false" :enableTimer="false" />
      </div>

      <!-- STATE 2: MENUNGGU RESPON DOSEN -->
      <div v-else-if="!hasPembimbing && waitingResponse" class="p-4 bg-white card-rounded lg:p-8">
        <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
          <h5 class="body5-bold sm:body4-bold lg:body3-bold">
            Permintaan anda kepada dosen untuk menjadi pembimbing telah terkirim. Mohon tunggu untuk dosen merespon
            permintaan anda.
          </h5>

          <!-- Info Dosen & Status Request -->
          <UserData headText="Dosen Pembimbing" :bodyText="namaDosenRequestPembimbing" headText2="Kategori TA"
            :bodyText2="kategoriTA" :tahunAjaran="tahunAjaranTA" :showStatus="true" status="warning"
            statusLabel="Menunggu" />
        </div>
      </div>

      <!-- STATE 3: REQUEST DITOLAK DOSEN -->
      <div v-else-if="!hasPembimbing && declined" class="p-4 bg-white card-rounded lg:p-8">
        <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
          <h5 class="body3-bold sm:body2-bold lg:body1-bold">
            Mohon maaf dosen menolak permintaan anda, mohon tunggu admin untuk menentukan dosen pembimbing untuk anda.
          </h5>

          <UserData headText="Dosen Pembimbing" :bodyText="namaDosenRequestPembimbing" headText2="Kategori TA"
            :bodyText2="kategoriTA" :tahunAjaran="tahunAjaranTA" :showStatus="true" status="danger"
            statusLabel="Ditolak" />
        </div>
      </div>

      <!-- STATE 4: PUNYA PEMBIMBING - TAMPILKAN DATA BIMBINGAN -->
      <div v-else-if="hasPembimbing">
        <!-- Header: Info Dosen & Progress BAB -->
        <div class="p-6 bg-white card-rounded lg:p-8">
          <!-- Info Dosen Pembimbing -->
          <UserData class="max-w-screen-xl mx-auto mb-4" headText="Dosen Pembimbing" :bodyText="namaPembimbing"
            headText2="Kategori" :bodyText2="kategoriTA" :tahunAjaran="tahunAjaranTA" />

          <!-- Progress BAB & Tombol Tambah -->
          <div class="flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row md:gap-8">
            <!-- Progress Bar BAB -->
            <ProgressBarBAB class="sm:ms-3" :currentStep="highestBAB" />

            <!-- Tombol Tambah Bimbingan -->
            <router-link class="w-full md:w-fit" to="/mahasiswa/tugas-akhir/bimbingan/tambah-bimbingan">
              <!-- Desktop Button -->
              <Button class="hidden w-full lg:flex" variant="primary" size="lg"
                left-icon-path="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z">
                Tambah
              </Button>

              <!-- Mobile Button -->
              <Button class="w-full lg:hidden" variant="primary" size="md"
                left-icon-path="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z">
                Tambah
              </Button>
            </router-link>
          </div>
        </div>

        <!-- Tabel Riwayat Bimbingan -->
        <div class="p-4 mt-4 bg-white card-rounded lg:p-8">
          <Table :headers="['No', 'Tanggal', 'BAB', 'Catatan', 'Status']" :items="formattedBimbinganData"
            @rowClick="handleRowClick">
            <template #row="{ item }">
              <!-- Kolom No -->
              <td class="px-3 py-3 border-r border-white rounded-l-lg sm:py-3 sm:px-6">
                {{ item.no }}
              </td>

              <!-- Kolom Tanggal -->
              <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
                {{ item.tanggal }}
              </td>

              <!-- Kolom BAB -->
              <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
                {{ item.bab === '1' ? 'BAB I' :
                  item.bab === '2' ? 'BAB II' :
                    item.bab === '3' ? 'BAB III' :
                      item.bab === '4' ? 'BAB IV' :
                        item.bab === '5' ? 'BAB V' :
                          'BAB ' + item.bab }}
              </td>

              <!-- Kolom Catatan -->
              <td
                class="py-3 px-3 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-3 sm:px-6  border-r border-white">
                {{ item.catatan }}
              </td>

              <!-- Kolom Status -->
              <td class="px-3 py-3 border-r border-white rounded-r-lg sm:py-3 sm:px-6">
                <!-- Desktop Status -->
                <StatusLabel class="hidden w-fit lg:block" :status="getStatusClass(item.status)" size="md"
                  :label="getStatusLabel(item.status)" />

                <!-- Mobile Status -->
                <StatusLabel class="block w-fit lg:hidden" :status="getStatusClass(item.status)" size="sm"
                  :label="getStatusLabel(item.status)" />
              </td>
            </template>
          </Table>
        </div>
      </div>
    </div>

  </div>

</template>