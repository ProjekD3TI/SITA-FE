<script setup>
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import InputTextArea from '@/components/Tugas-akhir/Forms/InputTextarea.vue';
import ValidationFile from '@/components/Tugas-akhir/Forms/ValidationFile.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import UserData from '@/components/Tugas-akhir/UserData.vue';
import ModalTimer from '@/components/Tugas-akhir/Modals/ModalTimer.vue';
import FilePDFDummy from '@/assets/SV-Undangan Sosialisasi Teknis dan Informasi Lomba OLIVIA Tahun 2025.pdf';
import { ref, computed, reactive } from 'vue';

const modalRef = ref(false);
const filePDF = FilePDFDummy;

// Data untuk Ujian TA
const daftarTugasAkhir = reactive({
  id: 1,
  judul_tugas_akhir: "Pengembangan El Pikir Satu Dua Tiga",
  naskah_ta: "naskah_ta.pdf",
  naskah_ta_url: filePDF,
  naskah_ta_status_valid: 0,
  krs: "krs.pdf",
  krs_url: filePDF,
  krs_status_valid: 0,
  persetujuan_pembimbing: "bukti_persetujuan_pembimbing.pdf",
  persetujuan_pembimbing_url: filePDF,
  persetujuan_pembimbing_status_valid: 0,
  file_transkrip: "transkrip.pdf",
  file_transkrip_url: filePDF,
  file_transkrip_status_valid: 0,
  sertifikat_kompetensi: "sertifikat_kompetensi.pdf",
  sertifikat_kompetensi_url: filePDF,
  sertifikat_kompetensi_status_valid: 0,
  toeic: "sertifikat_toeic.pdf",
  toeic_url: filePDF,
  toeic_status_valid: 0,
  berita_acara_semhas: "berita_acara_semhas.pdf",
  berita_acara_semhas_url: filePDF,
  berita_acara_semhas_status_valid: 0,
  masa_perpanjangan_studi: "surat_perpanjangan_masa_studi.pdf",
  masa_perpanjangan_studi_url: filePDF,
  masa_perpanjangan_studi_status_valid: 0,
});

// Variabel sementara untuk validasi (untuk radio)
const tempValidasi = reactive({
  naskah_ta_status_valid: daftarTugasAkhir.naskah_ta_status_valid,
  krs_status_valid: daftarTugasAkhir.krs_status_valid,
  persetujuan_pembimbing_status_valid: daftarTugasAkhir.persetujuan_pembimbing_status_valid,
  file_transkrip_status_valid: daftarTugasAkhir.file_transkrip_status_valid,
  sertifikat_kompetensi_status_valid: daftarTugasAkhir.sertifikat_kompetensi_status_valid,
  toeic_status_valid: daftarTugasAkhir.toeic_status_valid,
  berita_acara_semhas_status_valid: daftarTugasAkhir.berita_acara_semhas_status_valid,
  masa_perpanjangan_studi_status_valid: daftarTugasAkhir.masa_perpanjangan_studi_status_valid,
});

const fileNaskahTA = {
  name: daftarTugasAkhir.naskah_ta,
  url: daftarTugasAkhir.naskah_ta_url,
};
const fileKRS = {
  name: daftarTugasAkhir.krs,
  url: daftarTugasAkhir.krs_url,
};
const filePersetujuanPembimbing = {
  name: daftarTugasAkhir.persetujuan_pembimbing,
  url: daftarTugasAkhir.persetujuan_pembimbing_url,
};
const fileTranskrip = {
  name: daftarTugasAkhir.file_transkrip,
  url: daftarTugasAkhir.file_transkrip_url,
};
const fileSertifikatKompetensi = {
  name: daftarTugasAkhir.sertifikat_kompetensi,
  url: daftarTugasAkhir.sertifikat_kompetensi_url,
};
const fileTOEIC = {
  name: daftarTugasAkhir.toeic,
  url: daftarTugasAkhir.toeic_url,
};
const fileBeritaAcaraSemhas = {
  name: daftarTugasAkhir.berita_acara_semhas,
  url: daftarTugasAkhir.berita_acara_semhas_url,
};
const fileMasaPerpanjanganStudi = {
  name: daftarTugasAkhir.masa_perpanjangan_studi,
  url: daftarTugasAkhir.masa_perpanjangan_studi_url,
};

const catatan = ref('');
const mahasiswa = ref({
    nim: 'V234567890',
    name: 'John Doe',
});
const tugas_akhir = ref({
    kategori: 'Internet of Things',
    judul_proposal_ta: 'Pengembangan Aplikasi Mobile',
    dosen_pembimbing: {
        name: 'Dr. Jane Smith',
        nik: '987654321',
        program_studi: 'D-3 Teknik Informatika'
    },
    tahun_ajaran: '2024/2025',
});

const naskahRef = ref(null);
const transkripRef = ref(null);
const krsRef = ref(null);
const persetujuanPembimbingRef = ref(null);
const sertifikatKompetensiRef = ref(null);
const toeicRef = ref(null);
const beritaAcaraSemhasRef = ref(null);
const masaPerpanjanganStudiRef = ref(null);

const handleValidasi = () => {
  naskahRef.value.submitValidation();
  krsRef.value.submitValidation();
  persetujuanPembimbingRef.value.submitValidation();
  transkripRef.value.submitValidation();
  sertifikatKompetensiRef.value.submitValidation();
  toeicRef.value.submitValidation();
  beritaAcaraSemhasRef.value.submitValidation();
  masaPerpanjanganStudiRef.value.submitValidation();
  daftarTugasAkhir.naskah_ta_status_valid = tempValidasi.naskah_ta_status_valid;
  daftarTugasAkhir.krs_status_valid = tempValidasi.krs_status_valid;
  daftarTugasAkhir.persetujuan_pembimbing_status_valid = tempValidasi.persetujuan_pembimbing_status_valid;
  daftarTugasAkhir.file_transkrip_status_valid = tempValidasi.file_transkrip_status_valid;
  daftarTugasAkhir.sertifikat_kompetensi_status_valid = tempValidasi.sertifikat_kompetensi_status_valid;
  daftarTugasAkhir.toeic_status_valid = tempValidasi.toeic_status_valid;
  daftarTugasAkhir.berita_acara_semhas_status_valid = tempValidasi.berita_acara_semhas_status_valid;
  daftarTugasAkhir.masa_perpanjangan_studi_status_valid = tempValidasi.masa_perpanjangan_studi_status_valid;
  modalRef.value = true;
};
</script>

<template>
  <Breadcrumb />
  <div class="card-rounded card-rounded bg-white p-4 lg:p-8">
    <div class="flex flex-col gap-4 max-w-screen-2xl mx-auto">
      <UserData
        :headText="mahasiswa.nim"
        :bodyText="mahasiswa.name"
        :headText2="tugas_akhir.kategori"
        :bodyText2="tugas_akhir.judul_proposal_ta"
        :tahunAjaran="tugas_akhir.tahun_ajaran"
      />                  
      <!-- All the file uploads -->
      <ValidationFile
        ref="naskahRef"
        id="naskah-ta"
        label="Naskah Tugas Akhir"
        :fileFromDatabase="fileNaskahTA"
        :statusValid="tempValidasi.naskah_ta_status_valid"
        @update:statusValid="tempValidasi.naskah_ta_status_valid = $event"
      />
      <ValidationFile
        ref="krsRef"
        id="krs-semester-terakhir"
        label="Scan KRS Semester Terakhir"
        :fileFromDatabase="fileKRS"
        :statusValid="tempValidasi.krs_status_valid"
        @update:statusValid="tempValidasi.krs_status_valid = $event"
      />
      <ValidationFile
        ref="persetujuanPembimbingRef"
        id="bukti-persetujuan-pembimbing"
        label="Bukti Persetujuan Pembimbing"
        :fileFromDatabase="filePersetujuanPembimbing"
        :statusValid="tempValidasi.persetujuan_pembimbing_status_valid"
        @update:statusValid="tempValidasi.persetujuan_pembimbing_status_valid = $event"
      />
      <ValidationFile
        ref="transkripRef"
        id="transkrip-nilai-mahasiswa"
        label="Transkrip Nilai Mahasiswa"
        :fileFromDatabase="fileTranskrip"
        :statusValid="tempValidasi.file_transkrip_status_valid"
        @update:statusValid="tempValidasi.file_transkrip_status_valid = $event"
      />
      <ValidationFile
        ref="sertifikatKompetensiRef"
        id="bukti-sertifikat-kompetensi"
        label="Bukti Sertifikat Kompetensi"
        :fileFromDatabase="fileSertifikatKompetensi"
        :statusValid="tempValidasi.sertifikat_kompetensi_status_valid"
        @update:statusValid="tempValidasi.sertifikat_kompetensi_status_valid = $event"
      />
      <ValidationFile
        ref="toeicRef"
        id="sertifikat-toeic"
        label="Sertifikat TOEIC"
        :fileFromDatabase="fileTOEIC"
        :statusValid="tempValidasi.toeic_status_valid"
        @update:statusValid="tempValidasi.toeic_status_valid = $event"
      />
      <ValidationFile
        ref="beritaAcaraSemhasRef"
        id="berita-acara-seminar-hasil"
        label="Berita Acara Seminar Hasil"
        :fileFromDatabase="fileBeritaAcaraSemhas"
        :statusValid="tempValidasi.berita_acara_semhas_status_valid"
        @update:statusValid="tempValidasi.berita_acara_semhas_status_valid = $event"
      />
      <ValidationFile
        ref="masaPerpanjanganStudiRef"
        id="surat-perpanjangan-masa-studi"
        label="Surat Perpanjangan Masa Studi"
        :fileFromDatabase="fileMasaPerpanjanganStudi"
        :statusValid="tempValidasi.masa_perpanjangan_studi_status_valid"
        @update:statusValid="tempValidasi.masa_perpanjangan_studi_status_valid = $event"
      />
      <InputTextArea
        id="catatan"
        label="Catatan"
        placeholder="Masukkan catatan"
        v-model="catatan"     
      />
      <Button
        variant="primary"
        class="w-fit self-end"
        size="lg"
        @click="handleValidasi"
      >
        Validasi                        
      </Button>
    </div>   
  </div>
  <ModalTimer
    v-if="modalRef"
    @close="modalRef = false"
    headText="Pastikan pengecekan berkas sudah benar."
    bodyText="Anda tidak dapat merubah status validasi yang telah terkirim."
    submitText="Validasi"
    :showCancel="false"
    :showSubmit="true"
    :enableTimer="true"
    :timerDuration="5"
  />
</template>