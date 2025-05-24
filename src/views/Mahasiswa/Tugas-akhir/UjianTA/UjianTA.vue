<script setup>
import { ref, computed, reactive } from 'vue';
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
import {
  useTugasAkhir,
  useBerkasTA,
  useJadwalUjianTA,
  dosenPembimbing,
  kategoriTA,
  tahunAjaranTA,
  statusValid,
  totalBimbingan,
  judulTugasAkhir,
  naskahTA,
  transkripNilai,
  krs,
  buktiPersetujuanPembimbing,
  buktiSertifikatKompetensi,
  sertifikatTOEIC,
  beritaAcaraSeminarHasil,
  suratPerpanjanganMasaStudi,
  fileNaskahTA,
  fileKRS,
  fileBuktiPersetujuanPembimbing,
  fileTranskripNilai,
  fileBuktiSertifikatKompetensi,
  fileSertifikatTOEIC,
  fileBeritaAcaraSeminarHasil,
  fileSuratPerpanjanganMasaStudi,
  statusBerkasNaskahTA,
  statusBerkasTranskripNilai,
  statusBerkasKRS,
  statusBerkasBuktiPersetujuanPembimbing,
  statusBerkasBuktiSertifikatKompetensi,
  statusBerkasSertifikatTOEIC,
  statusBerkasBeritaAcaraSeminarHasil,
  statusBerkasSuratPerpanjanganMasaStudi,
  jadwalUjianTA,
  daftarPenguji
} from '@/services/TugasAkhir/Mhs/ujianTA.js';
import { getUserData } from '@/services/authMahasiswa'

const userData = getUserData();
const username = userData?.name || userData?.email?.split('@')[0] || 'User';
const nim = userData?.nim || '';

const { loadingTugasAkhir, errorTugasAkhir } = useTugasAkhir();
const { loadingBerkasTA, errorBerkasTA } = useBerkasTA();
const { loadingJadwalUjianTA, errorJadwalUjianTA } = useJadwalUjianTA();

const terjadwal= computed(() => jadwalUjianTA.value?.ujian_ta?.id !== null && jadwalUjianTA.value?.ujian_ta?.id !== undefined);

const STATUS = {
  NULL: null,
  WAITING: 0,
  ACCEPTED: 1,
  REJECTED: 2
};

// App State
const modalRef = ref(false);

// Form file inputs
const filePersetujuanPembimbing = ref(null);
const fileTranskrip = ref(null);
const fileSertifikat = ref(null);
const fileTOEIC = ref(null);
const fileBeritaAcara = ref(null);
const filePerpanjanganMasaStudi = ref(null);

// Computed Properties
const minimalBimbingan = computed(() => {
  return totalBimbingan.value >= 9;
});

const formConfig = computed(() => {
  // Cast semua status ke Number, tapi biarkan null tetap null
  const statusList = [
    statusBerkasNaskahTA.value,
    statusBerkasTranskripNilai.value,
    statusBerkasKRS.value,
    statusBerkasBuktiPersetujuanPembimbing.value,
    statusBerkasBuktiSertifikatKompetensi.value,
    statusBerkasSertifikatTOEIC.value,
    statusBerkasBeritaAcaraSeminarHasil.value,
    statusBerkasSuratPerpanjanganMasaStudi.value,
  ];

  // Cek apakah semua status dan judul masih null (belum pernah submit)
  const semuaNull = statusList.every(s => s === null) && !judulTugasAkhir.value;

  let isDisabled = false;
  let status = STATUS.NULL;

  if (semuaNull) {
    isDisabled = false;
    status = STATUS.NULL;
  } else if (statusList.map(Number).includes(2)) {
    isDisabled = false;
    status = STATUS.REJECTED;
  } else if (statusList.map(Number).every(s => s === 1)) {
    isDisabled = true;
    status = STATUS.ACCEPTED;
  } else if (statusList.map(Number).some(s => s === 0)) {
    isDisabled = true;
    status = STATUS.WAITING;
  }

  return {
    isDisabled,
    wrapperClass: isDisabled ? 'opacity-50' : '',
    showSubmitButton: status === STATUS.NULL || status === STATUS.REJECTED,
    status
  };
});

// Ganti statusPendaftaran dengan computed dari status formConfig
const statusPendaftaran = computed(() => formConfig.value.status);

// userDataConfig juga gunakan statusPendaftaran yang baru
const userDataConfig = computed(() => {
  const config = {
    headText: "Dosen Pembimbing",
    bodyText: dosenPembimbing.value,
    headText2: "Kategori TA",
    bodyText2: kategoriTA.value,
    tahunAjaran: tahunAjaranTA.value,
    showStatus: statusValid.value !== null && statusValid.value !== undefined,
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

// Disabled logic
const isNaskahDisabled = computed(() => {
  if (statusBerkasNaskahTA.value === null || statusBerkasNaskahTA.value === undefined) return false;
  const status = Number(statusBerkasNaskahTA.value);
  return status === STATUS.WAITING || status === STATUS.ACCEPTED;
});
const isTranskripDisabled = computed(() => {
  if (statusBerkasTranskripNilai.value === null || statusBerkasTranskripNilai.value === undefined) return false;
  const status = Number(statusBerkasTranskripNilai.value);
  return status === STATUS.WAITING || status === STATUS.ACCEPTED;
});
const isKRSDisabled = computed(() => {
  if (statusBerkasKRS.value === null || statusBerkasKRS.value === undefined) return false;
  const status = Number(statusBerkasKRS.value);
  return status === STATUS.WAITING || status === STATUS.ACCEPTED;
});
const isBuktiPersetujuanPembimbingDisabled = computed(() => {
  if (statusBerkasBuktiPersetujuanPembimbing.value === null || statusBerkasBuktiPersetujuanPembimbing.value === undefined) return false;
  const status = Number(statusBerkasBuktiPersetujuanPembimbing.value);
  return status === STATUS.WAITING || status === STATUS.ACCEPTED;
});
const isBuktiSertifikatKompetensiDisabled = computed(() => {
  if (statusBerkasBuktiSertifikatKompetensi.value === null || statusBerkasBuktiSertifikatKompetensi.value === undefined) return false;
  const status = Number(statusBerkasBuktiSertifikatKompetensi.value);
  return status === STATUS.WAITING || status === STATUS.ACCEPTED;
});
const isSertifikatTOEICDisabled = computed(() => {
  if (statusBerkasSertifikatTOEIC.value === null || statusBerkasSertifikatTOEIC.value === undefined) return false;
  const status = Number(statusBerkasSertifikatTOEIC.value);
  return status === STATUS.WAITING || status === STATUS.ACCEPTED;
});
const isBeritaAcaraSeminarHasilDisabled = computed(() => {
  if (statusBerkasBeritaAcaraSeminarHasil.value === null || statusBerkasBeritaAcaraSeminarHasil.value === undefined) return false;
  const status = Number(statusBerkasBeritaAcaraSeminarHasil.value);
  return status === STATUS.WAITING || status === STATUS.ACCEPTED;
});
const isSuratPerpanjanganMasaStudiDisabled = computed(() => {
  if (statusBerkasSuratPerpanjanganMasaStudi.value === null || statusBerkasSuratPerpanjanganMasaStudi.value === undefined) return false;
  const status = Number(statusBerkasSuratPerpanjanganMasaStudi.value);
  return status === STATUS.WAITING || status === STATUS.ACCEPTED;
});

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

  <div v-else-if="loadingTugasAkhir || loadingBerkasTA || loadingJadwalUjianTA"
    class="flex items-center justify-center min-h-[80dvh]">
    <Loading />
  </div>

  <div v-else-if="errorTugasAkhir || errorBerkasTA || errorJadwalUjianTA" class="p-4">
    <ErrorMsg :msg="errorTugasAkhir || errorBerkasTA || errorJadwalUjianTA" />
  </div>

  <div v-else>
    <div>
      <!-- Not Enough Bimbingan State -->
      <div v-if="!minimalBimbingan" class="h-[80vh] flex flex-col justify-center items-center gap-4">
        <h1 class="text-center heading5 sm:heading4 lg:heading3 text-placeholder">
          Minimal bimbingan anda belum terpenuhi.
        </h1>
        <router-link to="bimbingan">
          <Button class="hidden sm:flex" variant="primary" size="lg"
            rightIconPath="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25">
            Bimbingan
          </Button>
          <Button class="sm:hidden" variant="primary" size="md"
            rightIconPath="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25">
            Bimbingan
          </Button>
        </router-link>
      </div>

      <!-- Main Content when minimal bimbingan is met -->
      <template v-if="minimalBimbingan">
        <Breadcrumb />

        <div class="p-4 bg-white card-rounded lg:p-8">
          <!-- User Data Section -->
          <div class="pb-6 mx-auto max-w-screen-2xl">
            <UserData v-bind="userDataConfig" />
          </div>

          <!-- Form Section -->
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
            <div class="flex flex-col gap-4">
              <!-- Common form fields -->
              <InputText :class="formConfig.wrapperClass" id="judul-ta" label="Judul Tugas Akhir" placeholder="Masukkan judul tugas akhir"
                v-model="judulTugasAkhir" :value="judulTugasAkhir" :disabled="formConfig.isDisabled" />

              <!-- All the file uploads -->
              <InputFile :class="`${formConfig.wrapperClass} ${isNaskahDisabled ? 'opacity-50' : ''}`" id="naskah-ta" label="Naskah Tugas Akhir" v-model="fileNaskahTA" :existingFileName="naskahTA"
                :existingFileUrl="fileNaskahTA" :disabled="isNaskahDisabled" />

              <InputFile :class="`${formConfig.wrapperClass} ${isKRSDisabled ? 'opacity-50' : ''}`" id="krs-semester-terakhir" label="Scan KRS Semester Terakhir" v-model="fileKRS"
                :existingFileName="krs" :existingFileUrl="fileKRS" :disabled="isKRSDisabled" />

              <InputFile :class="`${formConfig.wrapperClass} ${isBuktiPersetujuanPembimbingDisabled ? 'opacity-50' : ''}`" id="bukti-persetujuan-pembimbing" label="Bukti Persetujuan Pembimbing"
                v-model="filePersetujuanPembimbing" :existingFileName="buktiPersetujuanPembimbing"
                :existingFileUrl="fileBuktiPersetujuanPembimbing" :disabled="isBuktiPersetujuanPembimbingDisabled" />

              <InputFile :class="`${formConfig.wrapperClass} ${isTranskripDisabled ? 'opacity-50' : ''}`" id="transkrip-nilai-mahasiswa" label="Transkrip Nilai Mahasiswa" v-model="fileTranskrip"
                :existingFileName="transkripNilai" :existingFileUrl="fileTranskripNilai"
                :disabled="isTranskripDisabled" />

              <InputFile :class="`${formConfig.wrapperClass} ${isBuktiSertifikatKompetensiDisabled ? 'opacity-50' : ''}`" id="bukti-sertifikat-kompetensi" label="Bukti Sertifikat Kompetensi" v-model="fileSertifikat"
                :existingFileName="buktiSertifikatKompetensi" :existingFileUrl="fileBuktiSertifikatKompetensi"
                :disabled="isBuktiSertifikatKompetensiDisabled" />

              <InputFile :class="`${formConfig.wrapperClass} ${isSertifikatTOEICDisabled ? 'opacity-50' : ''}`" id="sertifikat-toeic" label="Sertifikat TOEIC" v-model="fileTOEIC"
                :existingFileName="sertifikatTOEIC" :existingFileUrl="fileSertifikatTOEIC"
                :disabled="isSertifikatTOEICDisabled" />

              <InputFile :class="`${formConfig.wrapperClass} ${isBeritaAcaraSeminarHasilDisabled ? 'opacity-50' : ''}`" id="berita-acara-seminar-hasil" label="Berita Acara Seminar Hasil" v-model="fileBeritaAcara"
                :existingFileName="beritaAcaraSeminarHasil" :existingFileUrl="fileBeritaAcaraSeminarHasil"
                :disabled="isBeritaAcaraSeminarHasilDisabled" />

              <!-- Optional field -->
              <InputFile :class="`${formConfig.wrapperClass} ${isSuratPerpanjanganMasaStudiDisabled ? 'opacity-50' : ''}`" id="surat-perpanjangan-masa-studi" label="Surat Perpanjangan Masa Studi"
                v-model="filePerpanjanganMasaStudi" :existingFileName="suratPerpanjanganMasaStudi"
                :existingFileUrl="fileSuratPerpanjanganMasaStudi" :disabled="isSuratPerpanjanganMasaStudiDisabled" />
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center self-end gap-4">
              <!-- Submit Button - show for new or rejected application -->
              <template v-if="formConfig.showSubmitButton">
                <Button variant="primary" size="lg" type="submit" class="self-end hidden w-fit sm:flex">
                  Kirim
                </Button>
                <Button variant="primary" size="md" type="submit" class="self-end w-fit sm:hidden">
                  Kirim
                </Button>
              </template>

              <!-- Action Buttons - show for accepted application -->
              <template v-if="statusPendaftaran === STATUS.ACCEPTED">
                <!-- Schedule tooltip and button -->
                <Tooltip v-if="!terjadwal" text="Menunggu Dijadwalkan" size="md" position="left">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                </Tooltip>

                <Button @click="showModal" type="button" variant="success" size="lg" class="hidden w-fit sm:flex"
                  :class="!terjadwal ? 'opacity-50' : 'opacity-100'" :disabled="!terjadwal">
                  Lihat Jadwal
                </Button>

                <Button @click="showModal" type="button" variant="success" size="md" class="w-fit sm:hidden"
                  :class="!terjadwal ? 'opacity-50' : 'opacity-100'" :disabled="!terjadwal">
                  Lihat Jadwal
                </Button>

                <!-- Detail Button -->
                <router-link to="ujian-ta/detail-ujian-ta">
                  <Button type="button" variant="primary" size="lg" class="hidden w-fit sm:flex">
                    Detail
                  </Button>

                  <Button type="button" variant="primary" size="md" class="w-fit sm:hidden">
                    Detail
                  </Button>
                </router-link>
              </template>
            </div>
          </form>

          <!-- Schedule Modal -->
          <DefaultModal v-if="modalRef" @close="modalRef = false" headText="Jadwal Ujian Tugas Akhir"
          :bodyText="`${username} | ${nim} | ${judulTugasAkhir}`">
            <JadwalUjian :examiners="daftarPenguji" :jadwal="jadwalUjianTA" />
          </DefaultModal>
        </div>
      </template>
    </div>
  </div>
</template>

