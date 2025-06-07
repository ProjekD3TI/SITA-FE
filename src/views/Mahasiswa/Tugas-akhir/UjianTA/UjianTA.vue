<script setup>
import { ref, computed, reactive, watch } from "vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputFile from "@/components/Tugas-akhir/Forms/InputFile.vue";
import UserData from "@/components/Tugas-akhir/UserData.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import Tooltip from "@/components/Tugas-akhir/Tooltip.vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import JadwalUjian from "@/components/Tugas-akhir/JadwalUjian.vue";
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
  daftarPenguji,
} from "@/services/TugasAkhir/Mhs/ujianTA.js";
import { getUserData } from "@/services/authMahasiswa";
import { useToast } from "vue-toastification";

const userData = getUserData();
const username = userData?.name || userData?.email?.split("@")[0] || "User";
const nim = userData?.nim || "";

const {
  loadingTugasAkhir,
  errorTugasAkhir,
  submitUjianTA,
  updateUjianTA,
  fetchData,
  dataTugasAkhir,
} = useTugasAkhir();
const { loadingBerkasTA, errorBerkasTA, fetchDataBerkas } = useBerkasTA();
const { loadingJadwalUjianTA, errorJadwalUjianTA, dataJadwalUjianTA } =
  useJadwalUjianTA();
const toast = useToast();

const terjadwal = computed(
  () =>
    dataJadwalUjianTA.value?.ujian_ta?.id !== null &&
    dataJadwalUjianTA.value?.ujian_ta?.id !== undefined
);

const STATUS = {
  NULL: null,
  WAITING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
};

// App State
const modalRef = ref(false);

// Form file inputs
const judulTA = ref("");
const fileNaskah = ref(null);
const fileTranskrip = ref(null);
const fileKRSLocal = ref(null);
const filePersetujuanPembimbing = ref(null);
const fileSertifikatKompetensi = ref(null);
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
  const semuaNull =
    statusList.every((s) => s === null) && !judulTugasAkhir.value;

  let isDisabled = false;
  let status = STATUS.NULL;

  if (semuaNull) {
    isDisabled = false;
    status = STATUS.NULL;
  } else if (statusList.map(Number).includes(2)) {
    isDisabled = false;
    status = STATUS.REJECTED;
  } else if (statusList.map(Number).every((s) => s === 1)) {
    isDisabled = true;
    status = STATUS.ACCEPTED;
  } else if (statusList.map(Number).some((s) => s === 0)) {
    isDisabled = true;
    status = STATUS.WAITING;
  }

  return {
    isDisabled,
    wrapperClass: isDisabled ? "opacity-50" : "",
    showSubmitButton: status === STATUS.NULL,
    showSubmitAgainButton: status === STATUS.REJECTED,
    status,
  };
});

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
    switch (statusValid.value) {
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

// Helper modular untuk disabled file input
function isFileDisabled(status) {
  if (status === null || status === undefined) return false;
  const s = Number(status);
  return s === STATUS.WAITING || s === STATUS.ACCEPTED;
}

// Modular computed untuk setiap file
const isNaskahDisabled = computed(() =>
  isFileDisabled(statusBerkasNaskahTA.value)
);
const isTranskripDisabled = computed(() =>
  isFileDisabled(statusBerkasTranskripNilai.value)
);
const isKRSDisabled = computed(() => isFileDisabled(statusBerkasKRS.value));
const isBuktiPersetujuanPembimbingDisabled = computed(() =>
  isFileDisabled(statusBerkasBuktiPersetujuanPembimbing.value)
);
const isBuktiSertifikatKompetensiDisabled = computed(() =>
  isFileDisabled(statusBerkasBuktiSertifikatKompetensi.value)
);
const isSertifikatTOEICDisabled = computed(() =>
  isFileDisabled(statusBerkasSertifikatTOEIC.value)
);
const isBeritaAcaraSeminarHasilDisabled = computed(() =>
  isFileDisabled(statusBerkasBeritaAcaraSeminarHasil.value)
);
const isSuratPerpanjanganMasaStudiDisabled = computed(() =>
  isFileDisabled(statusBerkasSuratPerpanjanganMasaStudi.value)
);

// Methods
const showModal = () => {
  modalRef.value = true;
};

const handleSubmit = async () => {
  // Validasi field wajib
  if (
    !judulTA.value ||
    !fileNaskah.value ||
    !fileTranskrip.value ||
    !fileKRSLocal.value ||
    !filePersetujuanPembimbing.value ||
    !fileSertifikatKompetensi.value ||
    !fileTOEIC.value ||
    !fileBeritaAcara.value
  ) {
    toast.error("Semua field wajib harus diisi!");
    return;
  }
  const payload = {
    judul_ta: judulTA.value,
    file_naskah: fileNaskah.value,
    file_transkrip: fileTranskrip.value,
    file_krs: fileKRSLocal.value,
    file_persetujuan_pembimbing: filePersetujuanPembimbing.value,
    file_sertifikat_kompetensi: fileSertifikatKompetensi.value,
    file_toeic: fileTOEIC.value,
    file_berita_acara: fileBeritaAcara.value,
    file_perpanjangan_masa_studi: filePerpanjanganMasaStudi.value,
  };
  const success = await submitUjianTA(payload);
  if (success) {
    fetchData();
    fetchDataBerkas();
    // toast.success('Pengajuan Ujian TA berhasil dikirim!');
  } else {
    toast.error("Gagal mengirim pengajuan Ujian TA.");
  }
};

const handleUpdate = async () => {
  const id = dataTugasAkhir.value?.tugas_akhir?.id;
  if (!id) {
    toast.error("ID Tugas Akhir tidak ditemukan!");
    return;
  }
  if (!judulTA.value) {
    toast.error("Judul Tugas Akhir harus diisi/diperbarui!");
    return;
  }
  if (!isNaskahDisabled.value && !fileNaskah.value) {
    toast.error("File Naskah Tugas Akhir harus diisi/diperbarui!");
    return;
  }
  if (!isTranskripDisabled.value && !fileTranskrip.value) {
    toast.error("File Transkrip Nilai Mahasiswa harus diisi/diperbarui!");
    return;
  }
  if (!isKRSDisabled.value && !fileKRSLocal.value) {
    toast.error("File Scan KRS Semester Terakhir harus diisi/diperbarui!");
    return;
  }
  if (
    !isBuktiPersetujuanPembimbingDisabled.value &&
    !filePersetujuanPembimbing.value
  ) {
    toast.error("File Bukti Persetujuan Pembimbing harus diisi/diperbarui!");
    return;
  }
  if (
    !isBuktiSertifikatKompetensiDisabled.value &&
    !fileSertifikatKompetensi.value
  ) {
    toast.error("File Bukti Sertifikat Kompetensi harus diisi/diperbarui!");
    return;
  }
  if (!isSertifikatTOEICDisabled.value && !fileTOEIC.value) {
    toast.error("File Sertifikat TOEIC harus diisi/diperbarui!");
    return;
  }
  if (!isBeritaAcaraSeminarHasilDisabled.value && !fileBeritaAcara.value) {
    toast.error("File Berita Acara Seminar Hasil harus diisi/diperbarui!");
    return;
  }

  const payload = {
    id,
    judul_ta: judulTA.value,
    file_naskah: fileNaskah.value,
    file_transkrip: fileTranskrip.value,
    file_krs: fileKRSLocal.value,
    file_persetujuan_pembimbing: filePersetujuanPembimbing.value,
    file_sertifikat_kompetensi: fileSertifikatKompetensi.value,
    file_toeic: fileTOEIC.value,
    file_berita_acara: fileBeritaAcara.value,
    file_perpanjangan_masa_studi: filePerpanjanganMasaStudi.value,
  };
  const success = await updateUjianTA(payload);
  if (success) {
    fetchData();
    fetchDataBerkas();
    // toast.success('Pengajuan Ujian TA berhasil diupdate!');
  } else {
    toast.error("Gagal mengupdate pengajuan Ujian TA.");
  }
};

watch(
  () => judulTugasAkhir.value,
  (val) => {
    // Selalu update judulTA jika belum pernah diubah user
    if (!judulTA.value) {
      judulTA.value = val || "";
    }
  },
  { immediate: true }
);
</script>

<template>
  <router-view v-if="$route.path.includes('detail-ujian-ta')"></router-view>

  <div
    v-else-if="loadingTugasAkhir || loadingBerkasTA || loadingJadwalUjianTA"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>

  <!-- <div
    v-else-if="errorTugasAkhir || errorBerkasTA || errorJadwalUjianTA"
    class="p-4"
  >
    <ErrorMsg :msg="errorTugasAkhir || errorBerkasTA || errorJadwalUjianTA" />
  </div> -->

  <div v-else>
    <div>
      <!-- Not Enough Bimbingan State -->
      <div
        v-if="!minimalBimbingan"
        class="h-[80vh] flex flex-col justify-center items-center gap-4"
      >
        <h1
          class="text-center heading5 sm:heading4 lg:heading3 text-placeholder"
        >
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

      <div
        v-else-if="
          dataTugasAkhir?.status_form?.is_open == false &&
          dataTugasAkhir?.tugas_akhir?.status_valid == null
        "
        class="h-[80vh] flex flex-col justify-center items-center gap-4"
      >
        <h1
          class="text-center heading5 sm:heading4 lg:heading3 text-placeholder"
        >
          Form ujian tugas akhir saat ini tidak dibuka, silakan tunggu
          pengumuman selanjutnya.
        </h1>
      </div>

      <!-- Main Content when minimal bimbingan is met -->
      <template v-else>
        <Breadcrumb />

        <div class="p-4 bg-white card-rounded lg:p-8">
          <!-- User Data Section -->
          <div class="pb-6 mx-auto max-w-screen-2xl">
            <UserData v-bind="userDataConfig" />
          </div>

          <!-- Form Section -->
          <form
            @submit.prevent="handleSubmit"
            class="flex flex-col gap-4 mx-auto max-w-screen-2xl"
          >
            <div class="flex flex-col gap-4">
              <!-- Common form fields -->
              <InputText
                :class="formConfig.wrapperClass"
                id="judul-ta"
                label="Judul Tugas Akhir"
                placeholder="Masukkan judul tugas akhir"
                v-model="judulTA"
                :disabled="formConfig.isDisabled"
                :required="true"
              />

              <!-- All the file uploads -->
              <InputFile
                :class="`${formConfig.wrapperClass} ${
                  isNaskahDisabled ? 'opacity-50' : ''
                }`"
                id="naskah-ta"
                label="Naskah Tugas Akhir"
                v-model="fileNaskah"
                :existingFileName="naskahTA"
                :existingFileUrl="fileNaskahTA"
                :disabled="isNaskahDisabled"
                :required="true"
              />

              <InputFile
                :class="`${formConfig.wrapperClass} ${
                  isKRSDisabled ? 'opacity-50' : ''
                }`"
                id="krs-semester-terakhir"
                label="Scan KRS Semester Terakhir"
                v-model="fileKRSLocal"
                :existingFileName="krs"
                :existingFileUrl="fileKRS"
                :disabled="isKRSDisabled"
                :required="true"
              />

              <InputFile
                :class="`${formConfig.wrapperClass} ${
                  isBuktiPersetujuanPembimbingDisabled ? 'opacity-50' : ''
                }`"
                id="bukti-persetujuan-pembimbing"
                label="Bukti Persetujuan Pembimbing"
                v-model="filePersetujuanPembimbing"
                :existingFileName="buktiPersetujuanPembimbing"
                :existingFileUrl="fileBuktiPersetujuanPembimbing"
                :disabled="isBuktiPersetujuanPembimbingDisabled"
                :required="true"
              />

              <InputFile
                :class="`${formConfig.wrapperClass} ${
                  isTranskripDisabled ? 'opacity-50' : ''
                }`"
                id="transkrip-nilai-mahasiswa"
                label="Transkrip Nilai Mahasiswa"
                v-model="fileTranskrip"
                :existingFileName="transkripNilai"
                :existingFileUrl="fileTranskripNilai"
                :disabled="isTranskripDisabled"
                :required="true"
              />

              <InputFile
                :class="`${formConfig.wrapperClass} ${
                  isBuktiSertifikatKompetensiDisabled ? 'opacity-50' : ''
                }`"
                id="bukti-sertifikat-kompetensi"
                label="Bukti Sertifikat Kompetensi"
                v-model="fileSertifikatKompetensi"
                :existingFileName="buktiSertifikatKompetensi"
                :existingFileUrl="fileBuktiSertifikatKompetensi"
                :disabled="isBuktiSertifikatKompetensiDisabled"
                :required="true"
              />

              <InputFile
                :class="`${formConfig.wrapperClass} ${
                  isSertifikatTOEICDisabled ? 'opacity-50' : ''
                }`"
                id="sertifikat-toeic"
                label="Sertifikat TOEIC"
                v-model="fileTOEIC"
                :existingFileName="sertifikatTOEIC"
                :existingFileUrl="fileSertifikatTOEIC"
                :disabled="isSertifikatTOEICDisabled"
                :required="true"
              />

              <InputFile
                :class="`${formConfig.wrapperClass} ${
                  isBeritaAcaraSeminarHasilDisabled ? 'opacity-50' : ''
                }`"
                id="berita-acara-seminar-hasil"
                label="Berita Acara Seminar Hasil"
                v-model="fileBeritaAcara"
                :existingFileName="beritaAcaraSeminarHasil"
                :existingFileUrl="fileBeritaAcaraSeminarHasil"
                :disabled="isBeritaAcaraSeminarHasilDisabled"
                :required="true"
              />

              <!-- Optional field -->
              <InputFile
                :class="`${formConfig.wrapperClass} ${
                  isSuratPerpanjanganMasaStudiDisabled ? 'opacity-50' : ''
                }`"
                id="surat-perpanjangan-masa-studi"
                label="Surat Perpanjangan Masa Studi"
                v-model="filePerpanjanganMasaStudi"
                :existingFileName="suratPerpanjanganMasaStudi"
                :existingFileUrl="fileSuratPerpanjanganMasaStudi"
                :disabled="isSuratPerpanjanganMasaStudiDisabled"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center self-end gap-2 sm:gap-4">
              <!-- Submit Button - show for new or rejected application -->
              <template v-if="formConfig.showSubmitButton">
                <Button
                  variant="primary"
                  size="lg"
                  type="button"
                  class="self-end hidden w-fit sm:flex"
                  @click="handleSubmit"
                >
                  Kirim
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="button"
                  class="self-end w-fit sm:hidden"
                  @click="handleSubmit"
                >
                  Kirim
                </Button>
              </template>

              <!-- Tombol Update untuk pengajuan ditolak -->
              <template v-if="formConfig.showSubmitAgainButton">
                <Button
                  variant="primary"
                  size="lg"
                  type="button"
                  class="self-end hidden w-fit sm:flex"
                  @click="handleUpdate"
                >
                  Kirim Ulang
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="button"
                  class="self-end w-fit sm:hidden"
                  @click="handleUpdate"
                >
                  Kirim Ulang
                </Button>
              </template>

              <!-- Action Buttons - show for accepted application -->
              <template v-if="statusValid === STATUS.ACCEPTED">
                <!-- Schedule tooltip and button -->
                <Tooltip
                  v-if="!terjadwal"
                  text="Menunggu Dijadwalkan"
                  size="md"
                  position="left"
                >
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
                  @click="showModal"
                  type="button"
                  variant="success"
                  size="lg"
                  class="hidden w-fit sm:flex"
                  :class="!terjadwal ? 'opacity-50' : 'opacity-100'"
                  :disabled="!terjadwal"
                >
                  Lihat Jadwal
                </Button>

                <Button
                  @click="showModal"
                  type="button"
                  variant="success"
                  size="md"
                  class="w-fit sm:hidden"
                  :class="!terjadwal ? 'opacity-50' : 'opacity-100'"
                  :disabled="!terjadwal"
                >
                  Lihat Jadwal
                </Button>

                <!-- Detail Button -->
                <router-link to="ujian-ta/detail-ujian-ta">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    class="hidden w-fit sm:flex"
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
            :bodyText="`${username} | ${nim} | ${judulTugasAkhir}`"
          >
            <JadwalUjian :examiners="daftarPenguji" :jadwal="jadwalUjianTA" />
          </DefaultModal>
        </div>
      </template>
    </div>
  </div>
</template>
