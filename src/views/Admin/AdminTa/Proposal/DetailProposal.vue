<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import DefaultAvatar from "@/assets/images/Profile Avatar.svg";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import QuillTextReader from "@/components/Tugas-akhir/Forms/QuillTextReader.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useShowSeminarProposal } from "@/services/TugasAkhir/Admin/proposal.js";

const {
  loadingSeminarProposal,
  errorSeminarProposal,
  dataSeminarProposal,
  getSecureFileBlobUrl,
  fetchData,
} = useShowSeminarProposal();

const pdfBlobUrl = ref("");
const loadingPdf = ref(false);
const toast = useToast();

const nilai_proposal = computed(() => {
  return dataSeminarProposal.value?.nilai_proposal || "Tidak ada catatan";
});
const catatan_proposal = computed(() => {
  return dataSeminarProposal.value?.catatan_proposal || "Belum dinilai";
});
const namaMahasiswa = computed(() => {
  return dataSeminarProposal.value?.mahasiswa?.name || "Tidak diketahui";
});
const nimMahasiswa = computed(() => {
  return dataSeminarProposal.value?.mahasiswa?.nim || "Tidak diketahui";
});
const judulProposal = computed(() => {
  return dataSeminarProposal.value?.judul_proposal || "Tidak diketahui";
});

const route = useRoute();
const router = useRouter();

onMounted(() => {
  if (route.params.proposal_id) {
    fetchData(route.params.proposal_id);
  }
});

// Tambahkan watch untuk error
watch(errorSeminarProposal, (error) => {
  if (error) {
    // toast.error("Terjadi kesalahan: " + error);
    router.replace({ name: "ProposalforAdmin" });
  }
});

// Tambahkan watch pada route query untuk refresh data
watch(
  () => route.query.refresh,
  (newValue) => {
    if (newValue && route.params.proposal_id) {
      fetchData(route.params.proposal_id);
      // Hapus query parameter dari URL setelah selesai refresh
      router.replace({ path: route.path });
    }
  }
);

const showNilaiModal = ref(false);

const openNilaiModal = () => {
  showNilaiModal.value = true;
};

const isNilaiKosong = computed(
  () =>
    dataSeminarProposal.value?.nilai_proposal == null &&
    dataSeminarProposal.value?.catatan_proposal == null
);

const goToInputNilai = () => {
  router.push({
    name: "InputNilaiProposalForAdmin",
    params: { proposal_id: dataSeminarProposal.value?.proposal_id },
  });
  showNilaiModal.value = false;
};

// Mapping berkas array ke object agar mudah diakses
const berkasObj = computed(() => {
  if (!dataSeminarProposal.value?.berkas) return {};
  return dataSeminarProposal.value.berkas.reduce((obj, item) => {
    obj[item.nama_berkas] = item;
    return obj;
  }, {});
});

watch(
  () => berkasObj.value["Naskah Proposal Tugas Akhir"]?.download_url,
  loadPdfPreview,
  { immediate: true }
);

async function loadPdfPreview() {
  loadingPdf.value = true;
  const url = berkasObj.value["Naskah Proposal Tugas Akhir"]?.download_url;
  if (url) {
    try {
      pdfBlobUrl.value = await getSecureFileBlobUrl(url);
    } catch (error) {
      toast.error("Gagal memuat file PDF");
      pdfBlobUrl.value = "";
    }
  }
  loadingPdf.value = false;
}
</script>
<template>
  <router-view v-if="$route.path.includes('input-nilai')"></router-view>

  <div
    v-else-if="loadingSeminarProposal"
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
        <div class="flex flex-col md:flex-row">
          <!-- PDF Preview (Left Side) -->
          <div class="order-last basis-7/12 md:pe-8 md:order-first">
            <object
              :data="pdfBlobUrl"
              type="application/pdf"
              class="w-full h-[750px] mt-6 md:mt-0"
            >
              <p class="p-4 text-center text-blackText">
                Browser Anda tidak mendukung tampilan PDF.
                <a :href="pdfBlobUrl" target="_blank" class="text-primary"
                  >Klik di sini</a
                >
                untuk membuka PDF.
              </p>
            </object>
          </div>

          <!-- Details (Right Side) -->
          <div class="flex flex-col gap-4 basis-5/12 text-blackText">
            <!-- Detail items -->
            <div class="flex flex-col gap-2">
              <div class="flex w-full gap-2 mx-auto sm:gap-4">
                <img
                  :src="DefaultAvatar"
                  alt=""
                  class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
                />
                <div>
                  <h5 class="body3-bold sm:body2-bold">
                    {{ dataSeminarProposal?.mahasiswa?.name }}
                  </h5>
                  <p class="body3 sm:body2 text-primary">
                    {{ dataSeminarProposal?.mahasiswa?.nim }}
                  </p>
                </div>
              </div>
              <div>
                <h5 class="body3-bold sm:body2-bold">Judul Tugas Akhir</h5>
                <p class="body3 sm:body2 text-primary">
                  {{ dataSeminarProposal?.judul_proposal }}
                </p>
              </div>

              <div>
                <h5 class="body3-bold sm:body2-bold">Kategori</h5>
                <p class="body3 sm:body2 text-primary">
                  {{ dataSeminarProposal?.kategori?.nama_kategori }}
                </p>
              </div>

              <div>
                <h5 class="body3-bold sm:body2-bold">Dosen Pembimbing</h5>
                <p class="body3 sm:body2 text-primary">
                  {{ dataSeminarProposal?.dosen_pembimbing?.name }}
                </p>
              </div>

              <div>
                <h5 class="body3-bold sm:body2-bold">Tahun Ajaran</h5>
                <p class="body3 sm:body2 text-secondary">
                  {{ dataSeminarProposal?.tahun_ajaran?.tahun_ajaran }}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center self-end gap-4">
              <Button
                v-if="isNilaiKosong"
                variant="primary"
                size="lg"
                class="hidden w-fit sm:flex"
                @click="goToInputNilai"
              >
                Input Nilai
              </Button>

              <Button
                v-if="isNilaiKosong"
                variant="primary"
                size="md"
                class="w-fit sm:hidden"
                @click="goToInputNilai"
              >
                Input Nilai
              </Button>

              <Button
                v-if="!isNilaiKosong"
                variant="success"
                size="lg"
                class="hidden w-fit sm:flex"
                @click="openNilaiModal"
              >
                Lihat Nilai
              </Button>

              <Button
                v-if="!isNilaiKosong"
                variant="success"
                size="md"
                class="w-fit sm:hidden"
                @click="openNilaiModal"
              >
                Lihat Nilai
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DefaultModal
      v-if="showNilaiModal"
      headText="Nilai Seminar Proposal"
      :bodyText="`${namaMahasiswa} | ${nimMahasiswa} | ${judulProposal}`"
      @close="showNilaiModal = false"
    >
      <div class="flex flex-col gap-4">
        <InputText
          id="nilai-proposal"
          label="Nilai"
          :modelValue="nilai_proposal"
          :disabled="true"
        />
        <QuillTextReader
          id="catatan-proposal"
          :content="catatan_proposal"
          label="Catatan"
        />
        <!-- <InputTextarea
          id="catatan-proposal"
          label="Catatan"
          :modelValue="catatan_proposal"
          :disabled="true"
        /> -->
        <Button
          variant="secondary"
          class="self-end hidden w-fit sm:flex"
          size="lg"
          leftIconPath="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          @click="goToInputNilai"
          >Edit</Button
        >
        <Button
          variant="secondary"
          class="self-end w-fit sm:hidden"
          size="md"
          leftIconPath="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          @click="goToInputNilai"
          >Edit</Button
        >
      </div>
    </DefaultModal>
  </div>
</template>
