<script setup>
import { ref, computed, watchEffect, onMounted } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import JadwalUjian from "@/components/Tugas-akhir/JadwalUjian.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Tooltip from "@/components/Tugas-akhir/Tooltip.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import {
  useTugasAkhir,
  useJadwalUjianTA,
  useNilaiUjianTA,
  dosenPembimbing,
  kategoriTA,
  tahunAjaranTA,
  judulTugasAkhir,
  daftarPenguji,
  jadwalUjianTA,
  kualitas_tata_laporan,
  kemampuan_teknis,
  kualitas_produk,
  presentasi,
  rerata_ujian,
  dataTugasAkhir,
  dataNilaiUjianTA,
  rataRataNilaiUjianTA,
  catatanRevisi,
  fileNaskahTA,
  getFileBlobUrl,
} from "@/services/TugasAkhir/Mhs/ujianTA.js";
import { getUserData } from "@/services/authMahasiswa";

const userData = getUserData();
const username = userData?.name || userData?.email?.split("@")[0] || "User";
const nim = userData?.nim || "";

const { loadingTugasAkhir, errorTugasAkhir } = useTugasAkhir();
const { loadingJadwalUjianTA, errorJadwalUjianTA, dataJadwalUjianTA } =
  useJadwalUjianTA();
const { loadingNilaiUjianTA, errorNilaiUjianTA } = useNilaiUjianTA();

const dinilai = computed(() => {
  // Cek apakah ada penguji dan semua nilai > 0
  const penguji = dataNilaiUjianTA.value?.dosen_penguji || [];
  const nilai = rataRataNilaiUjianTA.value;
  return (
    penguji.length > 0 &&
    nilai.kualitas_tata_laporan > 0 &&
    nilai.kemampuan_teknis > 0 &&
    nilai.kualitas_produk > 0 &&
    nilai.presentasi > 0
  );
});
const showNilaiModal = ref(false);

const pdfBlobUrl = ref(null);
const loadingPdf = ref(false);
const errorPdf = ref(null);

// Methods
const openNilaiModal = () => {
  showNilaiModal.value = true;
};

const closeNilaiModal = () => {
  showNilaiModal.value = false;
};

async function loadPdfPreview() {
  loadingPdf.value = true;
  errorPdf.value = null;
  try {
    if (fileNaskahTA.value) {
      pdfBlobUrl.value = await getFileBlobUrl(fileNaskahTA.value);
    }
  } catch (err) {
    errorPdf.value = "Gagal memuat file PDF";
  } finally {
    loadingPdf.value = false;
  }
}

// Muat ulang jika fileNaskahTA berubah
watchEffect(() => {
  if (fileNaskahTA.value) {
    loadPdfPreview();
  }
});

// Computed properties
const buttonClasses = computed(() => {
  return dinilai.value ? "opacity-100" : "opacity-50";
});
watchEffect(() => {
  // console.log("dataNilaiUjianTA", dataNilaiUjianTA.value);
  // console.log("rataRataNilaiUjianTA", rataRataNilaiUjianTA.value);
});
</script>

<template>
  <div
    v-if="loadingTugasAkhir || loadingNilaiUjianTA || loadingJadwalUjianTA"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>

  <div
    v-else-if="errorTugasAkhir || errorNilaiUjianTA || errorJadwalUjianTA"
    class="p-4"
  >
    <ErrorMsg
      :msg="errorTugasAkhir || errorNilaiUjianTA || errorJadwalUjianTA"
    />
  </div>

  <div v-else>
    <Breadcrumb />

    <!-- Jadwal Section -->
    <div
      v-if="dataJadwalUjianTA?.ujian_ta?.id"
      class="p-6 bg-white card-rounded lg:p-8"
    >
      <div class="mx-auto max-w-screen-2xl">
        <JadwalUjian :examiners="daftarPenguji" :jadwal="jadwalUjianTA" />
      </div>
    </div>

    <!-- Tugas Akhir Details Section -->
    <div class="p-6 mt-4 bg-white sm:mt-6 card-rounded lg:p-8">
      <div class="mx-auto max-w-screen-2xl">
        <div class="flex flex-col md:flex-row">
          <!-- PDF Preview (Left Side) -->
          <div class="order-last basis-7/12 md:pe-8 md:order-first">
            <div v-if="loadingPdf" class="py-8 text-center">Memuat file...</div>
            <div v-else-if="errorPdf" class="py-8 text-center text-red-500">
              {{ errorPdf }}
            </div>
            <object
              v-else-if="pdfBlobUrl"
              :data="pdfBlobUrl"
              type="application/pdf"
              class="w-full h-[750px] mt-6 md:mt-0"
            >
              <p class="p-4 text-center">
                Browser Anda tidak mendukung tampilan PDF.
                <a :href="pdfBlobUrl" target="_blank" class="text-primary"
                  >Klik di sini</a
                >
                untuk membuka PDF.
              </p>
            </object>
            <div v-else class="py-8 text-center">
              Tidak ada file untuk ditampilkan.
            </div>
          </div>

          <!-- Details (Right Side) -->
          <div class="flex flex-col gap-4 basis-5/12">
            <!-- Detail items -->
            <div class="flex flex-col gap-2">
              <div>
                <h5 class="body3-bold sm:body2-bold">Judul Tugas Akhir</h5>
                <p class="body3 sm:body2 text-primary">{{ judulTugasAkhir }}</p>
              </div>

              <div>
                <h5 class="body3-bold sm:body2-bold">Kategori</h5>
                <p class="body3 sm:body2 text-primary">{{ kategoriTA }}</p>
              </div>

              <div>
                <h5 class="body3-bold sm:body2-bold">Dosen Pembimbing</h5>
                <p class="body3 sm:body2 text-primary">{{ dosenPembimbing }}</p>
              </div>

              <div>
                <h5 class="body3-bold sm:body2-bold">Tahun Ajaran</h5>
                <p class="body3 sm:body2 text-secondary">{{ tahunAjaranTA }}</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center self-end gap-4">
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
                size="lg"
                class="hidden w-fit sm:flex"
                :class="buttonClasses"
                :disabled="!dinilai"
                @click="openNilaiModal"
              >
                Lihat Nilai
              </Button>

              <Button
                variant="success"
                size="md"
                class="w-fit sm:hidden"
                :class="buttonClasses"
                :disabled="!dinilai"
                @click="openNilaiModal"
              >
                Lihat Nilai
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nilai -->
    <DefaultModal
      v-if="showNilaiModal"
      @close="closeNilaiModal"
      headText="Nilai Ujian Tugas Akhir"
      :bodyText="`${username} | ${nim} | ${judulTugasAkhir}`"
    >
      <div class="flex flex-col gap-4 mt-4">
        <h5 class="body3-bold lg:body1-bold text-primary">Status Kelulusan</h5>

        <h5 class="body3-bold lg:body1-bold text-primary">Nilai Ujian</h5>
        <div class="flex flex-wrap gap-2">
          <InputText
            class="flex-grow mb-2 min-w-[260px] sm:min-w-[320px]"
            id="kualitas_tata_laporan"
            label="Kualitas Tata Laporan (15%)"
            :modelValue="kualitas_tata_laporan"
            disabled
          />
          <InputText
            class="flex-grow mb-2 min-w-[260px] sm:min-w-[320px]"
            id="kemampuan_teknis"
            label="Kemampuan Teknis (35%)"
            :modelValue="kemampuan_teknis"
            disabled
          />
          <InputText
            class="flex-grow mb-2 min-w-[260px] sm:min-w-[320px]"
            id="kualitas_produk"
            label="Kualitas Produk yang Dihasilkan(25%)"
            :modelValue="kualitas_produk"
            disabled
          />
          <InputText
            class="flex-grow mb-2 min-w-[260px] sm:min-w-[320px]"
            id="presentasi"
            label="Presentasi dan Question Handling(25%)"
            :modelValue="presentasi"
            disabled
          />
        </div>
        <InputText
          id="rerata_ujian"
          label="Nilai Rata-rata"
          :modelValue="rerata_ujian"
          disabled
        />
        <h5 class="body3-bold lg:body1-bold text-primary">Catatan Revisi</h5>
        <div class="flex flex-col gap-2">
          <template v-for="(item, idx) in catatanRevisi" :key="idx">
            <InputTextarea
              :id="`catatan_revisi_${idx + 1}`"
              :label="`${item.nama}`"
              :modelValue="item.revisi"
              disabled
            />
          </template>
        </div>
      </div>
    </DefaultModal>
  </div>
</template>
