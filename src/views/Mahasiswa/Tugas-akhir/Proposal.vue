<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputFile from "@/components/Tugas-akhir/Forms/InputFile.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import UserData from "@/components/Tugas-akhir/UserData.vue";
import Loading from "@/components/Loading.vue";
import QuillTextReader from "@/components/Tugas-akhir/Forms/QuillTextReader.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import Tooltip from "@/components/Tugas-akhir/Tooltip.vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
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
  statusForm,
} from "@/services/TugasAkhir/Mhs/proposal.js";
import { getUserData } from "@/services/authMahasiswa.js";
import { useToast } from "vue-toastification"; // Tambahkan ini

const userData = getUserData();
const username = userData?.name || userData?.email?.split("@")[0] || "User";
const nim = userData?.nim || "";

const {
  loadingProposal,
  errorProposal,
  fetchData,
  submitProposal,
  updateProposal,
  dataProposal,
} = useProposal();
const toast = useToast(); // Tambahkan ini

// App State
const modalRef = ref(false);

// User form inputs
const judulProposal = ref("");
const fileProposal = ref(null);
const fileTranskrip = ref(null);
const catatanPerbaikan = ref("");
// Methods

const dangerNaskah = computed(
  () => naskahProposalTAStatus.value === STATUS.REJECTED && !fileProposal.value
);
const dangerTranskrip = computed(
  () =>
    transkripNilaiMahasiswaStatus.value === STATUS.REJECTED &&
    !fileTranskrip.value
);
const showModal = () => {
  modalRef.value = true;
};

const handleSubmit = async () => {
  if (!judulProposal.value || !fileProposal.value || !fileTranskrip.value) {
    toast.error("Semua field harus diisi!");
    return;
  }
  const payload = {
    judul_proposal: judulProposal.value,
    file_proposal: fileProposal.value,
    file_transkrip: fileTranskrip.value,
  };
  const success = await submitProposal(payload);
  if (success) {
    fetchData();
    // Optional: reset form jika ingin
    // judulProposal.value = '';
    // fileProposal.value = null;
    // fileTranskrip.value = null;
  }
};

const handleUpdate = async () => {
  // Cek field yang tidak disable harus diisi
  if (!isNaskahDisabled.value && !fileProposal.value) {
    toast.error("File Naskah Proposal Tugas Akhir harus diisi/diperbarui!");
    return;
  }
  if (!isTranskripDisabled.value && !fileTranskrip.value) {
    toast.error("File Transkrip Nilai Mahasiswa harus diisi/diperbarui!");
    return;
  }
  if (!judulProposal.value) {
    toast.error("Judul Proposal harus diisi/diperbarui!");
    return;
  }
  const payload = {
    id: dataProposal.value?.proposal?.id,
    judul_proposal: judulProposal.value,
    file_proposal: fileProposal.value,
    file_transkrip: fileTranskrip.value,
  };
  const success = await updateProposal(payload);
  if (success) {
    fetchData();
    // Optional: reset form jika ingin
  }
  // console.log("judulProposal:", judulProposal.value);
};

// Disabled logic
const isNaskahDisabled = computed(() => {
  // console.log("Status type:", typeof naskahProposalTAStatus.value); // Log tipe data
  // console.log("Status value:", naskahProposalTAStatus.value); // Log nilai aktual

  // Cek eksplisit dengan double equals
  if (naskahProposalTAStatus.value == 0) {
    return true;
  }

  if (naskahProposalTAStatus.value === null) {
    return false;
  }

  // Pastikan konversi angka
  const status = Number(naskahProposalTAStatus.value);
  return status == STATUS.WAITING || status == STATUS.ACCEPTED;
});
const isTranskripDisabled = computed(() => {
  if (
    transkripNilaiMahasiswaStatus.value === null ||
    transkripNilaiMahasiswaStatus.value === undefined
  )
    return false;
  const status = Number(transkripNilaiMahasiswaStatus.value);
  return status === STATUS.WAITING || status === STATUS.ACCEPTED;
});
watch(
  () => judulProposalTA.value,
  (val) => {
    if (
      !judulProposal.value ||
      judulProposal.value === "" ||
      judulProposal.value === undefined
    ) {
      judulProposal.value = val || "";
    }
  },
  { immediate: true }
);
watch(
  () => dataProposal.value?.proposal?.catatan_perbaikan,
  (val) => {
    catatanPerbaikan.value = val || "";
  },
  { immediate: true }
);
</script>

<template>
  <div
    v-if="loadingProposal"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>

  <!-- <div v-else-if="errorProposal" class="p-4">
    <ErrorMsg :msg="errorProposal" />
  </div> -->

  <template v-else>
    <!-- No Pembimbing State -->
    <div
      v-if="!hasPembimbing"
      class="h-[80vh] flex flex-col justify-center items-center gap-4"
    >
      <h1 class="text-center heading5 sm:heading4 lg:heading3 text-placeholder">
        Anda harus memiliki pembimbing terlebih dahulu, sebelum mendaftarkan
        proposal.
      </h1>
      <router-link to="bimbingan">
        <Button
          class="hidden sm:flex"
          variant="primary"
          size="lg"
          rightIconPath="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        >
          Request Pembimbing
        </Button>
        <Button
          class="sm:hidden"
          variant="primary"
          size="md"
          rightIconPath="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        >
          Request Pembimbing
        </Button>
      </router-link>
    </div>

    <div
      v-else-if="
        (dataProposal?.status_form?.is_open == false &&
          dataProposal?.tugas_akhir?.proposal_id == null) ||
        0
      "
      class="h-[80vh] flex flex-col justify-center items-center gap-4"
    >
      <h1 class="text-center heading5 sm:heading4 lg:heading3 text-placeholder">
        Form proposal tugas akhir saat ini tidak dibuka, silakan tunggu
        pengumuman selanjutnya.
      </h1>
    </div>

    <!-- Has Pembimbing States -->
    <template v-else>
      <Breadcrumb />

      <div class="p-4 bg-white card-rounded shadow-custom lg:p-8">
        <!-- User Data Section -->
        <div class="pb-6 mx-auto max-w-screen-2xl">
          <UserData v-bind="userDataConfig" />
        </div>

        <!-- Form Section -->
        <form class="flex flex-col gap-2 mx-auto max-w-screen-2xl">
          <div class="flex flex-col gap-4">
            <InputText
              :class="formConfig.wrapperClass"
              id="judul-proposal-ta"
              label="Judul Proposal Tugas Akhir"
              placeholder="Masukkan judul proposal tugas akhir"
              v-model="judulProposal"
              :disabled="formConfig.isDisabled"
              :required="true"
            />
            <div>
              <InputFile
                :class="`${formConfig.wrapperClass} ${
                  isNaskahDisabled ? 'opacity-50' : ''
                }`"
                id="naskah-proposal-ta"
                label="Naskah Proposal Tugas Akhir"
                v-model="fileProposal"
                :existingFileName="naskahProposalTA"
                :existingFileUrl="fileNaskahProposalTA"
                :disabled="isNaskahDisabled"
                :required="true"
                :danger="dangerNaskah"
              />
              <div
                v-if="dangerNaskah"
                class="flex items-center gap-1 sm:gap-2 mt-0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-4 h-4 sm:w-5 sm:h-5 text-danger"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <p class="body5 sm:text-[13px] text-danger">Berkas ditolak</p>
              </div>
            </div>

            <div>
              <InputFile
                :class="`${formConfig.wrapperClass} ${
                  isTranskripDisabled ? 'opacity-50' : ''
                }`"
                id="transkrip-nilai-mahasiswa"
                label="Transkrip Nilai Mahasiswa"
                v-model="fileTranskrip"
                :existingFileName="transkripNilaiMahasiswa"
                :existingFileUrl="fileTranskripNilaiMahasiswa"
                :disabled="isTranskripDisabled"
                :required="true"
                :danger="dangerTranskrip"
              />
              <div
                v-if="dangerTranskrip"
                class="flex items-center gap-1 sm:gap-2 mt-0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-4 h-4 sm:w-5 sm:h-5 text-danger"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <p class="body5 sm:text-[13px] text-danger">Berkas ditolak</p>
              </div>
            </div>

            <InputTextarea
              v-if="catatanPerbaikan"
              :class="formConfig.wrapperClass"
              id="catatan-perbaikan-ta"
              label="Catatan Perbaikan"
              v-model="catatanPerbaikan"
              disabled
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center self-end gap-4">
            <!-- Submit Button - show for new proposal or rejected proposal -->
            <template
              v-if="
                formConfig.showSubmitButton &&
                naskahProposalTAStatus === null &&
                transkripNilaiMahasiswaStatus === null
              "
            >
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

            <template
              v-if="
                formConfig.showSubmitButton &&
                (naskahProposalTAStatus === STATUS.REJECTED ||
                  transkripNilaiMahasiswaStatus === STATUS.REJECTED)
              "
            >
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

            <!-- Nilai Button - show for accepted proposal -->
            <template
              v-if="
                naskahProposalTAStatus === STATUS.ACCEPTED &&
                transkripNilaiMahasiswaStatus === STATUS.ACCEPTED
              "
            >
              <Tooltip
                v-if="!dinilai"
                text="Menunggu Dinilai"
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
                variant="success"
                @click="showModal"
                type="button"
                size="lg"
                :class="`w-fit sm:flex hidden ${
                  !dinilai ? 'opacity-50' : 'opacity-100'
                }`"
                :disabled="!dinilai"
              >
                Lihat Nilai
              </Button>
              <Button
                variant="success"
                @click="showModal"
                type="button"
                size="md"
                :class="`w-fit sm:hidden ${
                  !dinilai ? 'opacity-50' : 'opacity-100'
                }`"
                :disabled="!dinilai"
              >
                Lihat Nilai
              </Button>
            </template>
          </div>
        </form>
      </div>

      <!-- Modal for viewing proposal score -->
      <DefaultModal
        v-if="modalRef"
        @close="modalRef = false"
        headText="Nilai Seminar Proposal"
        :bodyText="`${username} | ${nim} | ${judulProposalTA}`"
      >
        <div class="flex flex-col gap-4 mt-4">
          <InputText
            id="nilai-proposal-ta"
            label="Nilai Proposal Tugas Akhir"
            v-model="nilaiProposalTA"
            :value="nilaiProposalTA"
            :disabled="true"
          />
          <QuillTextReader
            id="catatan-proposal-ta"
            label="Catatan Proposal "
            :content="catatanProposalTA"
          />
          <!-- <InputTextarea
            id="catatan-proposal-ta"
            label="Catatan"
            v-model="catatanProposalTA"
            :value="catatanProposalTA"
            :disabled="true"
          /> -->
        </div>
      </DefaultModal>
    </template>
  </template>
</template>
