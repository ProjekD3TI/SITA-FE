<script setup>
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import InputTextArea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import ValidationFile from "@/components/Tugas-akhir/Forms/ValidationFile.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import UserData from "@/components/Tugas-akhir/UserData.vue";
import ModalTimer from "@/components/Tugas-akhir/Modals/ModalTimer.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { ref, computed, reactive, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from "vue-router";
import { useShowPendaftar } from "@/services/TugasAkhir/Admin/ujianTA.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const {
  dataShowPendaftar,
  fetchShowPendaftar,
  loadingShowPendaftar,
  errorShowPendaftar,
  validateTugasAkhir,
} = useShowPendaftar(route.params.id);

const modalRef = ref(false);
const catatan = ref("");

function getFileName(filePath) {
  return filePath ? decodeURIComponent(filePath.split("/").pop()) : "";
}
onMounted(() => {
  if (route.params.tugas_akhir_id) {
    fetchShowPendaftar(route.params.tugas_akhir_id);
  }
});

// Variabel sementara untuk validasi (untuk radio)
const tempValidasi = reactive({
  naskah_ta_status_valid: 0,
  krs_status_valid: 0,
  persetujuan_pembimbing_status_valid: 0,
  file_transkrip_status_valid: 0,
  sertifikat_kompetensi_status_valid: 0,
  toeic_status_valid: 0,
  berita_acara_semhas_status_valid: 0,
  masa_perpanjangan_studi_status_valid: 0,
});

const fileNaskahTA = computed(() => {
  const berkas = dataShowPendaftar.value?.berkas?.find(
    (b) => b.nama_berkas === "Naskah Tugas Akhir"
  );
  return berkas
    ? { name: getFileName(berkas.file_path), url: berkas.download_url }
    : {};
});
const fileKRS = computed(() => {
  const berkas = dataShowPendaftar.value?.berkas?.find(
    (b) => b.nama_berkas === "Scan KRS Semester Akhir"
  );
  return berkas
    ? { name: getFileName(berkas.file_path), url: berkas.download_url }
    : {};
});
const filePersetujuanPembimbing = computed(() => {
  const berkas = dataShowPendaftar.value?.berkas?.find(
    (b) => b.nama_berkas === "Bukti Persetujuan Pembimbing"
  );
  return berkas
    ? { name: getFileName(berkas.file_path), url: berkas.download_url }
    : {};
});
const fileTranskrip = computed(() => {
  const berkas = dataShowPendaftar.value?.berkas?.find(
    (b) => b.nama_berkas === "Transkrip Nilai Mahasiswa"
  );
  return berkas
    ? { name: getFileName(berkas.file_path), url: berkas.download_url }
    : {};
});
const fileSertifikatKompetensi = computed(() => {
  const berkas = dataShowPendaftar.value?.berkas?.find(
    (b) => b.nama_berkas === "Bukti Sertifikat Kompetensi"
  );
  return berkas
    ? { name: getFileName(berkas.file_path), url: berkas.download_url }
    : {};
});
const fileTOEIC = computed(() => {
  const berkas = dataShowPendaftar.value?.berkas?.find(
    (b) => b.nama_berkas === "Sertifikat TOEIC"
  );
  return berkas
    ? { name: getFileName(berkas.file_path), url: berkas.download_url }
    : {};
});
const fileBeritaAcaraSemhas = computed(() => {
  const berkas = dataShowPendaftar.value?.berkas?.find(
    (b) => b.nama_berkas === "Berita Acara Seminar Hasil"
  );
  return berkas
    ? { name: getFileName(berkas.file_path), url: berkas.download_url }
    : {};
});
const fileMasaPerpanjanganStudi = computed(() => {
  const berkas = dataShowPendaftar.value?.berkas?.find(
    (b) => b.nama_berkas === "Surat Perpanjangan Masa Studi"
  );
  return berkas
    ? { name: getFileName(berkas.file_path), url: berkas.download_url }
    : {};
});
watch(
  dataShowPendaftar,
  (val) => {
    if (val && val.berkas) {
      tempValidasi.naskah_ta_status_valid =
        val.berkas.find((b) => b.nama_berkas === "Naskah Tugas Akhir")
          ?.status_valid ?? 0;
      tempValidasi.krs_status_valid =
        val.berkas.find((b) => b.nama_berkas === "Scan KRS Semester Akhir")
          ?.status_valid ?? 0;
      tempValidasi.persetujuan_pembimbing_status_valid =
        val.berkas.find((b) => b.nama_berkas === "Bukti Persetujuan Pembimbing")
          ?.status_valid ?? 0;
      tempValidasi.file_transkrip_status_valid =
        val.berkas.find((b) => b.nama_berkas === "Transkrip Nilai Mahasiswa")
          ?.status_valid ?? 0;
      tempValidasi.sertifikat_kompetensi_status_valid =
        val.berkas.find((b) => b.nama_berkas === "Bukti Sertifikat Kompetensi")
          ?.status_valid ?? 0;
      tempValidasi.toeic_status_valid =
        val.berkas.find((b) => b.nama_berkas === "Sertifikat TOEIC")
          ?.status_valid ?? 0;
      tempValidasi.berita_acara_semhas_status_valid =
        val.berkas.find((b) => b.nama_berkas === "Berita Acara Seminar Hasil")
          ?.status_valid ?? 0;
      tempValidasi.masa_perpanjangan_studi_status_valid =
        val.berkas.find(
          (b) => b.nama_berkas === "Surat Perpanjangan Masa Studi"
        )?.status_valid ?? 0;
    }
    if (val && typeof val.catatan_perbaikan === "string") {
      catatan.value = val.catatan_perbaikan;
    }
  },
  { immediate: true }
);

const naskahRef = ref(null);
const transkripRef = ref(null);
const krsRef = ref(null);
const persetujuanPembimbingRef = ref(null);
const sertifikatKompetensiRef = ref(null);
const toeicRef = ref(null);
const beritaAcaraSemhasRef = ref(null);
const masaPerpanjanganStudiRef = ref(null);

const handleSubmitValidasi = async () => {
  // Ambil status validasi sesuai urutan berkas dari backend
  const statusValidBerkas =
    dataShowPendaftar.value?.berkas?.map((b) => {
      switch (b.nama_berkas) {
        case "Naskah Tugas Akhir":
          return Number(naskahRef.value?.localValue);
        case "Scan KRS Semester Akhir":
          return Number(krsRef.value?.localValue);
        case "Bukti Persetujuan Pembimbing":
          return Number(persetujuanPembimbingRef.value?.localValue);
        case "Transkrip Nilai Mahasiswa":
          return Number(transkripRef.value?.localValue);
        case "Bukti Sertifikat Kompetensi":
          return Number(sertifikatKompetensiRef.value?.localValue);
        case "Sertifikat TOEIC":
          return Number(toeicRef.value?.localValue);
        case "Berita Acara Seminar Hasil":
          return Number(beritaAcaraSemhasRef.value?.localValue);
        case "Surat Perpanjangan Masa Studi":
          return Number(masaPerpanjanganStudiRef.value?.localValue);
        default:
          return null;
      }
    }) || [];

  // Validasi sebelum submit
  if (statusValidBerkas.some((v) => v !== 1 && v !== 2)) {
    toast.error("Semua berkas harus divalidasi!");
    return;
  }

  try {
    await validateTugasAkhir(
      route.params.tugas_akhir_id,
      statusValidBerkas,
      catatan.value
    );
    // toast.success("Berkas tugas akhir berhasil divalidasi!");
    router.push({
      name: "UjianTAforAdmin",
      query: { refreshPendaftar: Date.now() },
    });
  } catch (e) {}
};
</script>

<template>
  <div
    v-if="loadingShowPendaftar"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>
  <div v-else-if="errorShowPendaftar" class="p-4">
    <ErrorMsg :message="errorShowPendaftar" />
  </div>

  <div v-else>
    <Breadcrumb />
    <div class="p-4 bg-white card-rounded lg:p-8">
      <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
        <UserData
          :headText="dataShowPendaftar?.mahasiswa?.nim"
          :bodyText="dataShowPendaftar?.mahasiswa?.name"
          :headText2="dataShowPendaftar?.kategori"
          :bodyText2="dataShowPendaftar?.judul_tugas_akhir"
          :tahunAjaran="dataShowPendaftar?.tahun_ajaran"
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
          @update:statusValid="
            tempValidasi.persetujuan_pembimbing_status_valid = $event
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
        <ValidationFile
          ref="sertifikatKompetensiRef"
          id="bukti-sertifikat-kompetensi"
          label="Bukti Sertifikat Kompetensi"
          :fileFromDatabase="fileSertifikatKompetensi"
          :statusValid="tempValidasi.sertifikat_kompetensi_status_valid"
          @update:statusValid="
            tempValidasi.sertifikat_kompetensi_status_valid = $event
          "
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
          @update:statusValid="
            tempValidasi.berita_acara_semhas_status_valid = $event
          "
        />
        <ValidationFile
          v-if="dataShowPendaftar?.value?.masa_perpanjangan_studi"
          ref="masaPerpanjanganStudiRef"
          id="surat-perpanjangan-masa-studi"
          label="Surat Perpanjangan Masa Studi"
          :fileFromDatabase="fileMasaPerpanjanganStudi"
          :statusValid="tempValidasi.masa_perpanjangan_studi_status_valid"
          @update:statusValid="
            tempValidasi.masa_perpanjangan_studi_status_valid = $event
          "
        />
        <InputTextArea
          id="catatan"
          label="Catatan"
          placeholder="Masukkan catatan"
          v-model="catatan"
        />
        <Button
          variant="primary"
          class="self-end w-fit"
          size="lg"
          @click="handleSubmitValidasi"
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
  </div>
</template>
