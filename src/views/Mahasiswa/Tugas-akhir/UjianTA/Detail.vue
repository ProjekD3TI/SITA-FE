<script setup>
import { ref, computed, watchEffect, onMounted } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import JadwalUjian from "@/components/Tugas-akhir/JadwalUjian.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Tooltip from "@/components/Tugas-akhir/Tooltip.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import QuillTextReader from "@/components/Tugas-akhir/Forms/QuillTextReader.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import StatusLabel from "@/components/Tugas-akhir/Label.vue";
import {
  useDetailTugasAkhir,
  getFileBlobUrl,
} from "@/services/TugasAkhir/Mhs/ujianTA.js";
import { getUserData } from "@/services/authMahasiswa";
import QuillTextEditor from "@/components/Tugas-akhir/Forms/QuillTextEditor.vue";
import { useRoute, useRouter } from "vue-router";
const userData = getUserData();
const username = userData?.name || userData?.email?.split("@")[0] || "User";
const nim = userData?.nim || "";
const route = useRoute();
const router = useRouter();
const { loadingDetailTA, errorDetailTA, fetchDetail, dataDetailTA } =
  useDetailTugasAkhir();

onMounted(() => {
  // Pastikan fetchDetail dipanggil dengan ID yang sesuai (misal dari route)
  if (route.params.tugas_akhir_id) {
    fetchDetail(route.params.tugas_akhir_id);
  }
});
watchEffect(() => {
  if (errorDetailTA.value) {
    // Redirect ke halaman utama ujian-ta
    router.replace({ name: "UjianTAMhs" });
  }
});
// --- Computed Properties dari dataDetailTA ---
const judulTugasAkhir = computed(
  () => dataDetailTA.value?.judul_tugas_akhir || "-"
);
const kategoriTA = computed(
  () => dataDetailTA.value?.kategori?.nama_kategori || "-"
);
const dosenPembimbing = computed(
  () => dataDetailTA.value?.dosen_pembimbing?.name || "-"
);
const tahunAjaranTA = computed(
  () => dataDetailTA.value?.tahun_ajaran?.tahun_ajaran || "-"
);

// Jadwal Ujian Terbaru
const jadwalUjianTerbaru = computed(
  () => dataDetailTA.value?.jadwal_ujian_terbaru || null
);
const jadwalUjianTA = computed(() => {
  if (!jadwalUjianTerbaru.value) return {};
  return {
    date: jadwalUjianTerbaru.value.tanggal_ujian,
    time:
      jadwalUjianTerbaru.value.sesi?.waktu_mulai +
      " - " +
      jadwalUjianTerbaru.value.sesi?.waktu_selesai,
    room: jadwalUjianTerbaru.value.ruang?.nama_ruang,
  };
});
const daftarPenguji = computed(() =>
  (jadwalUjianTerbaru.value?.dosen_penguji || []).map((dosen) => ({
    ...dosen,
    role: dosen.jabatan_penguji, // mapping agar JadwalUjian.vue bisa akses .role
  }))
);

// Status Kelulusan
const statusKelulusan = computed(
  () => jadwalUjianTerbaru.value?.status_kelulusan ?? null
);
const getStatusClass = (status) => {
  switch (status) {
    case 1:
      return "success";
    case 2:
      return "success";
    case 3:
      return "warning";
    case 4:
      return "danger";
    default:
      return "inactive";
  }
};
const getStatusLabel = (status) => {
  switch (status) {
    case 1:
      return "Lulus";
    case 2:
      return "Lulus, Revisi";
    case 3:
      return "Revisi, Ulang Ujian";
    case 4:
      return "Tidak Lulus";
    default:
      return "Tidak Diketahui";
  }
};

// Nilai Ujian
const penguji = computed(() => jadwalUjianTerbaru.value?.dosen_penguji || []);
const dinilai = computed(() => {
  const pengujiSudahNilai = penguji.value.filter(
    (dosen) =>
      dosen.nilai_ujian_ta &&
      [
        "kualitas_tata_laporan",
        "kemampuan_teknis",
        "kualitas_produk",
        "presentasi",
      ].every(
        (key) =>
          dosen.nilai_ujian_ta[key] !== null &&
          dosen.nilai_ujian_ta[key] !== undefined
      )
  );
  return pengujiSudahNilai.length >= 3;
});

// Ambil nilai rata-rata dari penguji pertama (atau hitung rata-rata manual jika perlu)
const rerata_ujian = computed(() => {
  if (!penguji.value.length) return 0;
  // Ambil rerata dari penguji pertama (semua penguji nilainya sama di contoh Anda)
  return penguji.value[0]?.nilai_ujian_ta?.rerata_ujian_ta ?? 0;
});
const kualitas_tata_laporan = computed(
  () => penguji.value[0]?.nilai_ujian_ta?.kualitas_tata_laporan ?? 0
);
const kemampuan_teknis = computed(
  () => penguji.value[0]?.nilai_ujian_ta?.kemampuan_teknis ?? 0
);
const kualitas_produk = computed(
  () => penguji.value[0]?.nilai_ujian_ta?.kualitas_produk ?? 0
);
const presentasi = computed(
  () => penguji.value[0]?.nilai_ujian_ta?.presentasi ?? 0
);

// Catatan Revisi
const catatanRevisi = computed(() =>
  penguji.value
    .map((dosen) => ({
      nama: dosen.name,
      revisi: dosen.nilai_ujian_ta?.revisi,
    }))
    .filter((item) => item.revisi)
);
const catatanRevisiTerisi = computed(() =>
  catatanRevisi.value.filter((item) => item.revisi)
);

// PDF Preview (dummy, sesuaikan jika ada file di dataDetailTA)
const fileNaskahTA = computed(() => {
  return (
    dataDetailTA.value?.berkas?.find(
      (b) => b.nama_berkas === "Naskah Tugas Akhir"
    )?.download_url || null
  );
});
const pdfBlobUrl = ref(null);
const loadingPdf = ref(false);
const errorPdf = ref(null);

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
watchEffect(() => {
  if (fileNaskahTA.value) {
    loadPdfPreview();
  }
});

// Modal
const showNilaiModal = ref(false);
const openNilaiModal = () => {
  showNilaiModal.value = true;
};
const closeNilaiModal = () => {
  showNilaiModal.value = false;
};

const buttonClasses = computed(() =>
  dinilai.value ? "opacity-100" : "opacity-50"
);
</script>
<template>
  <div
    v-if="loadingDetailTA"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>

  <div v-else-if="errorDetailTA" class="p-4">
    <ErrorMsg :msg="errorDetailTA" />
  </div>

  <div v-else>
    <Breadcrumb />

    <!-- Jadwal Section -->
    <div
      v-if="dataDetailTA?.jadwal_ujian_terbaru?.ujian_ta_id"
      class="p-6 mb-4 bg-white card-rounded lg:p-8 shadow-custom sm:mb-6"
    >
      <div class="mx-auto max-w-screen-2xl">
        <JadwalUjian :examiners="daftarPenguji" :jadwal="jadwalUjianTA" />
      </div>
    </div>

    <!-- Tugas Akhir Details Section -->
    <div class="p-6 bg-white card-rounded lg:p-8 shadow-custom">
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
                <h5 class="body4-bold sm:body2-bold">Judul Tugas Akhir</h5>
                <p class="body4 sm:body2 text-primary">
                  {{ judulTugasAkhir || "-" }}
                </p>
              </div>

              <div>
                <h5 class="body4-bold sm:body2-bold">Kategori</h5>
                <p class="body4 sm:body2 text-primary">
                  {{ kategoriTA || "-" }}
                </p>
              </div>

              <div>
                <h5 class="body4-bold sm:body2-bold">Dosen Pembimbing</h5>
                <p class="body4 sm:body2 text-primary">
                  {{ dosenPembimbing || "-" }}
                </p>
              </div>

              <div>
                <h5 class="body4-bold sm:body2-bold">Tahun Ajaran</h5>
                <p class="body4 sm:body2 text-secondary">
                  {{ tahunAjaranTA || "-" }}
                </p>
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
        <StatusLabel
          class="hidden w-fit lg:block"
          :status="getStatusClass(statusKelulusan)"
          size="lg"
          :label="getStatusLabel(statusKelulusan)"
        />

        <StatusLabel
          class="block w-fit lg:hidden"
          :status="getStatusClass(statusKelulusan)"
          size="md"
          :label="getStatusLabel(statusKelulusan)"
        />
        <h5
          v-if="rerata_ujian !== 0"
          class="body3-bold lg:body1-bold text-primary"
        >
          Nilai Ujian
        </h5>
        <div v-if="rerata_ujian !== 0" class="flex flex-wrap gap-2">
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
          v-if="rerata_ujian !== 0"
          id="rerata_ujian"
          label="Nilai Rata-rata"
          :modelValue="rerata_ujian"
          disabled
        />
        <h5
          v-if="catatanRevisiTerisi && catatanRevisiTerisi.length > 0"
          class="body3-bold lg:body1-bold text-primary"
        >
          Catatan Revisi
        </h5>
        <div
          v-if="catatanRevisiTerisi && catatanRevisiTerisi.length > 0"
          class="flex flex-col gap-2"
        >
          <template v-for="(item, idx) in catatanRevisi" :key="idx">
            <QuillTextReader
              class="mb-2"
              v-if="item.revisi"
              :id="`catatan_revisi_${idx + 1}`"
              :label="`${item.nama}`"
              :content="item.revisi"
            />
          </template>
        </div>
      </div>
    </DefaultModal>
  </div>
</template>
