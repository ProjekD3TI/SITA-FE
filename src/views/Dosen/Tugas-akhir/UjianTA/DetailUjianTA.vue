<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import JadwalUjian from "@/components/Tugas-akhir/JadwalUjian.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Tooltip from "@/components/Tugas-akhir/Tooltip.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import router from "@/router";

const route = useRoute();

// App State
const dinilai = ref(false);
const showNilaiModal = ref(false);

// PDF handling
const pdfUrl =
  "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

// Data untuk komponen penguji
const examiners = [
  { name: "John Batubara, A. Xioo, M. Si, A. Cer", role: "Ketua" },
  { name: "Dr. Sinta Wijaya, M.Kom", role: "Anggota" },
  { name: "Prof. Ahmad Rizal, Ph.D", role: "Anggota" },
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
  <div v-if="!$route.path.includes('input-nilai-ujian-ta')">
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
                  @click="
                    router.push({
                      name: 'input-nilai-ujian-ta',
                      query: { nim: tugasAkhirDetails.nim },
                    })
                  "
                >
                  Input Nilai
                </Button>
              </router-link>

              <Button
                variant="primary"
                size="md"
                class="w-fit sm:hidden"
                @click="
                  router.push({
                    name: 'input-nilai-ujian-ta',
                    query: { nim: tugasAkhirDetails.nim },
                  })
                "
              >
                Input Nilai
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <router-view v-else></router-view>
  <!-- Modal Nilai -->
  <DefaultModal
    v-if="showNilaiModal"
    @close="closeNilaiModal"
    headText="Nilai Ujian Tugas Akhir"
    :bodyText="modalBodyText"
  >
    <div class="flex flex-col gap-4 mt-4">
      <InputText
        id="nilai-ujian-ta"
        label="Nilai Ujian Tugas Akhir"
        :modelValue="tugasAkhirDetails.nilai"
        disabled
      />

      <InputTextarea
        id="catatan-ujian-ta"
        label="Catatan"
        :modelValue="tugasAkhirDetails.catatan"
        disabled
      />
    </div>
  </DefaultModal>
</template>
