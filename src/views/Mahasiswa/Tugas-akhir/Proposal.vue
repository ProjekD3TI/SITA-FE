<script setup>
import { ref, computed } from 'vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import InputText from '@/components/Tugas-akhir/Forms/InputText.vue';
import InputFile from '@/components/Tugas-akhir/Forms/InputFile.vue';
import InputTextarea from '@/components/Tugas-akhir/Forms/InputTextarea.vue';
import UserData from '@/components/Tugas-akhir/UserData.vue';
import Loading from '@/components/Loading.vue';
import ErrorMsg from '@/components/ErrorMsg.vue';
import Tooltip from '@/components/Tugas-akhir/Tooltip.vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import DefaultModal from '@/components/Tugas-akhir/Modals/DefaultModal.vue';

// Demo PDF link for development
const filePDF = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

// App State
const loading = ref(false);
const error = ref(null);
const modalRef = ref(false);

// User form inputs
const judulProposal = ref('');
const fileProposal = ref(null);
const fileTranskrip = ref(null);

// Student state
const hasPembimbing = ref(true); // true jika sudah memiliki pembimbing, false jika belum
const dinilai = ref(true); // true jika sudah terjadwal, false jika belum

// Status constants for better readability
const STATUS = {
  WAITING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
  NULL: null
};

const dataProposal = ref({
  tugas_akhir: {
    dosen_pembimbing: {
      id: 1,
      nama: "Prof. Dr. Budi Santoso, M.Kom",
    },
    kategori_ta: {
      id: 1,
      nama: "Internet of Things",
    },
    tahun_ajaran: {
      id: 1,
      nama: "2023/2024",
    },
    proposal_id: 1,
    nilai_proposal: 80,
    catatan_proposal: "Proposal sudah sesuai dengan pedoman",
  },
  proposal: {
    id: 1,
    judul_proposal: "Pengembangan El Pikir Satu Dua Tiga",
    status_valid: 1,
    berkas: [
      {
        id: 1,
        nama_berkas: "Naskah Proposal Tugas Akhir",
        file_proposal: filePDF,
        status_valid: 1,
      },
      {
        id: 2,
        nama_berkas: "Transkrip Nilai Mahasiswa",
        file_proposal: filePDF,
        status_valid: 1,
      },
    ]
  }
});

// Demo data for proposal
const proposalData = {
  id: 1,
  judul_proposal: "Pengembangan El Pikir Satu Dua Tiga",
  file_proposal: "naskah-proposal-ta.pdf",
  file_proposal_url: filePDF,
  file_proposal_status_valid: 1,
  file_transkrip: "transkrip-nilai-mahasiswa.pdf",
  file_transkrip_url: filePDF,
  file_transkrip_status_valid: 1,
};
const overallStatus = computed(() => {
  // Jika salah satu status 2 (Ditolak), maka Ditolak
  if (
    proposalData.file_proposal_status_valid === STATUS.REJECTED ||
    proposalData.file_transkrip_status_valid === STATUS.REJECTED
  ) {
    return STATUS.REJECTED;
  }
  // Jika semua 1 (Diterima), maka Diterima
  if (
    proposalData.file_proposal_status_valid === STATUS.ACCEPTED &&
    proposalData.file_transkrip_status_valid === STATUS.ACCEPTED
  ) {
    return STATUS.ACCEPTED;
  }
  // Jika ada yang 0 (Menunggu), maka Menunggu
  if (
    proposalData.file_proposal_status_valid === STATUS.WAITING ||
    proposalData.file_transkrip_status_valid === STATUS.WAITING
  ) {
    return STATUS.WAITING;
  }
  // Default
  return STATUS.NULL;
});

// Demo data for tugas akhir results
const tugas_akhir = {
  nilai_proposal: 80,
  catatan_proposal: "Proposal sudah sesuai dengan pedoman",
};

const userDataConfig = computed(() => {
  const config = {
    headText: "Dosen Pembimbing",
    bodyText: "Prof. Dr. Budi Santoso, M.Kom",
    headText2: "Kategori TA",
    bodyText2: "Internet of Things",
    tahunAjaran: "2023/2024",
    showStatus: proposalData.file_proposal && proposalData.file_transkrip_status_valid !== null
  };

  if (config.showStatus) {
    switch (overallStatus.value) {
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
  const isDisabled =
    proposalData.file_proposal &&
    (overallStatus.value === STATUS.WAITING || overallStatus.value === STATUS.ACCEPTED);
  const isOpacity = isDisabled;

  return {
    isDisabled,
    wrapperClass: isOpacity ? 'opacity-50' : '',
    showSubmitButton:
      proposalData.file_proposal &&
      (overallStatus.value === STATUS.NULL || overallStatus.value === STATUS.REJECTED)
  };
});
// Methods
const showModal = () => {
  modalRef.value = true;
};

const handleSubmit = () => {
  // Implement form submission logic here
  console.log('Form submitted');
};
</script>

<template>
  <!-- Loading State -->
  <Loading v-if="loading" />

  <!-- Error State -->
  <ErrorMsg v-else-if="error" :msg="error" />

  <template v-else>
    <!-- No Pembimbing State -->
    <div v-if="!hasPembimbing" class="h-[80vh] flex flex-col justify-center items-center gap-4">
      <h1 class="text-center heading5 sm:heading4 lg:heading3 text-placeholder">
        Anda harus memiliki pembimbing terlebih dahulu, sebelum mendaftarkan proposal.
      </h1>
      <router-link to="bimbingan">
        <Button class="hidden sm:flex" variant="primary" size="lg"
          rightIconPath="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25">
          Request Pembimbing
        </Button>
        <Button class="sm:hidden" variant="primary" size="md"
          rightIconPath="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25">
          Request Pembimbing
        </Button>
      </router-link>
    </div>

    <!-- Has Pembimbing States -->
    <template v-if="hasPembimbing">
      <Breadcrumb />

      <div class="p-4 bg-white card-rounded lg:p-8">
        <!-- User Data Section -->
        <div class="pb-6 mx-auto max-w-screen-2xl">
          <UserData v-bind="userDataConfig" />
        </div>

        <!-- Form Section -->
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
          <div :class="formConfig.wrapperClass" class="flex flex-col gap-4">
            <InputText id="judul-proposal-ta" label="Judul Proposal Tugas Akhir"
              placeholder="Masukkan judul proposal tugas akhir" v-model="judulProposal"
              :value="proposalData.judul_proposal !== null ? proposalData.judul_proposal : ''"
              :disabled="formConfig.isDisabled" />
            <InputFile id="naskah-proposal-ta" label="Naskah Proposal Tugas Akhir" v-model="fileProposal"
              :existingFileName="proposalData.file_proposal ? proposalData.file_proposal : ''"
              :existingFileUrl="proposalData.file_proposal_url ? proposalData.file_proposal_url : ''"
              :disabled="formConfig.isDisabled" />
            <InputFile id="transkrip-nilai-mahasiswa" label="Transkrip Nilai Mahasiswa" v-model="fileTranskrip"
              :existingFileName="proposalData.file_transkrip ? proposalData.file_transkrip : ''"
              :existingFileUrl="proposalData.file_transkrip_url ? proposalData.file_transkrip_url : ''"
              :disabled="formConfig.isDisabled" />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center self-end gap-4">
            <!-- Submit Button - show for new proposal or rejected proposal -->
            <template v-if="formConfig.showSubmitButton">
              <Button variant="primary" size="lg" type="submit" class="self-end hidden w-fit sm:flex">
                Kirim
              </Button>
              <Button variant="primary" size="md" type="submit" class="self-end w-fit sm:hidden">
                Kirim
              </Button>
            </template>

            <!-- Nilai Button - show for accepted proposal -->
            <template
              v-if="proposalData.file_proposal_status_valid === STATUS.ACCEPTED && proposalData.file_transkrip_status_valid === STATUS.ACCEPTED">
              <Tooltip v-if="!dinilai" text="Menunggu Dinilai" size="md" position="left">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              </Tooltip>

              <Button variant="success" @click="showModal" type="button" size="lg"
                :class="`w-fit sm:flex hidden ${!dinilai ? 'opacity-50' : 'opacity-100'}`" :disabled="!dinilai">
                Lihat Nilai
              </Button>

              <Button variant="success" @click="showModal" type="button" size="md"
                :class="`w-fit sm:hidden ${!dinilai ? 'opacity-50' : 'opacity-100'}`" :disabled="!dinilai">
                Lihat Nilai
              </Button>
            </template>
          </div>
        </form>
      </div>

      <!-- Modal for viewing proposal score -->
      <DefaultModal v-if="modalRef" @close="modalRef = false" headText="Nilai Seminar Proposal"
        bodyText="Nama Mahasiswa | V3423999 | Judul Tugas Akhir">
        <div class="flex flex-col gap-4 mt-4">
          <InputText id="nilai-proposal-ta" label="Nilai Proposal Tugas Akhir" v-model="tugas_akhir.nilai_proposal"
            :value="tugas_akhir.nilai_proposal" :disabled="true" />
          <InputTextarea id="catatan-proposal-ta" label="Catatan" v-model="tugas_akhir.catatan_proposal"
            :value="tugas_akhir.catatan_proposal" :disabled="true" />
        </div>
      </DefaultModal>
    </template>
  </template>
</template>