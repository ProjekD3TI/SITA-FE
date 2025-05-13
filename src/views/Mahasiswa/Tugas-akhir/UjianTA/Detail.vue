<script setup>
import { ref, computed } from 'vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import JadwalUjian from '@/components/Tugas-akhir/JadwalUjian.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import Tooltip from '@/components/Tugas-akhir/Tooltip.vue';
import DefaultModal from '@/components/Tugas-akhir/Modals/DefaultModal.vue';
import InputText from '@/components/Tugas-akhir/Forms/InputText.vue';
import InputTextarea from '@/components/Tugas-akhir/Forms/InputTextarea.vue';

// App State
const dinilai = ref(false);
const showNilaiModal = ref(false);

// PDF handling
const pdfUrl = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

// Data untuk komponen penguji
const examiners = [
  { name: 'John Batubara, A. Xioo, M. Si, A. Cer', role: 'Ketua' },
  { name: 'Dr. Sinta Wijaya, M.Kom', role: 'Anggota' },
  { name: 'Prof. Ahmad Rizal, Ph.D', role: 'Anggota' }
];

// Jadwal ujian
const schedule = {
  date: 'Rabu, 32 Maret 2025',
  time: '09:00 - 10:00',
  room: 'Lab. Jaringan'
};

// TA details
const tugasAkhirDetails = {
  judul: "Pengembangan El Pikir Satu Dua Tiga",
  kategori: "Internet Of Things",
  dosenPembimbing: "Agus Kotak S.Ht",
  tahunAjaran: "2023/2024",
  nilai: 90,
  catatan: "Tugas akhir sangat baik, presentasi lancar, dan mahasiswa dapat menjawab semua pertanyaan dengan tepat."
};

// Methods
const openNilaiModal = () => {
  showNilaiModal.value = true;
};

const closeNilaiModal = () => {
  showNilaiModal.value = false;
};

// Computed properties
const buttonClasses = computed(() => {
  return dinilai.value ? 'opacity-100' : 'opacity-50';
});
</script>

<template>
  <Breadcrumb :items="breadcrumbItems" />

  <!-- Jadwal Section -->
  <div class="card-rounded bg-white p-6 lg:p-8">
    <div class="max-w-screen-2xl mx-auto">
      <JadwalUjian :examiners="examiners" :jadwal="schedule" />
    </div>
  </div>
  
  <!-- Tugas Akhir Details Section -->
  <div class="card-rounded bg-white p-6 lg:p-8 mt-6">
    <div class="max-w-screen-2xl mx-auto">
      <div class="flex flex-col md:flex-row">
        <!-- PDF Preview (Left Side) -->
        <div class="basis-7/12 md:pe-8 order-last md:order-first">
          <object
            :data="pdfUrl"
            type="application/pdf"
            class="w-full h-[750px] mt-6 md:mt-0"
          >
            <p class="p-4 text-center">
              Browser Anda tidak mendukung tampilan PDF.
              <a :href="pdfUrl" target="_blank" class="text-primary">Klik di sini</a> untuk membuka PDF.
            </p>
          </object>
        </div>
        
        <!-- Details (Right Side) -->
        <div class="basis-5/12 flex flex-col gap-4">
          <!-- Detail items -->
          <div class="flex flex-col gap-2">
            <div>
              <h5 class="body1-bold">Judul Tugas Akhir</h5>
              <p class="body1 text-primary">{{ tugasAkhirDetails.judul }}</p>
            </div>
            
            <div>
              <h5 class="body1-bold">Kategori</h5>
              <p class="body1 text-primary">{{ tugasAkhirDetails.kategori }}</p>
            </div>
            
            <div>
              <h5 class="body1-bold">Dosen Pembimbing</h5>
              <p class="body1 text-primary">{{ tugasAkhirDetails.dosenPembimbing }}</p>
            </div>
            
            <div>
              <h5 class="body1-bold">Tahun Ajaran</h5>
              <p class="body1 text-primary">{{ tugasAkhirDetails.tahunAjaran }}</p>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex self-end gap-4 items-center">
            <Tooltip v-if="!dinilai" text="Menunggu Dinilai" size="md" position="left">
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
              variant="success"
              size="lg"
              class="w-fit sm:flex hidden"
              :class="buttonClasses"
              :disabled="!dinilai"
              @click="openNilaiModal"
            >
              Lihat Nilai
            </Button>

            <Button
              variant="success"
              size="md"
              class="w-fit sm:hidden"
              :class="buttonClasses"
              :disabled="!dinilai"
              @click="openNilaiModal"
            >
              Lihat Nilai
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Nilai -->
  <DefaultModal
    v-if="showNilaiModal"
    @close="closeNilaiModal"
    headText="Nilai Ujian Tugas Akhir"
    bodyText="Nama Mahasiswa | V3423999 | Judul Tugas Akhir"
  >
    <div class="flex flex-col gap-4 mt-4">
      <InputText
        id="nilai-ujian-ta"
        label="Nilai Ujian Tugas Akhir"
        :modelValue="tugasAkhirDetails.nilai"
        disabled
      />
      
      <InputTextarea
        id="catatan-ujian-ta"
        label="Catatan"
        :modelValue="tugasAkhirDetails.catatan"
        disabled
      />
    </div>
  </DefaultModal>
</template>