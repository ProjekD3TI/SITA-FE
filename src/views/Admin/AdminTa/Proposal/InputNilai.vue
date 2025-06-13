<script setup>
import { ref, computed, onMounted } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputTextArea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import { useRoute, useRouter } from "vue-router";
import { useShowSeminarProposal } from "@/services/TugasAkhir/Admin/proposal.js";
import { useToast } from "vue-toastification";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";

// Ambil inputNilaiProposal dari composable
const {
  dataSeminarProposal,
  fetchData,
  inputNilaiProposal,
  loadingSeminarProposal,
  errorSeminarProposal,
} = useShowSeminarProposal();
const toast = useToast();

const nilaiInput = ref("");
const catatanInput = ref("");
const isSubmitting = ref(false);

const route = useRoute();
const router = useRouter();

// Buat computed properties untuk data yang dibutuhkan
const namaMahasiswa = computed(
  () => dataSeminarProposal.value?.mahasiswa?.name || "Tidak diketahui"
);

const nimMahasiswa = computed(
  () => dataSeminarProposal.value?.mahasiswa?.nim || "Tidak diketahui"
);

const judulProposal = computed(
  () => dataSeminarProposal.value?.judul_proposal || "Tidak diketahui"
);

// Cek apakah data nilai sudah ada (untuk menentukan submit atau update)
const isUpdateMode = computed(
  () =>
    dataSeminarProposal.value?.nilai_proposal !== null &&
    dataSeminarProposal.value?.catatan_proposal !== null
);

onMounted(async () => {
  if (route.params.proposal_id) {
    try {
      await fetchData(route.params.proposal_id);

      // Isi form dengan nilai yang sudah ada jika mode update
      if (isUpdateMode.value) {
        nilaiInput.value = dataSeminarProposal.value.nilai_proposal;
        catatanInput.value = dataSeminarProposal.value.catatan_proposal;
      }
    } catch (error) {
      toast.error("Gagal memuat data proposal");
      console.error("Error fetching proposal:", error);
    }
  } else {
    toast.error("ID Proposal tidak ditemukan");
  }
});

const validateInput = () => {
  if (!nilaiInput.value) {
    toast.error("Nilai proposal harus diisi");
    return false;
  }

  if (
    isNaN(nilaiInput.value) ||
    nilaiInput.value < 0 ||
    nilaiInput.value > 100
  ) {
    toast.error("Nilai harus berupa angka antara 0-100");
    return false;
  }

  if (!catatanInput.value || catatanInput.value.trim() === "") {
    toast.error("Catatan proposal harus diisi");
    return false;
  }

  return true;
};

const submitNilai = async () => {
  if (!validateInput()) return;

  isSubmitting.value = true;
  try {
    await inputNilaiProposal(
      route.params.proposal_id,
      nilaiInput.value,
      catatanInput.value
    );
    toast.success(
      isUpdateMode.value
        ? "Nilai proposal berhasil diperbarui"
        : "Nilai proposal berhasil disimpan"
    );

    // Redirect ke halaman detail proposal dengan query refresh=true
    router.push({
      name: "DetailProposalForAdmin",
      params: { proposal_id: route.params.proposal_id },
      query: { refresh: Date.now().toString() }, // Tambahkan timestamp untuk memastikan refresh
    });
  } catch (error) {
    toast.error("Gagal menyimpan nilai proposal");
    console.error("Error saving nilai:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Fungsi update adalah sama dengan submit karena menggunakan endpoint yang sama
// tapi dibuat terpisah untuk kejelasan kode
const updateNilai = async () => {
  if (!validateInput()) return;

  isSubmitting.value = true;
  try {
    await inputNilaiProposal(
      route.params.proposal_id,
      nilaiInput.value,
      catatanInput.value
    );
    toast.success("Nilai proposal berhasil diperbarui");

    // Redirect ke halaman detail proposal dengan query refresh=true
    router.push({
      name: "DetailProposalForAdmin",
      params: { proposal_id: route.params.proposal_id },
      query: { refresh: Date.now().toString() }, // Tambahkan timestamp untuk memastikan refresh
    });
  } catch (error) {
    toast.error("Gagal memperbarui nilai proposal");
    console.error("Error updating nilai:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div
    v-if="loadingSeminarProposal"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>
  <div v-else-if="errorSeminarProposal" class="p-4">
    <ErrorMsg :message="errorSeminarProposal" />
  </div>
  <div v-else>
    <Breadcrumb />
    <div class="p-6 bg-white card-rounded lg:p-8">
      <div class="mx-auto max-w-screen-2xl">
        <div>
          <h5
            class="font-bold body2-bold sm:font-bold sm:body1-bold lg:heading5 xl:heading4 text-blackText"
          >
            Seminar Proposal
          </h5>
          <p class="body4">
            {{ namaMahasiswa }} | {{ nimMahasiswa }} | {{ judulProposal }}
          </p>
        </div>
        <div class="flex flex-col gap-4 mt-6">
          <InputText
            type="number"
            id="nilai-proposal"
            v-model="nilaiInput"
            label="Nilai Proposal"
            placeholder="Skala 0-100"
            :disabled="isSubmitting"
            required
          />
          <InputTextArea
            id="catatan-proposal"
            v-model="catatanInput"
            label="Catatan Proposal"
            placeholder="Masukkan Catatan"
            :disabled="isSubmitting"
            required
          />
          <Button
            v-if="!isUpdateMode"
            variant="primary"
            class="self-end hidden w-fit sm:flex"
            size="lg"
            :loading="isSubmitting"
            @click="submitNilai"
          >
            Simpan
          </Button>
          <Button
            v-else
            variant="primary"
            class="self-end hidden w-fit sm:flex"
            size="lg"
            :loading="isSubmitting"
            @click="updateNilai"
          >
            Update
          </Button>
          <Button
            v-if="!isUpdateMode"
            variant="primary"
            class="self-end w-fit sm:hidden"
            size="md"
            :loading="isSubmitting"
            @click="submitNilai"
          >
            Simpan
          </Button>
          <Button
            v-else
            variant="primary"
            class="self-end w-fit sm:hidden"
            size="md"
            :loading="isSubmitting"
            @click="updateNilai"
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
