<script setup>
import { ref, computed, onMounted } from 'vue';
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
import {
  useProposal,
  hasPembimbing,
  dinilai,
  naskahProposalTA,
  naskahProposalTAStatus,
  fileNaskahProposalTA,
  transkripNilaiMahasiswa,
  transkripNilaiMahasiswaStatus,
  fileTranskripNilaiMahasiswa,
  nilaiProposalTA,
  catatanProposalTA,
  userDataConfig,
  formConfig,
  STATUS,
  judulProposalTA,

} from '@/services/TugasAkhir/Mhs/proposal.js';

const { loadingProposal, errorProposal } = useProposal();

// App State
const modalRef = ref(false);

// User form inputs
const judulProposal = ref('');
const fileProposal = ref(null);
const fileTranskrip = ref(null);

// Methods
const showModal = () => {
  modalRef.value = true;
};

const handleSubmit = () => {
  // Implement form submission logic here
  console.log('Form submitted');
};

// Disabled logic
const isNaskahDisabled = computed(() =>
  Number(naskahProposalTAStatus.value) === STATUS.WAITING ||
  Number(naskahProposalTAStatus.value) === STATUS.ACCEPTED
);

const isTranskripDisabled = computed(() =>
  Number(transkripNilaiMahasiswaStatus.value) === STATUS.WAITING ||
  Number(transkripNilaiMahasiswaStatus.value) === STATUS.ACCEPTED
);
</script>

<template>
  <div v-if="loadingProposal" class="flex items-center justify-center min-h-[80dvh]">
    <Loading />
  </div>

  <div v-else-if="errorProposal" class="p-4">
    <ErrorMsg :msg="errorProposal" />
  </div>

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
          <div class="flex flex-col gap-4">
            <InputText :class="formConfig.wrapperClass" id="judul-proposal-ta" label="Judul Proposal Tugas Akhir"
              placeholder="Masukkan judul proposal tugas akhir" v-model="judulProposal" :value="judulProposalTA"
              :disabled="formConfig.isDisabled" />
            <InputFile :class="`${formConfig.wrapperClass} ${isNaskahDisabled ? 'opacity-50' : ''}`"
              id="naskah-proposal-ta" label="Naskah Proposal Tugas Akhir" v-model="fileProposal"
              :existingFileName="naskahProposalTA" :existingFileUrl="fileNaskahProposalTA"
              :disabled="isNaskahDisabled" />
            <InputFile :class="`${formConfig.wrapperClass} ${isTranskripDisabled ? 'opacity-50' : ''}`"
              id="transkrip-nilai-mahasiswa" label="Transkrip Nilai Mahasiswa" v-model="fileTranskrip"
              :existingFileName="transkripNilaiMahasiswa" :existingFileUrl="fileTranskripNilaiMahasiswa"
              :disabled="isTranskripDisabled" />
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
              v-if="naskahProposalTAStatus === STATUS.ACCEPTED && transkripNilaiMahasiswaStatus === STATUS.ACCEPTED">
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
          <InputText id="nilai-proposal-ta" label="Nilai Proposal Tugas Akhir" v-model="nilaiProposalTA"
            :value="nilaiProposalTA" :disabled="true" />
          <InputTextarea id="catatan-proposal-ta" label="Catatan" v-model="catatanProposalTA" :value="catatanProposalTA"
            :disabled="true" />
        </div>
      </DefaultModal>
    </template>
  </template>
</template>