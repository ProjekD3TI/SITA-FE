<script setup>
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import InputDate from '@/components/Tugas-akhir/Forms/InputDate.vue';
import InputText from '@/components/Tugas-akhir/Forms/InputText.vue';
import InputTextarea from '@/components/Tugas-akhir/Forms/InputTextarea.vue';
import InputFile from '@/components/Tugas-akhir/Forms/InputFile.vue';
import InputDropdown from '@/components/Tugas-akhir/Forms/InputDropdown.vue';
import ValidationFile from '@/components/Tugas-akhir/Forms/ValidationFile.vue';
import StatusLabel from '@/components/Tugas-akhir/Label.vue';
import ModalFilter from '@/components/Tugas-akhir/ModalFilter.vue';
import InputSearch from '@/components/Tugas-akhir/Forms/SearchBar.vue';
import Table from '@/components/Tugas-akhir/Table.vue';
import ProgressBarBAB from '@/components/Tugas-akhir/ProgressBarBAB.vue';
import { ref, computed } from 'vue';


// State
const currentStep = ref(1);
const steps = ['BAB I', 'BAB II', 'BAB III', 'BAB IV', 'BAB V'];

// Methods
const increaseStep = () => {
  if (currentStep.value < 5) {
    currentStep.value++;
  }
};

const decreaseStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const tableData = ref([
  {
    nim: 'V3423070',
    name: 'Christine Brooks',
    title: 'Pengembangan el pikir satu dua tiga',
    category: 'Internet of Things',
    image: 'https://images.icon-icons.com/2643/PNG/512/avatar_female_woman_person_people_white_tone_icon_159360.png',
  },
  {
    nim: 'V3423071',
    name: 'John Doe',
    title: 'Analisis Data Besar',
    category: 'Big Data',
    image: '', // Tidak ada gambar, gunakan ikon default
  },
]);

// Fungsi untuk menangani klik pada baris
const handleRowClick = (item) => {
  console.log('Baris yang diklik:', item);
};

// Data filter dari database
const categories = ref(['Internet of Things', 'Virtual Reality', 'Machine Learning', 'Artificial Intelligence', 'Big Data', 'Cloud Computing', 'Cyber Security']);

// State untuk menyimpan kategori yang AKTIF dipilih (sudah diterapkan)
const selectedCategories = ref([]);

// State untuk search
const searchQuery = ref('');

// Computed property untuk memfilter data berdasarkan kategori dan pencarian
const filteredTableData = computed(() => {
  let result = tableData.value;

  // Filter berdasarkan kategori yang dipilih
  if (selectedCategories.value.length > 0) {
    result = result.filter(item => selectedCategories.value.includes(item.category));
  }

  // Filter berdasarkan search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(item =>
      item.nim.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }

  return result;
});

// Fungsi untuk menangani filter kategori
const handleFilter = (filterData) => {
  console.log(`Filter type: ${filterData.type}`);
  console.log('Selected values:', filterData.values);

  if (filterData.type === 'category') {
    selectedCategories.value = [...filterData.values];
  }
};

</script>

<template>
  <Breadcrumb :items="breadcrumbItems" />
  <div class="bg-white p-4 sm:p-8 card-rounded overflow-x-auto">
    <div>
      <div class="flex flex-wrap gap-4">
        <!-- Input date -->
        <InputDate id="date-input" label="Nama Input" :value="today" />

        <!-- Input text -->
        <InputText id="text-input" label="Nama Input" :value="selectedValue" placeholder="Isi placeholder" />
      </div>
      <div class="flex flex-wrap gap-4 mt-4">
        <!-- Input validasi file -->
        <ValidationFile
          id="validation-file"
          label="Upload File"
          :fileFromDatabase="{ name: 'contoh-file.pdf', url: 'https://pdfobject.com/pdf/sample.pdf' }"
        />

        <!-- Input file -->
        <InputFile id="file-input" label="Nama Input" />
      </div>
      <div class="flex flex-wrap gap-4 mt-4">
        <!-- Input dropdown -->
        <InputDropdown id="select-input" label="Nama Input" :options="dropdownOptions" :placeholder="'Cari opsi...'" />

        <!-- Input textarea -->
        <InputTextarea id="textarea-input" label="Nama Input" :value="selectedValue" placeholder="Isi placeholder" />
      </div>

      <!-- Bagian filter -->
      <div class="mb-8">
        <h2 class="body2-bold mb-4">Filter Modal</h2>
        <div class="flex flex-wrap gap-4">
          <ModalFilter
            title="Kategori"
            :items="categories"
            filterType="category"
            @apply="handleFilter"
            triggerText="Kategori"
            :preselectedValues="selectedCategories"
          />
          <InputSearch
            v-model="searchQuery"
            placeholder="Cari bimbingan..."
            @search="handleSearch"
            filterKey="bimbingan"
          />
        </div>
      </div>
    </div>

    <!-- Tabel -->
    <Table
      :headers="['NIM', 'Nama Lengkap', 'Judul', 'Kategori']"
      :items="filteredTableData"
      @rowClick="handleRowClick"
    >
      <template #row="{ item }">
        <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-l-lg">{{ item.nim }}</td>
        <td class="sm:py-3 py-3 sm:px-4 px-1 flex items-center justify-center">
          <img
            v-if="item.image"
            :src="item.image"
            alt="User Icon"
            class="w-8 h-8 mr-2 hidden sm:block rounded-full"
          />
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-8 h-8 mr-2 hidden sm:block"
          >
            <path
              fill-rule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              clip-rule="evenodd"
            />
          </svg>
          {{ item.name }}
        </td>
        <td class="py-3 px-1 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:max-w-none lg:whitespace-normal sm:py-3 sm:px-4">
          {{ item.title }}
        </td>
        <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-r-lg">{{ item.category }}</td>
      </template>
    </Table>

    <ProgressBarBAB :currentStep="currentStep" />

    <div class="min-h-screen bg-gray-800 p-8">
    <h1 class="text-2xl font-bold text-white mb-8 text-center">Demo Progress Bar</h1>
    
    <ProgressBarBAB :currentStep="currentStep" />
    
    <div class="flex justify-center mt-8 space-x-4">
      <button 
        @click="decreaseStep" 
        class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        :disabled="currentStep <= 0"
      >
        Sebelumnya
      </button>
      <button 
        @click="increaseStep" 
        class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        :disabled="currentStep >= 6"
      >
        Selanjutnya
      </button>
    </div>
    
    <div class="text-center mt-6 text-white">
      Langkah saat ini: {{ currentStep }} - {{ steps[currentStep-1] }}
    </div>
  </div>
  </div>
</template>