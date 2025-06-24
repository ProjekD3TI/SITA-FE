<script setup>
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import InputTextArea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import ValidationFile from "@/components/Tugas-akhir/Forms/ValidationFile.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import UserData from "@/components/Tugas-akhir/UserData.vue";
import ModalTimer from "@/components/Tugas-akhir/Modals/ModalTimer.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { ref, computed, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useShowProposal } from "@/services/TugasAkhir/Admin/proposal.js";

const {
  loadingProposal,
  errorProposal,
  validateProposal,
  dataProposal,
  fetchData,
} = useShowProposal();

function getFileName(filePath) {
  return filePath ? decodeURIComponent(filePath.split("/").pop()) : "";
}

const router = useRouter();
const modalRef = ref(false);
const timerModalRef = ref(null);
const route = useRoute();
const toast = useToast();

onMounted(() => {
  if (route.params.proposal_id) {
    fetchData(route.params.proposal_id).catch((error) => {
      // toast.error("Gagal memuat data pengajuan proposal");
      router.replace({ name: "ProposalforAdmin" });
    });
  } else {
    // Jika tidak ada ID, kembali ke halaman proposal
    router.replace({ name: "ProposalforAdmin" });
  }
});

// Tambahkan watch untuk error
watch(errorProposal, (error) => {
  if (error) {
    // toast.error("Terjadi kesalahan: " + error);
    router.replace({ name: "ProposalforAdmin" });
  }
});

// Reactive untuk status validasi
const tempValidasi = reactive({
  naskah_proposal_status_valid: 0,
  file_transkrip_status_valid: 0,
});

// File dari API
const fileNaskahProposal = ref({});
const fileTranskrip = ref({});

// Watch dataProposal untuk update fileNaskahProposal & fileTranskrip
watch(
  dataProposal,
  (val) => {
    if (val && val.berkas) {
      // Cari berkas sesuai nama_berkas
      const naskah = val.berkas.find(
        (b) => b.nama_berkas === "Naskah Proposal Tugas Akhir"
      );
      const transkrip = val.berkas.find(
        (b) => b.nama_berkas === "Transkrip Nilai Mahasiswa"
      );
      fileNaskahProposal.value = naskah
        ? { name: getFileName(naskah.file_path), url: naskah.download_url }
        : {};
      fileTranskrip.value = transkrip
        ? {
            name: getFileName(transkrip.file_path),
            url: transkrip.download_url,
          }
        : {};

      // Set status validasi awal
      tempValidasi.naskah_proposal_status_valid = naskah
        ? naskah.status_valid
        : 0;
      tempValidasi.file_transkrip_status_valid = transkrip
        ? transkrip.status_valid
        : 0;
    }
  },
  { immediate: true }
);

const catatan = ref("");

watch(
  dataProposal,
  (val) => {
    if (val && typeof val.catatan_perbaikan === "string") {
      catatan.value = val.catatan_perbaikan;
    }
    // ...kode fileNaskahProposal & fileTranskrip tetap...
  },
  { immediate: true }
);

const naskahRef = ref(null);
const transkripRef = ref(null);

const handleValidasi = () => {
  // Hanya buka modal, tidak submit
  timerModalRef.value.open();
};

const handleSubmitValidasi = async () => {
  try {
    // Ambil status radio dari ref
    const naskahStatus = naskahRef.value.localValue;
    const transkripStatus = transkripRef.value.localValue;
    const statusValidBerkas = [Number(naskahStatus), Number(transkripStatus)];

    if (
      ![1, 2].includes(Number(naskahStatus)) ||
      ![1, 2].includes(Number(transkripStatus))
    ) {
      toast.error("Status validasi harus dipilih untuk kedua berkas.");
      return;
    }
    // Submit ke backend
    await validateProposal(
      dataProposal.value.proposal_id,
      statusValidBerkas,
      catatan.value
    );

    // Tutup modal
    modalRef.value = false;

    // Redirect ke halaman proposal
    router.replace({ name: "ProposalforAdmin" });
  } catch (error) {
    toast.error("Gagal memvalidasi proposal: " + error.message);
  }
};

watch(
  dataProposal,
  (val) => {
    if (val && typeof val.catatan_perbaikan === "string") {
      catatan.value = val.catatan_perbaikan;
    } else if (val && val.catatan_perbaikan === null && val.catatan_proposal) {
      // fallback jika backend kadang pakai catatan_proposal
      catatan.value = val.catatan_proposal;
    }
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

  <div v-else-if="errorProposal" class="p-4">
    <ErrorMsg :message="errorProposal" />
  </div>

  <div v-else>
    <Breadcrumb />
    <div class="p-4 bg-white card-rounded lg:p-8">
      <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
        <UserData
          :headText="dataProposal?.mahasiswa?.nim || 'NIM mahasiswa'"
          :bodyText="dataProposal?.mahasiswa?.name || 'Nama mahasiswa'"
          :headText2="dataProposal?.kategori?.nama_kategori || 'Kategori'"
          :bodyText2="dataProposal?.judul_proposal || 'Judul Proposal'"
          :tahunAjaran="
            dataProposal?.tahun_ajaran?.tahun_ajaran || 'Tahun Ajaran'
          "
        />
        <!-- All the file uploads -->
        <ValidationFile
          ref="naskahRef"
          id="naskah-ta"
          label="Naskah Tugas Akhir"
          :fileFromDatabase="fileNaskahProposal"
          :statusValid="tempValidasi.naskah_proposal_status_valid"
          @update:statusValid="
            tempValidasi.naskah_proposal_status_valid = $event
          "
        />
        <ValidationFile
          ref="transkripRef"
          id="transkrip-nilai-mahasiswa"
          label="Transkrip Nilai Mahasiswa"
          :fileFromDatabase="fileTranskrip"
          :statusValid="tempValidasi.file_transkrip_status_valid"
          @update:statusValid="
            tempValidasi.file_transkrip_status_valid = $event
          "
        />
        <InputTextArea
          id="catatan"
          label="Catatan Perbaikan"
          placeholder="Masukkan catatan"
          v-model="catatan"
        />
        <Button
          variant="primary"
          class="self-end hidden w-fit sm:flex"
          size="lg"
          @click="handleValidasi"
        >
          Validasi
        </Button>
        <Button
          variant="primary"
          class="self-end w-fit sm:hidden"
          size="md"
          @click="handleValidasi"
        >
          Validasi
        </Button>
      </div>
    </div>
    <ModalTimer
      ref="timerModalRef"
      @submit="handleSubmitValidasi"
      headText="Pastikan pengecekan berkas sudah benar."
      bodyText="Anda tidak dapat merubah status validasi yang telah terkirim."
      submitText="Validasi"
      :showCancel="false"
      :showSubmit="true"
      :enableTimer="false"
    />
  </div>
</template>
