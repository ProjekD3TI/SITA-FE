<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import DefaultAvatar from "@/assets/images/Profile Avatar.svg";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useRoute, useRouter } from "vue-router";
import { useShowProposal } from "@/services/TugasAkhir/Admin/proposal.js";
const {
  loadingProposal,
  errorProposal,
  dataProposal,
  fetchData,
  getSecureFileBlobUrl,
} = useShowProposal();

const pdfBlobUrl = ref("");
const loadingPdf = ref(false);

const nilai_proposal = computed(() => {
  return dataProposal.value?.nilai_proposal || "Tidak ada catatan";
});
const catatan_proposal = computed(() => {
  return dataProposal.value?.catatan_proposal || "Belum dinilai";
});
const namaMahasiswa = computed(() => {
  return dataProposal.value?.mahasiswa || "Tidak diketahui";
});
const nimMahasiswa = computed(() => {
  return dataProposal.value?.nim || "Tidak diketahui";
});
const judulProposal = computed(() => {
  return dataProposal.value?.judul_proposal || "Tidak diketahui";
});
// Panggil saat dataProposal berubah
const route = useRoute();
const router = useRouter();
onMounted(() => {
  if (route.params.proposal_id) {
    fetchData(route.params.proposal_id);
  }

  // Tambahkan watch pada route query untuk refresh data
  watch(
    () => route.query.refresh,
    (newValue) => {
      if (newValue && route.params.proposal_id) {
        console.log("Refreshing data after nilai update...");
        fetchData(route.params.proposal_id);
      }
    }
  );
});

const showNilaiModal = ref(false);

const openNilaiModal = () => {
  showNilaiModal.value = true;
};

const isNilaiKosong = computed(
  () =>
    dataProposal.value?.nilai_proposal == null &&
    dataProposal.value?.catatan_proposal == null
);

const goToInputNilai = () => {
  router.push({
    name: "InputNilaiProposalForAdmin",
    params: { proposal_id: dataProposal.value?.id },
  });
  showNilaiModal.value = false;
};

// Mapping berkas array ke object agar mudah diakses
const berkasObj = computed(() => {
  if (!dataProposal.value?.berkas) return {};
  return dataProposal.value.berkas.reduce((obj, item) => {
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
    pdfBlobUrl.value = await getSecureFileBlobUrl(url);
  }
  loadingPdf.value = false;
}
</script>
<template>
  <router-view v-if="$route.path.includes('input-nilai')"></router-view>

  <div
    v-else-if="loadingProposal"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>
  <div v-else-if="errorProposal" class="p-4">
    <ErrorMsg :message="errorProposal" />
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
                    {{ dataProposal?.mahasiswa }}
                  </h5>
                  <p class="body3 sm:body2 text-primary">
                    {{ dataProposal?.nim }}
                  </p>
                </div>
              </div>
              <div>
                <h5 class="body3-bold sm:body2-bold">Judul Tugas Akhir</h5>
                <p class="body3 sm:body2 text-primary">
                  {{ dataProposal?.judul_proposal }}
                </p>
              </div>

              <div>
                <h5 class="body3-bold sm:body2-bold">Kategori</h5>
                <p class="body3 sm:body2 text-primary">
                  {{ dataProposal?.kategori_ta?.nama_kategori }}
                </p>
              </div>

              <div>
                <h5 class="body3-bold sm:body2-bold">Dosen Pembimbing</h5>
                <p class="body3 sm:body2 text-primary">
                  {{ dataProposal?.dosen_pembimbing?.nama }}
                </p>
              </div>

              <div>
                <h5 class="body3-bold sm:body2-bold">Tahun Ajaran</h5>
                <p class="body3 sm:body2 text-secondary">
                  {{ dataProposal?.tahun_ajaran?.tahun_ajaran }}
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
        <InputTextarea
          id="catatan-proposal"
          label="Catatan"
          :modelValue="catatan_proposal"
          :disabled="true"
        />
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
