<script setup>
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import InputText from '@/components/Tugas-akhir/Forms/InputText.vue';
import InputTextArea from '@/components/Tugas-akhir/Forms/InputTextarea.vue';
import InputDate from '@/components/Tugas-akhir/Forms/InputDate.vue';
import InputDropdown from '@/components/Tugas-akhir/Forms/InputDropdown.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import StatusLabel from '@/components/Tugas-akhir/Label.vue';
import ProgressBarBAB from '@/components/Tugas-akhir/ProgressBarBAB.vue';
import Table from '@/components/Tugas-akhir/Table.vue';
import { ref,computed,onMounted } from 'vue';
import Loading from '@/components/Loading.vue';
import ErrorMsg from '@/components/ErrorMsg.vue';

import { mhsBimbingan } from '@/services/TugasAkhir/Mhs/bimbingan';
// Dapatkan state dan method dari service
const { bimbingan, loading, error } = mhsBimbingan();

// Format data dari API untuk tabel
const formattedBimbinganData = computed(() => {
  if (!bimbingan.value || bimbingan.value.length === 0) {
    return [];
  }
  
  return bimbingan.value.map((item, index) => {
    // Sesuaikan format dengan struktur API response Anda
    return {
      no: (index + 1).toString(),
      tanggal: formatDate(item.tanggal_bimbingan || item.created_at),
      bab: item.bab ? item.bab.toString() : '-',
      catatan: item.catatan || '-',
      status: item.status_verifikasi // Asumsikan status dari API sama dengan yang digunakan di aplikasi
    };
  });
});

// Format tanggal YYYY-MM-DD menjadi DD MMM YYYY
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Status helper functions
function getStatusClass(status) {
  if (status === 1) return 'success';
  if (status === 0) return 'warning';
  return 'danger';
}

function getStatusLabel(status) {
  if (status === 1) return 'Diterima';
  if (status === 0) return 'Menunggu';
  return 'Ditolak';
}

// Computed property untuk menghitung bab tertinggi yang ada di tableData
const highestChapter = computed(() => {
  // Filter untuk mendapatkan hanya bimbingan yang statusnya diterima (status = 1)
  const acceptedSubmissions = formattedBimbinganData.value.filter(item => item.status === 1);
  
  if (acceptedSubmissions.length === 0) {
    return 0; // Tidak ada bimbingan yang diterima, kembalikan 0
  }
  
  // Konversi semua nilai bab menjadi angka
  const chapters = acceptedSubmissions.map(item => parseInt(item.bab, 10));
  
  // Cari bab tertinggi
  return Math.max(...chapters);
});

// Fungsi untuk menangani klik pada baris
const handleRowClick = (item) => {
  console.log('Baris yang diklik:', item);
};

// Dropdown options
const dropdownOptions = ref([
  { value: '1', label: 'Dosen 1' },
  { value: '2', label: 'Dosen 2' },
  { value: '3', label: 'Dosen 3' },
  { value: '4', label: 'Dosen 4' },
  { value: '5', label: 'Dosen 5' },
]);

const TahunAjaran = ref('');

</script>
<template>
  <Breadcrumb :items="breadcrumbItems" />
      <!-- Loading State -->
    <Loading v-if="loading" />
      <!-- Error State -->
    <ErrorMsg v-else-if="error" :msg="error"/>   
      <!-- jika belum ada pembimbing  -->
  <div v-else-if="noPembimbing" class="card-rounded bg-white p-4 lg:p-8">
    <div class="flex flex-col gap-4 max-w-screen-2xl mx-auto">
      <h5 class="body3-bold sm:body2-bold lg:body1-bold ">Anda belum memiliki pembimbing, silahkan pilih dosen untuk diminta menjadi pembimbing terlebih dahulu!</h5>
      <form action="" class="flex flex-col gap-4 ">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputDropdown
            id="dosen-dropdown"
            label="Kategori Tugas Akhir"
            :options="dropdownOptions"
            placeholder="Pilih kategori tugas akhir"
            :value="selectedValue"
            @update:value="selectedValue = $event"
          />
          <InputText
            id="search-input"
            label="Tahun Ajaran"
            placeholder="Tahun Ajaran"
            :value="TahunAjaran"
          />
          <InputDropdown
            class="sm:col-span-2"
            id="dosen-dropdown"
            label="Dosen Pembimbing"
            :options="dropdownOptions"
            placeholder="Pilih dosen pembimbing"
            :value="selectedValue"
            @update:value="selectedValue = $event"
          />
        </div>

        <!-- jika sudah select pembimbing  -->
        <div class="flex gap-2 sm:gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <div class="self-center">
            <h5 class="body4-bold sm:body2-bold lg:body1-bold text-primary">John Batubara balbdlabw S.T., M.Info.Tech., Ph.D.</h5>
            <span class="body5 lg:body4">1981112420130201 | D-3 Teknik Informatika</span>
          </div>
        </div>

        <Button
          class="w-fit self-end"
          type="submit"
          variant="primary"
          size="lg"
          @click.prevent="handleSubmit"
        >Kirim</Button>
      </form>
    </div>
  </div>

  <!-- ketika sudah submit   -->
  <div v-else-if="waitingResponse" class="card-rounded bg-white p-4 lg:p-8">
    <div class="flex flex-col gap-4 max-w-screen-2xl mx-auto">
      <h5 class="body3-bold sm:body2-bold lg:body1-bold ">Permintaan anda kepada dosen untuk menjadi pembimbing telah terkirim. Mohon tunggu untuk dosen merespon permintaan anda.</h5>
      <div class="flex gap-2 sm:gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <div class="self-center flex flex-wrap justify-between w-full">
            <div class="">
              <span class="body5 sm:body4-bold">Dosen Pembimbing</span>
              <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">John Batubara balbdlabw S.T., M.Info.Tech., Ph.D.</h5>
            </div>
            <div class="lg:border-l-2 border-black lg:pl-4">
                <span class="body5 sm:body5-bold">Kategori TA</span>
                <h5 class="body5-bold  sm:body3-bold lg:body2-bold text-primary">Internet Of Things</h5>
              </div>
            <div>
                <span class="body5 sm:body4-bold">Tahun Ajaran</span>
                <h5 class="body5-bold  sm:body3-bold lg:body2-bold text-primary">2024/2025</h5>
              </div>
              <div class="text-center">
                <span class="body5 sm:body4-bold">Status</span>
                <StatusLabel
                  class="w-fit hidden lg:block"
                  status="warning"
                  size="md"
                  label="Menunggu"
                />
                <StatusLabel
                  class="w-fit lg:hidden block"
                  status="warning"
                  size="sm"
                  label="Menunggu"
                />
              </div>
          </div>
        </div>
    </div>
  </div>

  <!-- ketika sudah ditolak   -->
  <div v-else-if="declined" class="card-rounded bg-white p-4 lg:p-8">
    <div class="flex flex-col gap-4 max-w-screen-2xl mx-auto">
      <h5 class="body3-bold sm:body2-bold lg:body1-bold ">Mohon maaf dosen menolak permintaan anda, mohon tunggu admin untuk menentukan dosen pembimbing untuk anda.</h5>
      <div class="flex gap-2 sm:gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <div class="self-center flex flex-wrap justify-between w-full">
            <div class="">
              <span class="body5 sm:body4-bold">Dosen Pembimbing</span>
              <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">John Batubara balbdlabw S.T., M.Info.Tech., Ph.D.</h5>
            </div>
            <div class="lg:border-l-2 border-black lg:pl-4">
                <span class="body5 sm:body5-bold">Kategori TA</span>
                <h5 class="body5-bold  sm:body3-bold lg:body2-bold text-primary">Internet Of Things</h5>
              </div>
            <div>
                <span class="body5 sm:body4-bold">Tahun Ajaran</span>
                <h5 class="body5-bold  sm:body3-bold lg:body2-bold text-primary">2024/2025</h5>
              </div>
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

  <!-- ketika sudah diterima   -->
  <div class="card-rounded bg-white p-4 lg:p-8">
    <div class="flex gap-2 sm:gap-4 max-w-screen-xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <div class="self-center flex flex-wrap justify-between w-full">
            <div class="">
              <span class="body5 sm:body4-bold">Dosen Pembimbing</span>
              <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">John Batubara balbdlabw S.T., M.Info.Tech., Ph.D.</h5>
            </div>
            <div class="lg:border-l-2 border-black lg:pl-4">
                <span class="body5 sm:body5-bold">Kategori TA</span>
                <h5 class="body5-bold  sm:body3-bold lg:body2-bold text-primary">Internet Of Things</h5>
              </div>
            <div>
                <span class="body5 sm:body4-bold">Tahun Ajaran</span>
                <h5 class="body5-bold  sm:body3-bold lg:body2-bold text-primary">2024/2025</h5>
              </div>
          </div>
        </div>
        <div class="flex flex-wrap justify-between items-center max-w-screen-xl mx-auto">
          <ProgressBarBAB
            class="sm:ms-3"
            :currentStep="highestChapter"
          />
          <router-link to="/mahasiswa/tugas-akhir/bimbingan/tambah-bimbingan">
            <Button
            class="hidden lg:flex mb-6"
            variant="primary"
            size="xl"
            left-icon-path="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
            >Tambah</Button>
            <Button
            class="lg:hidden mb-6"
            variant="primary"
            size="md"
            left-icon-path="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
            >Tambah</Button>
          </router-link>
          

        </div>
  </div>

  <div class="card-rounded bg-white p-4 lg:p-8 mt-4">
    <!-- Tabel -->
    <Table
      :headers="['No', 'Tanggal','BAB', 'Catatan' , 'Status']"
      :items="formattedBimbinganData"
      @rowClick="handleRowClick"
    >
      <template #row="{ item }">
        <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-l-lg">{{ item.no }}</td>
        <td class="sm:py-3 py-3 sm:px-4 px-1 ">
          {{ item.tanggal }}
        </td>
        <td class="sm:py-3 py-3 sm:px-4 px-1">
          {{ item.bab === '1' ? 'BAB I' : 
            item.bab === '2' ? 'BAB II' : 
            item.bab === '3' ? 'BAB III' : 
            item.bab === '4' ? 'BAB IV' : 
            item.bab === '5' ? 'BAB V' : 
            'BAB ' + item.bab }}
        </td>
        <td class="py-3 px-1 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-3 sm:px-4">
          {{ item.catatan }}
        </td>
        <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-r-lg">
          <StatusLabel
            class="w-fit hidden lg:block mx-auto"
            :status="getStatusClass(item.status)"
            size="md"
            :label="getStatusLabel(item.status)"
          />
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
</template>
