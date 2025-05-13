<script setup>
import { ref, computed } from 'vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import InputText from '@/components/Tugas-akhir/Forms/InputText.vue';
import InputFile from '@/components/Tugas-akhir/Forms/InputFile.vue';
import UserData from '@/components/Tugas-akhir/UserData.vue';
import Loading from '@/components/Loading.vue';
import ErrorMsg from '@/components/ErrorMsg.vue';
import Tooltip from '@/components/Tugas-akhir/Tooltip.vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import DefaultModal from '@/components/Tugas-akhir/Modals/DefaultModal.vue';
import JadwalUjian from '@/components/Tugas-akhir/JadwalUjian.vue';

// Constants
const PDF_SAMPLE = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";
const STATUS = {
  NULL: null,
  WAITING: 0,
  ACCEPTED: 1,
  REJECTED: 2
};

// App State
const loading = ref(false);
const error = ref(null);
const modalRef = ref(false);
const statusPendaftaran = ref(1); // Status pendaftaran ujian
const bimbinganCount = ref(9); // Jumlah bimbingan yang telah dilakukan
const scheduled = ref(true); // Status apakah ujian sudah dijadwalkan
const judulTugasAkhir = ref(''); // Form input for judul

// Form file inputs
const fileNaskahTA = ref(null);
const fileKRS = ref(null);
const filePersetujuanPembimbing = ref(null);
const fileTranskrip = ref(null);
const fileSertifikat = ref(null);
const fileTOEIC = ref(null);
const fileBeritaAcara = ref(null);
const filePerpanjanganMasaStudi = ref(null);

// Computed Properties
const minimalBimbingan = computed(() => {
  return bimbinganCount.value >= 9;
});

const userDataConfig = computed(() => {
  const config = {
    headText: "Dosen Pembimbing",
    bodyText: "Prof. Dr. Budi Santoso, M.Kom",
    headText2: "Kategori TA",
    bodyText2: "Internet of Things",
    tahunAjaran: "2023/2024",
    showStatus: statusPendaftaran.value !== STATUS.NULL
  };

  if (config.showStatus) {
    switch (statusPendaftaran.value) {
      case STATUS.WAITING:
        config.status = "warning";
        config.statusLabel = "Menunggu";
        break;
      case STATUS.ACCEPTED:
        config.status = "success";
        config.statusLabel = "Diterima";
        break;
      case STATUS.REJECTED:
        config.status = "danger";
        config.statusLabel = "Ditolak";
        break;
    }
  }

  return config;
});

const formConfig = computed(() => {
  const isDisabled = statusPendaftaran.value === STATUS.WAITING || 
                    statusPendaftaran.value === STATUS.ACCEPTED;
  
  return {
    isDisabled,
    wrapperClass: isDisabled ? 'opacity-50' : '',
    showSubmitButton: statusPendaftaran.value === STATUS.NULL || 
                      statusPendaftaran.value === STATUS.REJECTED
  };
});


// Data for Ujian TA
const daftarTugasAkhir = {
  id: 1,
  judul_tugas_akhir: "Pengembangan El Pikir Satu Dua Tiga",
  naskah_ta: "naskah_ta.pdf",
  naskah_ta_url: PDF_SAMPLE,
  krs: "krs.pdf",
  krs_url: PDF_SAMPLE,
  persetujuan_pembimbing: "bukti_persetujuan_pembimbing.pdf",
  persetujuan_pembimbing_url: PDF_SAMPLE,
  file_transkrip: "transkrip.pdf",
  file_transkrip_url: PDF_SAMPLE,
  sertifikat_kompetensi: "sertifikat_kompetensi.pdf",
  sertifikat_kompetensi_url: PDF_SAMPLE,
  toeic: "sertifikat_toeic.pdf",
  toeic_url: PDF_SAMPLE,
  berita_acara_semhas: "berita_acara_semhas.pdf",
  berita_acara_semhas_url: PDF_SAMPLE,
  masa_perpanjangan_studi: "surat_perpanjangan_masa_studi.pdf",
  masa_perpanjangan_studi_url: PDF_SAMPLE,
};

// Data for schedule modal
const examiners = [
  { name: 'John Batubara, A. Xioo, M. Si, A. Cer', role: 'Ketua' },
  { name: 'Dr. Sinta Wijaya, M.Kom', role: 'Anggota' },
  { name: 'Prof. Ahmad Rizal, Ph.D', role: 'Anggota' }
];

const schedule = {
  date: 'Rabu, 32 Maret 2025',
  time: '09:00 - 10:00',
  room: 'Lab. Jaringan'
};

// Methods
const showModal = () => {
  modalRef.value = true;
};

const handleSubmit = () => {
  console.log('Form submitted');
  // Add form submission logic here
};
</script>

<template>
  <router-view v-if="$route.path.includes('detail-ujian-ta')"></router-view>

  <div v-else>
    <!-- Loading State -->
    <Loading v-if="loading" />
    
    <!-- Error State -->
    <ErrorMsg v-else-if="error" :msg="error" />
    
    <template v-else>
      <!-- Not Enough Bimbingan State -->
      <div v-if="!minimalBimbingan" class="h-[80vh] flex flex-col justify-center items-center gap-4">
        <h1 class="heading5 sm:heading4 lg:heading3 text-placeholder text-center">
          Minimal bimbingan anda belum terpenuhi.
        </h1>
        <router-link to="bimbingan">
          <Button
            class="hidden sm:flex"
            variant="primary"
            size="lg"
            rightIconPath="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          >
            Bimbingan
          </Button>
          <Button
            class="sm:hidden"
            variant="primary"
            size="md"
            rightIconPath="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          >
            Bimbingan
          </Button>
        </router-link>
      </div>

      <!-- Main Content when minimal bimbingan is met -->
      <template v-if="minimalBimbingan">
        <Breadcrumb :items="breadcrumbItems" />
        
        <div class="card-rounded bg-white p-4 lg:p-8">
          <!-- User Data Section -->
          <div class="pb-6 max-w-screen-2xl mx-auto">
            <UserData v-bind="userDataConfig" />
          </div>
          
          <!-- Form Section -->
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 max-w-screen-2xl mx-auto">
            <div :class="formConfig.wrapperClass" class="flex flex-col gap-4">
              <!-- Common form fields -->
              <InputText
                id="judul-ta"
                label="Judul Tugas Akhir"
                placeholder="Masukkan judul tugas akhir"
                v-model="judulTugasAkhir"
                :value="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.judul_tugas_akhir : ''"
                :disabled="formConfig.isDisabled"
              />
              
              <!-- All the file uploads -->
              <InputFile
                id="naskah-ta"
                label="Naskah Tugas Akhir"
                v-model="fileNaskahTA"
                :existingFileName="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.naskah_ta : ''"
                :existingFileUrl="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.naskah_ta_url : ''"
                :disabled="formConfig.isDisabled"
              />
              
              <InputFile
                id="krs-semester-terakhir"
                label="Scan KRS Semester Terakhir"
                v-model="fileKRS"
                :existingFileName="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.krs : ''"
                :existingFileUrl="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.krs_url : ''"
                :disabled="formConfig.isDisabled"
              />
              
              <InputFile
                id="bukti-persetujuan-pembimbing"
                label="Bukti Persetujuan Pembimbing"
                v-model="filePersetujuanPembimbing"
                :existingFileName="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.persetujuan_pembimbing : ''"
                :existingFileUrl="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.persetujuan_pembimbing_url : ''"
                :disabled="formConfig.isDisabled"
              />
              
              <InputFile
                id="transkrip-nilai-mahasiswa"
                label="Transkrip Nilai Mahasiswa"
                v-model="fileTranskrip"
                :existingFileName="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.file_transkrip : ''"
                :existingFileUrl="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.file_transkrip_url : ''"
                :disabled="formConfig.isDisabled"
              />
              
              <InputFile
                id="bukti-sertifikat-kompetensi"
                label="Bukti Sertifikat Kompetensi"
                v-model="fileSertifikat"
                :existingFileName="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.sertifikat_kompetensi : ''"
                :existingFileUrl="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.sertifikat_kompetensi_url : ''"
                :disabled="formConfig.isDisabled"
              />
              
              <InputFile
                id="sertifikat-toeic"
                label="Sertifikat TOEIC"
                v-model="fileTOEIC"
                :existingFileName="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.toeic : ''"
                :existingFileUrl="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.toeic_url : ''"
                :disabled="formConfig.isDisabled"
              />
              
              <InputFile
                id="berita-acara-seminar-hasil"
                label="Berita Acara Seminar Hasil"
                v-model="fileBeritaAcara"
                :existingFileName="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.berita_acara_semhas : ''"
                :existingFileUrl="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.berita_acara_semhas_url : ''"
                :disabled="formConfig.isDisabled"
              />

              <!-- Optional field -->
              <InputFile
                id="surat-perpanjangan-masa-studi"
                label="Surat Perpanjangan Masa Studi"
                v-model="filePerpanjanganMasaStudi"
                :existingFileName="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.masa_perpanjangan_studi : ''"
                :existingFileUrl="statusPendaftaran !== STATUS.NULL ? daftarTugasAkhir.masa_perpanjangan_studi_url : ''"
                :disabled="true"
              />
            </div>
            
            <!-- Action Buttons -->
            <div class="flex self-end gap-4 items-center">
              <!-- Submit Button - show for new or rejected application -->
              <template v-if="formConfig.showSubmitButton">
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  class="w-fit self-end sm:flex hidden"
                >
                  Kirim
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  class="w-fit self-end sm:hidden"
                >
                  Kirim
                </Button>
              </template>
              
              <!-- Action Buttons - show for accepted application -->
              <template v-if="statusPendaftaran === STATUS.ACCEPTED">
                <!-- Schedule tooltip and button -->
                <Tooltip v-if="!scheduled" text="Menunggu Dijadwalkan" size="md" position="left">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                </Tooltip>
                
                <Button
                  @click="showModal"
                  type="button"
                  variant="success"
                  size="lg"
                  class="w-fit sm:flex hidden"
                  :class="!scheduled ? 'opacity-50' : 'opacity-100'"
                  :disabled="!scheduled"
                >
                  Lihat Jadwal
                </Button>
                
                <Button
                  @click="showModal"
                  type="button"
                  variant="success"
                  size="md"
                  class="w-fit sm:hidden"
                  :class="!scheduled ? 'opacity-50' : 'opacity-100'"
                  :disabled="!scheduled"
                >
                  Lihat Jadwal
                </Button>

                <!-- Detail Button -->
                <router-link to="ujian-ta/detail-ujian-ta">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    class="w-fit sm:flex hidden"
                  >
                    Detail
                  </Button>
                  
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    class="w-fit sm:hidden"
                  >
                    Detail
                  </Button>
                </router-link>
              </template>
            </div>
          </form>
          
          <!-- Schedule Modal -->
          <DefaultModal
            v-if="modalRef"
            @close="modalRef = false"
            headText="Jadwal Ujian Tugas Akhir"
            bodyText="Nama Mahasiswa | V3423999 | Judul Tugas Akhir"
          >
            <JadwalUjian
              :examiners="examiners"
              :jadwal="schedule"
            />
          </DefaultModal>
        </div>
      </template>
    </template>
  </div>
</template>