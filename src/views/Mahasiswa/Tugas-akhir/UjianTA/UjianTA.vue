<template>
  <router-view v-if="$route.path.includes('berkas')"></router-view>
  <router-view
    v-else-if="$route.path.includes('detail-ujian-ta')"
  ></router-view>
  <div v-else>
    <!-- Tambahkan kondisi loading -->
    <div
      v-if="loadingTugasAkhir"
      class="flex items-center justify-center min-h-[80dvh]"
    >
      <Loading />
    </div>
    <div v-else-if="errorTugasAkhir">{{ errorTugasAkhir }}</div>

    <div
      v-else-if="!minimalBimbingan"
      class="h-[80vh] flex flex-col justify-center items-center gap-4"
    >
      <h1 class="text-center heading5 sm:heading4 lg:heading3 text-placeholder">
        Minimal bimbingan anda belum terpenuhi.
      </h1>
      <router-link to="bimbingan">
        <Button
          class="hidden sm:flex"
          variant="primary"
          size="lg"
          rightIconPath="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        >
          Bimbingan
        </Button>
        <Button
          class="sm:hidden"
          variant="primary"
          size="md"
          rightIconPath="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        >
          Bimbingan
        </Button>
      </router-link>
    </div>
    <!-- Kirim data yang sudah di-format ke Accordion dan tambahkan event handler -->
    <Accordion
      v-else
      :items="formattedAccordionItems"
      :showStatus="true"
      @berkas="goToBerkas"
      @daftar="goToBerkas"
      @detail="handleDetail"
    />
  </div>
  <!-- Modal bagian -->
  <DefaultModal
    v-if="showNilaiModal"
    @close="closeNilaiModal"
    headText="Catatan Ujian"
    :bodyText="`${username} | ${nim} | ${judulTugasAkhir}`"
  >
    <h5 class="body3-bold lg:body1-bold text-primary">Status Kelulusan</h5>
    <StatusLabel
      class="hidden w-fit lg:block"
      :status="getStatusKelulusan(selectedUjian?.status_kelulusan).color"
      size="lg"
      :label="getStatusKelulusan(selectedUjian?.status_kelulusan).label"
    />

    <StatusLabel
      class="block w-fit lg:hidden"
      :status="getStatusKelulusan(selectedUjian?.status_kelulusan).color"
      size="md"
      :label="getStatusKelulusan(selectedUjian?.status_kelulusan).label"
    />
    <!-- Bagian catatan revisi tetap sama -->
    <h5
      v-if="catatanRevisi && catatanRevisi.length > 0"
      class="mt-2 mb-2 body3-bold lg:body1-bold text-primary"
    >
      Catatan Revisi
    </h5>
    <div
      v-if="catatanRevisi && catatanRevisi.length > 0"
      class="flex flex-col gap-2"
    >
      <template v-for="(item, idx) in catatanRevisi" :key="idx">
        <QuillTextReader
          class="mb-2"
          v-if="item.revisi && item.revisi !== '<p><br></p>'"
          :id="`catatan_revisi_${idx + 1}`"
          :label="`${item.nama}`"
          :content="item.revisi || '<p>Tidak ada catatan revisi</p>'"
        />
      </template>
    </div>
  </DefaultModal>
</template>

<script setup>
import { ref, computed } from "vue";
import Accordion from "@/components/Tugas-akhir/Accordion.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import QuillTextReader from "@/components/Tugas-akhir/Forms/QuillTextReader.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
// Import useRouter untuk navigasi
import { useRoute, useRouter } from "vue-router";
import Loading from "@/components/Loading.vue";
import { useTugasAkhir } from "@/services/TugasAkhir/Mhs/ujianTA.js";
import { getUserData } from "@/services/authMahasiswa.js";
import StatusLabel from "@/components/Tugas-akhir/Label.vue";
const userData = getUserData();
const username = userData?.name || userData?.email?.split("@")[0] || "User";
const nim = userData?.nim || "";

const route = useRoute();
const router = useRouter(); // Inisialisasi router

// Panggil composable untuk mengambil data
const { dataTugasAkhir, loadingTugasAkhir, errorTugasAkhir } = useTugasAkhir();

const minimalBimbingan = computed(() => {
  // Periksa apakah dataTugasAkhir.value adalah array dan memiliki elemen
  if (Array.isArray(dataTugasAkhir.value) && dataTugasAkhir.value.length > 0) {
    // Periksa semua tugas akhir, jika ada salah satu yang memenuhi syarat
    return dataTugasAkhir.value.some(
      (ta) => (ta?.bimbingan?.total_bimbingan ?? 0) >= 9
    );
  }
  // Jika bukan array atau array kosong
  return false;
});

// Fungsi untuk navigasi ke halaman berkas
const goToBerkas = (tugasAkhirId) => {
  router.push({
    name: "BerkasTAMhs",
    params: { tugas_akhir_id: tugasAkhirId },
  });
};
const goToDetail = (tugasAkhirId) => {
  router.push({
    name: "DetailUjianTAMhs",
    params: { tugas_akhir_id: tugasAkhirId },
  });
};
function handleDetail(item, ujianIndex) {
  if (item.jumlahUjian === 1) {
    goToDetail(item.id);
    return;
  }
  if (ujianIndex === 0) {
    goToDetail(item.id);
  } else if (ujianIndex === 1) {
    // Ambil data original dari dataTugasAkhir.value
    const ta = dataTugasAkhir.value.find((t) => t.tugas_akhir_id === item.id);

    // Ambil jadwal ujian lama (index 1 dari asli tanpa reverse)
    const ujianLama = ta.jadwal_ujian?.[1]; // Ambil langsung index 1 (ujian lama)
    selectedUjian.value = ujianLama; // Set ke state untuk modal

    if (ujianLama?.dosen_penguji?.length > 0) {
      // Langsung akses array dosen_penguji dan ambil revisi dari tiap dosen
      catatanRevisi.value = ujianLama.dosen_penguji.map((penguji) => ({
        nama: penguji.name,
        revisi:
          penguji.nilai_ujian_ta?.revisi || "<p>Tidak ada catatan revisi</p>",
      }));

      judulTugasAkhir.value = item.title || ta.judul_tugas_akhir;
      openNilaiModal();
    } else {
      console.error("Tidak ada dosen penguji:", ujianLama);
    }
  }
}

const getStatusKelulusan = (status) => {
  const statusMap = {
    1: { label: "Lulus", color: "success" },
    2: { label: "Lulus (Revisi)", color: "success" },
    3: { label: "Revisi (Ulang)", color: "warning" },
    4: { label: "Tidak Lulus", color: "danger" },
  };
  return statusMap[status] || { label: "Terjadwal", color: "success" };
};

// Gunakan computed property untuk mengubah data API menjadi format yang dibutuhkan accordion
const formattedAccordionItems = computed(() => {
  if (!dataTugasAkhir.value || dataTugasAkhir.value.length === 0) {
    return [];
  }

  return dataTugasAkhir.value.map((ta) => {
    const jadwalUjian = [...(ta.jadwal_ujian || [])].reverse();
    const ujian1 = jadwalUjian[0]; // Terbaru
    const ujian2 = jadwalUjian[1]; // Lama

    // Status kelulusan per ujian
    const statusLabel1 = getStatusKelulusan(ujian1?.status_kelulusan).label;
    const status1 = getStatusKelulusan(ujian1?.status_kelulusan).color;
    const statusLabel2 = getStatusKelulusan(ujian2?.status_kelulusan).label;
    const status2 = getStatusKelulusan(ujian2?.status_kelulusan).color;

    // Tentukan jika ada ujianTA yang aktif
    const hasActiveExam = jadwalUjian.some(
      (ujian) => ujian.status_ujian === "aktif"
    );

    // Status utama untuk card
    let statusLabelUtama;
    let statusUtama;

    if (ta.status_kelulusan === 4) {
      // Status "Tidak Lulus" - prioritas tertinggi
      statusLabelUtama = "Tidak Lulus";
      statusUtama = "danger";
    } else if (ta.status_valid === 0) {
      // Status "Menunggu"
      statusLabelUtama = "Menunggu";
      statusUtama = "warning";
    } else if (ta.status_valid === 2) {
      // Status "Ditolak"
      statusLabelUtama = "Ditolak";
      statusUtama = "danger";
    } else if (ta.status_valid === 1) {
      // Status "Diterima"
      if (hasActiveExam) {
        // Ada ujian aktif
        const activeExam = jadwalUjian.find(
          (ujian) => ujian.status_ujian === "aktif"
        );

        // Jika ujian aktif sudah memiliki status kelulusan, gunakan itu
        if (
          activeExam?.status_kelulusan !== null &&
          activeExam?.status_kelulusan !== undefined
        ) {
          statusLabelUtama = getStatusKelulusan(
            activeExam.status_kelulusan
          ).label;
          statusUtama = getStatusKelulusan(activeExam.status_kelulusan).color;
        } else {
          // Jika tidak, gunakan "Terjadwal"
          statusLabelUtama = "Terjadwal";
          statusUtama = "success";
        }
      } else if (jadwalUjian.length > 0) {
        // Tidak ada ujian aktif, tapi ada riwayat ujian
        // Gunakan status dari ujian terbaru (ujian1) jika ada, jika tidak ada gunakan ujian lama (ujian2)
        if (
          ujian1?.status_ujian !== "non-aktif" &&
          ujian1?.status_kelulusan !== null &&
          ujian1?.status_kelulusan !== undefined
        ) {
          statusLabelUtama = statusLabel1;
          statusUtama = status1;
        } else if (
          ujian2?.status_ujian !== "non-aktif" &&
          ujian2?.status_kelulusan !== null &&
          ujian2?.status_kelulusan !== undefined
        ) {
          statusLabelUtama = statusLabel2;
          statusUtama = status2;
        } else {
          // Belum ada status kelulusan
          statusLabelUtama = "Diterima";
          statusUtama = "success";
        }
      } else {
        // Tidak ada ujian sama sekali
        statusLabelUtama = "Diterima";
        statusUtama = "success";
      }
    } else {
      // Default case (jika status_valid tidak 0, 1, atau 2)
      statusLabelUtama = "Belum daftar";
      statusUtama = "Inactive";
    }

    // Perbaikan kondisi showBerkasButton
    // Perbaikan kondisi showBerkasButton
    const showBerkasButton =
      ta.status_valid === 0 || // Menunggu
      ta.status_valid === 2 || // Ditolak
      (ta.status_valid === 1 && ta.status_kelulusan !== 4 && !hasActiveExam); // Diterima, bukan tidak lulus, dan tanpa ujian aktif

    const showDetailButton = ta.status_valid === 1 && hasActiveExam;

    // Tambahkan kondisi untuk menampilkan history button jika ada ujian non-aktif
    const showHistoryButton =
      jadwalUjian.length > 1 || // Ada lebih dari 1 ujian
      (jadwalUjian.length === 1 && jadwalUjian[0].status_ujian === "non-aktif"); // Atau ada 1 ujian yang non-aktif

    return {
      id: ta.tugas_akhir_id,
      title:
        ta.judul_tugas_akhir ||
        `Tugas Akhir ${ta.tahun_ajaran?.tahun_ajaran || ""}`,
      headText: "Dosen Pembimbing",
      bodyText: ta.dosen_pembimbing?.name || "-",
      headText2: "Kategori",
      bodyText2: ta.kategori?.nama_kategori || "-",
      headText3: "Status",
      bodyText3: ta.status_aktif === 1 ? "Aktif" : "Non-Aktif",
      tahunLabel: "Tahun Ajaran",
      tahunAjaran: ta.tahun_ajaran?.tahun_ajaran || "-",
      showHistoryButton,
      showDaftarButton:
        ta.status_valid === null ||
        ta.status_valid === undefined ||
        ta.status_valid === 3,
      showBerkasButton,
      showDetailButton,
      // Status utama
      statusLabelUtama,
      statusUtama,
      // Data ujian 1 (terbaru)
      date1: ujian1?.tanggal_ujian || "-",
      room1: ujian1?.ruang?.nama_ruang || "-",
      time1: ujian1?.sesi
        ? `${ujian1.sesi.nama_sesi} (${ujian1.sesi.waktu_mulai} - ${ujian1.sesi.waktu_selesai})`
        : "-",
      statusLabel1,
      status1,
      // Data ujian 2 (lama)
      date2: ujian2?.tanggal_ujian,
      room2: ujian2?.ruang?.nama_ruang,
      time2: ujian2?.sesi
        ? `${ujian2.sesi.nama_sesi} (${ujian2.sesi.waktu_mulai} - ${ujian2.sesi.waktu_selesai})`
        : undefined,
      statusLabel2,
      status2,
      ujian1, // terbaru
      ujian2, // lama
      jumlahUjian: jadwalUjian.length,
    };
  });
});

const showNilaiModal = ref(false);
const catatanRevisi = ref([]);
const judulTugasAkhir = ref("");
const selectedUjian = ref(null);
const openNilaiModal = () => {
  showNilaiModal.value = true;
};
function closeNilaiModal() {
  showNilaiModal.value = false;
}
</script>
