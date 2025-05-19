<script setup>
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import InputText from '@/components/Tugas-akhir/Forms/InputText.vue';
import InputTextArea from '@/components/Tugas-akhir/Forms/InputTextarea.vue';
import ValidationFile from '@/components/Tugas-akhir/Forms/ValidationFile.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import UserData from '@/components/Tugas-akhir/UserData.vue';
import { ref, computed } from 'vue';

const PDF_SAMPLE = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

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
const fileNaskahTA = computed(() => ({
  name: daftarTugasAkhir.naskah_ta,
  url: daftarTugasAkhir.naskah_ta_url,
}));
const fileKRS = computed(() => ({
  name: daftarTugasAkhir.krs,
  url: daftarTugasAkhir.krs_url,
}));
const filePersetujuanPembimbing = computed(() => ({
  name: daftarTugasAkhir.persetujuan_pembimbing,
  url: daftarTugasAkhir.persetujuan_pembimbing_url,
}));
const fileTranskrip = computed(() => ({
  name: daftarTugasAkhir.file_transkrip,
  url: daftarTugasAkhir.file_transkrip_url,
}));
const fileSertifikatKompetensi = computed(() => ({
  name: daftarTugasAkhir.sertifikat_kompetensi,
  url: daftarTugasAkhir.sertifikat_kompetensi_url,
}));
const fileTOEIC = computed(() => ({
  name: daftarTugasAkhir.toeic,
  url: daftarTugasAkhir.toeic_url,
}));
const fileBeritaAcaraSemhas = computed(() => ({
  name: daftarTugasAkhir.berita_acara_semhas,
  url: daftarTugasAkhir.berita_acara_semhas_url,
}));
const fileMasaPerpanjanganStudi = computed(() => ({
  name: daftarTugasAkhir.masa_perpanjangan_studi,
  url: daftarTugasAkhir.masa_perpanjangan_studi_url,
}));
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
})
</script>
<template>
      <Breadcrumb :items="breadcrumbItems" />
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
                  id="naskah-ta"
                  label="Naskah Tugas Akhir"
                  :fileFromDatabase="fileNaskahTA"
                  />
                  
                  <ValidationFile
                  id="krs-semester-terakhir"
                  label="Scan KRS Semester Terakhir"
                  :fileFromDatabase="fileKRS"
                  />
                  
                  <ValidationFile
                  id="bukti-persetujuan-pembimbing"
                  label="Bukti Persetujuan Pembimbing"
                  :fileFromDatabase="filePersetujuanPembimbing"
                  />
                  
                  <ValidationFile
                  id="transkrip-nilai-mahasiswa"
                  label="Transkrip Nilai Mahasiswa"
                  :fileFromDatabase="fileTranskrip"
                  />
                  
                  <ValidationFile
                  id="bukti-sertifikat-kompetensi"
                  label="Bukti Sertifikat Kompetensi"
                  :fileFromDatabase="fileSertifikatKompetensi"
                  />
                  
                  <ValidationFile
                  id="sertifikat-toeic"
                  label="Sertifikat TOEIC"
                  :fileFromDatabase="fileTOEIC"
                  />
                  
                  <ValidationFile
                  id="berita-acara-seminar-hasil"
                  label="Berita Acara Seminar Hasil"
                  :fileFromDatabase="fileBeritaAcaraSemhas"
                  />

                  <!-- Optional field -->
                  <ValidationFile
                  id="surat-perpanjangan-masa-studi"
                  label="Surat Perpanjangan Masa Studi"
                  :fileFromDatabase="fileMasaPerpanjanganStudi"
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
                        @click="submitForm"
                  >
                        Validasi                        
                  </Button>
            </div>   
      </div>

</template>