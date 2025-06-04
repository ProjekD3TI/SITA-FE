<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import JadwalUjian from "@/components/Tugas-akhir/JadwalUjian.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Tooltip from "@/components/Tugas-akhir/Tooltip.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputNumber from "@/components/Tugas-akhir/Forms/InputNumber.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import Loading from "@/components/Loading.vue";

const route = useRoute();

// App State
const dinilai = ref(true); // Changed to true to show the student has been graded
const showNilaiModal = ref(false);

// PDF handling
const pdfUrl =
  "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

// Data untuk komponen penguji
const examiners = [
  { name: "John Batubara, A. Xioo, M. Si, A. Cer", role: "Ketua" },
  { name: "Dr. Sinta Wijaya, M.Kom", role: "Sekretaris" },
  { name: "Prof. Ahmad Rizal, Ph.D", role: "Dosen Penguji" },
];

// Jadwal ujian dari query parameters
const schedule = ref({
  date: "",
  time: "",
  room: "",
});

// TA details dari query parameters
const tugasAkhirDetails = ref({
  nim: "",
  nama: "",
  judul: "",
  kategori: "",
  dosenPembimbing: "Agus Kotak S.Ht", // Default, bisa diganti dengan data sebenarnya
  tahunAjaran: "2023/2024",
  nilai: 90,
  catatan:
    "Tugas akhir sangat baik, presentasi lancar, dan mahasiswa dapat menjawab semua pertanyaan dengan tepat.",
});

// Data nilai mahasiswa untuk ditampilkan
const statusKelulusan = ref("Lulus dengan revisi");
const tataLaporan = ref(85);
const kemampuanTeknis = ref(90);
const hasilProduk = ref(88);
const presentasi = ref(92);
const catatanRevisi = ref(
  "Perbaiki format penulisan pada BAB II dan tambahkan detail pada bab metodologi. Referensi perlu diperbaharui dengan sumber terbaru (maksimal 5 tahun terakhir)."
);

// Computed untuk total nilai
const totalNilai = computed(() => {
  return (
    tataLaporan.value * 0.15 +
    kemampuanTeknis.value * 0.35 +
    hasilProduk.value * 0.25 +
    presentasi.value * 0.25
  ).toFixed(2);
});

// Load data from query parameters
onMounted(() => {
  // Get data from query params
  const { nim, name, category, title, date, session, room } = route.query;

  console.log("Query parameters received:", route.query);

  // Update schedule data with formatted date to include day
  if (date && session && room) {
    schedule.value = {
      date: formatDateWithDay(date), // Menambahkan nama hari
      time: session,
      room: room,
    };
  }

  // Update tugasAkhirDetails
  if (name && title) {
    tugasAkhirDetails.value = {
      ...tugasAkhirDetails.value,
      nim: nim || "V3423999",
      nama: name,
      judul: title,
      kategori: category || "Internet Of Things",
    };
  }
});

// Helper function untuk konversi format tanggal dan menampilkan hari
const formatDateWithDay = (dateString) => {
  try {
    // Array untuk nama hari dalam bahasa Indonesia
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    // Array untuk nama bulan dalam bahasa Indonesia
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    // Parse date string (format: "31 Mei 2024")
    const parts = dateString.split(" ");
    if (parts.length !== 3) {
      return dateString; // Return original if not in expected format
    }

    const day = parseInt(parts[0]);
    const monthIndex = months.findIndex((m) => m === parts[1]);
    const year = parseInt(parts[2]);

    if (monthIndex === -1 || isNaN(day) || isNaN(year)) {
      return dateString; // Return original if parsing failed
    }

    // Create date object
    const date = new Date(year, monthIndex, day);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid date
    }

    // Get day of week
    const dayName = days[date.getDay()];

    // Format: "Senin, 31 Mei 2024"
    return `${dayName}, ${dateString}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if error occurs
  }
};
// Methods
const openNilaiModal = () => {
  showNilaiModal.value = true;
};

const closeNilaiModal = () => {
  showNilaiModal.value = false;
};

// Computed properties
const buttonClasses = computed(() => {
  return dinilai.value ? "opacity-100" : "opacity-50";
});

// Computed for modal body text
const modalBodyText = computed(() => {
  return `${tugasAkhirDetails.value.nama} | ${tugasAkhirDetails.value.nim} | ${tugasAkhirDetails.value.judul}`;
});
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center min-h-[80dvh]">
    <Loading />
  </div>
  <div v-else-if="!$route.path.includes('input-nilai-ujian-ta')">
    <Breadcrumb :items="breadcrumbItems" />
    <!-- Jadwal Section -->
    <div class="card-rounded bg-white p-6 lg:p-8">
      <div class="max-w-screen-2xl mx-auto">
        <JadwalUjian :examiners="examiners" :jadwal="schedule" />
      </div>
    </div>

    <!-- Tugas Akhir Details Section -->
    <div class="card-rounded bg-white p-6 lg:p-8 mt-6">
      <div class="max-w-screen-2xl mx-auto">
        <div class="flex flex-col md:flex-row">
          <!-- PDF Preview (Left Side) -->
          <div class="basis-7/12 md:pe-8 order-last md:order-first">
            <object
              :data="pdfUrl"
              type="application/pdf"
              class="w-full h-[750px] mt-6 md:mt-0"
            >
              <p class="p-4 text-center">
                Browser Anda tidak mendukung tampilan PDF.
                <a :href="pdfUrl" target="_blank" class="text-primary"
                  >Klik di sini</a
                >
                untuk membuka PDF.
              </p>
            </object>
          </div>

          <!-- Details (Right Side) -->
          <div class="basis-5/12 flex flex-col gap-4">
            <!-- Detail items -->
            <div class="flex flex-col gap-2">
              <div>
                <h5 class="body1-bold">Judul Tugas Akhir</h5>
                <p class="body1 text-primary">{{ tugasAkhirDetails.judul }}</p>
              </div>

              <div>
                <h5 class="body1-bold">Kategori</h5>
                <p class="body1 text-primary">
                  {{ tugasAkhirDetails.kategori }}
                </p>
              </div>

              <div>
                <h5 class="body1-bold">NIM</h5>
                <p class="body1 text-primary">{{ tugasAkhirDetails.nim }}</p>
              </div>

              <div>
                <h5 class="body1-bold">Nama Mahasiswa</h5>
                <p class="body1 text-primary">{{ tugasAkhirDetails.nama }}</p>
              </div>

              <div>
                <h5 class="body1-bold">Dosen Pembimbing</h5>
                <p class="body1 text-primary">
                  {{ tugasAkhirDetails.dosenPembimbing }}
                </p>
              </div>

              <div>
                <h5 class="body1-bold">Tahun Ajaran</h5>
                <p class="body1 text-primary">
                  {{ tugasAkhirDetails.tahunAjaran }}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex self-end gap-4 items-center">
              <router-link
                :to="{
                  path: '/dosen/tugas-akhir/ujian-ta/detail-ujian-ta/input-nilai-ujian-ta',
                  query: {
                    nim: tugasAkhirDetails.nim,
                    name: tugasAkhirDetails.nama,
                    category: tugasAkhirDetails.kategori,
                    title: tugasAkhirDetails.judul,
                  },
                }"
              >
                <Button
                  variant="primary"
                  size="lg"
                  class="w-fit sm:flex hidden"
                >
                  Input Nilai
                </Button>
              </router-link>

              <router-link
                :to="{
                  path: '/dosen/tugas-akhir/ujian-ta/detail-ujian-ta/input-nilai-ujian-ta',
                  query: {
                    nim: tugasAkhirDetails.nim,
                    name: tugasAkhirDetails.nama,
                    category: tugasAkhirDetails.kategori,
                    title: tugasAkhirDetails.judul,
                  },
                }"
              >
                <Button variant="primary" size="md" class="w-fit sm:hidden">
                  Input Nilai
                </Button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <router-view v-else></router-view>

  <!-- Modal Lihat Nilai -->
  <DefaultModal
    v-if="showNilaiModal"
    @close="closeNilaiModal"
    headText="Nilai Ujian Tugas Akhir"
    :bodyText="modalBodyText"
  >
    <div>
      <div class="my-5">
        <p class="heading5 text-[#00A2EA] font-semibold mb-3">
          Status Kelulusan
        </p>
        <p class="body1 font-medium">{{ statusKelulusan }}</p>
      </div>
      <div class="my-5">
        <p class="heading5 text-[#00A2EA] font-semibold mb-5">Nilai Ujian</p>
        <div class="flex flex-wrap gap-4">
          <div class="w-full sm:w-[calc(50%-0.5rem)]">
            <InputNumber
              id="tataLaporan"
              label="Kualitas Tata Laporan Tugas Akhir (15%)"
              placeholder="85"
              v-model="tataLaporan"
              disabled
            />
          </div>

          <div class="w-full sm:w-[calc(50%-0.5rem)]">
            <InputNumber
              id="kemampuanTeknis"
              label="Kemampuan Teknis (35%)"
              placeholder="90"
              v-model="kemampuanTeknis"
              disabled
            />
          </div>

          <div class="w-full sm:w-[calc(50%-0.5rem)]">
            <InputNumber
              id="hasilProduk"
              label="Kualitas Produk yang Dihasilkan (25%)"
              placeholder="88"
              v-model="hasilProduk"
              disabled
            />
          </div>

          <div class="w-full sm:w-[calc(50%-0.5rem)]">
            <InputNumber
              id="presentasi"
              label="Presentasi dan Question Handling (25%)"
              placeholder="92"
              v-model="presentasi"
              disabled
            />
          </div>
        </div>
        <div class="my-5">
          <p class="heading5 text-[#00A2EA] font-semibold mb-3">
            Nilai Rata-Rata
          </p>
          <p class="body1 font-bold text-xl">{{ totalNilai }}</p>
        </div>
      </div>
      <div class="my-5" v-if="catatanRevisi">
        <p class="heading5 text-[#00A2EA] font-semibold mb-5">Catatan Revisi</p>
        <InputTextarea
          id="catatanRevisi"
          label=""
          placeholder="Perbaiki format penulisan pada BAB II dan tambahkan detail pada bab metodologi. Referensi perlu diperbaharui dengan sumber terbaru (maksimal 5 tahun terakhir)."
          v-model="catatanRevisi"
          disabled
        ></InputTextarea>
      </div>
    </div>
  </DefaultModal>
</template>
