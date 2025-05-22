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

const proposalData = reactive({
  id: 1,
  judul_proposal: "Pengembangan El Pikir Satu Dua Tiga",
  naskah_proposal: "naskah-proposal-ta.pdf",
  naskah_proposal_url: filePDF,
  naskah_proposal_status_valid: 0, 
  file_transkrip: "transkrip-nilai-mahasiswa.pdf",
  file_transkrip_url: filePDF,
  file_transkrip_status_valid: 0,
});

// Variabel sementara untuk validasi (untuk radio)
const tempValidasi = reactive({
  naskah_proposal_status_valid: proposalData.naskah_proposal_status_valid,
  file_transkrip_status_valid: proposalData.file_transkrip_status_valid,
});

const fileNaskahProposal = {
  name: proposalData.naskah_proposal,
  url: proposalData.naskah_proposal_url,
};
const fileTranskrip = {
  name: proposalData.file_transkrip,
  url: proposalData.file_transkrip_url,
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
})
const naskahRef = ref(null);
const transkripRef = ref(null);

const handleValidasi = () => {
  naskahRef.value.submitValidation();
  transkripRef.value.submitValidation();
  proposalData.naskah_proposal_status_valid = tempValidasi.naskah_proposal_status_valid;
  proposalData.file_transkrip_status_valid = tempValidasi.file_transkrip_status_valid;
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
        :fileFromDatabase="fileNaskahProposal"
        :statusValid="tempValidasi.naskah_proposal_status_valid"
        @update:statusValid="tempValidasi.naskah_proposal_status_valid = $event"
      />
      <ValidationFile
        ref="transkripRef"
        id="transkrip-nilai-mahasiswa"
        label="Transkrip Nilai Mahasiswa"
        :fileFromDatabase="fileTranskrip"
        :statusValid="tempValidasi.file_transkrip_status_valid"
        @update:statusValid="tempValidasi.file_transkrip_status_valid = $event"
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