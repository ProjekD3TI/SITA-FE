<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import UserData from "@/components/Tugas-akhir/UserData.vue";
import InputDropdown from "@/components/Tugas-akhir/Forms/InputDropdown.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputDate from "@/components/Tugas-akhir/Forms/InputDate.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useShowPenjadwalan } from "@/services/TugasAkhir/Admin/ujianTA.js";
const route = useRoute();
const router = useRouter();
const toast = useToast();

const {
  dataShowPenjadwalan,
  loadingShowPenjadwalan,
  errorShowPenjadwalan,
  fetchShowPenjadwalan,
  checkAvailability,
  updatePenjadwalan,
  submitPenjadwalan,
} = useShowPenjadwalan();

// Form state
const selectedTanggal = ref("");
const selectedRuang = ref("");
const selectedSesi = ref("");
const isSubmitting = ref(false);

// Availability options
const availableDates = ref([]);
const availableRuang = ref([]);
const availableSesi = ref([]);

// Tambahkan computed untuk available dates sebagai array string
const availableDateStrings = computed(() =>
  availableDates.value.map((date) => date.date)
);
// Function untuk check apakah tanggal available
const isDateAvailable = (dateString) => {
  return availableDateStrings.value.includes(dateString);
};
// Function untuk get min dan max date dari available dates
const dateRange = computed(() => {
  if (availableDates.value.length === 0) {
    return {
      min: new Date().toISOString().split("T")[0],
      max: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };
  }

  const dates = availableDates.value.map((d) => d.date).sort();
  return {
    min: dates[0],
    max: dates[dates.length - 1],
  };
});
const ruangOptions = computed(() =>
  availableRuang.value.map((ruang) => ({
    value: ruang.ruang_id,
    label: ruang.nama_ruang,
  }))
);

const sesiOptions = computed(() =>
  availableSesi.value.map((sesi) => ({
    value: sesi.sesi_id,
    label: `${sesi.nama_sesi} (${sesi.waktu_mulai} - ${sesi.waktu_selesai})`,
  }))
);

// Validasi form
const isFormValid = computed(() => {
  return selectedTanggal.value && selectedRuang.value && selectedSesi.value;
});

// Check if this is an update (jadwal sudah ada)
const isUpdate = computed(() => {
  return dataShowPenjadwalan.value?.ujian_ta?.ujian_ta_id;
});

// Function untuk update availability (sama seperti sebelumnya)
const updateAvailability = async () => {
  if (!route.params.tugas_akhir_id) return;

  try {
    const filters = {};
    if (selectedTanggal.value) filters.tanggal_ujian = selectedTanggal.value;
    if (selectedRuang.value) filters.ruang_id = selectedRuang.value;
    if (selectedSesi.value) filters.sesi_id = selectedSesi.value;

    const availability = await checkAvailability(
      route.params.tugas_akhir_id,
      filters
    );

    if (availability) {
      availableDates.value = availability.available_dates || [];
      availableRuang.value = availability.available_ruang || [];
      availableSesi.value = availability.available_sesi || [];
    }
  } catch (error) {
    toast.error("Error dalam memeriksa ketersediaan: " + error.message);
  }
};

// Function untuk load initial data
const loadInitialData = () => {
  if (dataShowPenjadwalan.value?.availability) {
    availableDates.value =
      dataShowPenjadwalan.value.availability.available_dates || [];
    availableRuang.value =
      dataShowPenjadwalan.value.availability.available_ruang || [];
    availableSesi.value =
      dataShowPenjadwalan.value.availability.available_sesi || [];
  }

  // Set initial values jika sudah ada jadwal
  if (dataShowPenjadwalan.value?.ujian_ta) {
    const ujianTA = dataShowPenjadwalan.value.ujian_ta;
    selectedTanggal.value = ujianTA.tanggal_ujian || "";
    selectedRuang.value = ujianTA.ruang?.ruang_id || "";
    selectedSesi.value = ujianTA.sesi?.sesi_id || "";
  }
};

// Function untuk submit form
const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.error("Mohon lengkapi semua field yang diperlukan");
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      tugas_akhir_id: parseInt(route.params.tugas_akhir_id),
      tanggal_ujian: selectedTanggal.value,
      ruang_id: parseInt(selectedRuang.value),
      sesi_id: parseInt(selectedSesi.value),
      status_ujian: "aktif",
    };

    let response;
    if (isUpdate.value) {
      response = await updatePenjadwalan(
        dataShowPenjadwalan.value.ujian_ta.ujian_ta_id,
        payload
      );
    } else {
      response = await submitPenjadwalan(payload);
    }

    if (response) {
      router.push({
        path: "UjianTAforAdmin",
        query: { refresh: Date.now().toString() },
      });
    }
  } catch (error) {
    console.error("Error submitting:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const penguji = computed(() => {
  const arr = dataShowPenjadwalan.value?.dosen_penguji || [];
  return {
    ketua: arr.find((d) => d.jabatan_penguji === "ketua")?.name || "",
    sekretaris: arr.find((d) => d.jabatan_penguji === "sekretaris")?.name || "",
    penguji: arr.find((d) => d.jabatan_penguji === "penguji")?.name || "",
  };
});

onMounted(() => {
  if (route.params.tugas_akhir_id) {
    fetchShowPenjadwalan(route.params.tugas_akhir_id);
  }
});

// Watch untuk perubahan selection
watch(
  [selectedTanggal, selectedRuang, selectedSesi],
  () => {
    updateAvailability();
  },
  { deep: true }
);

// Watch untuk data penjadwalan
watch(
  dataShowPenjadwalan,
  () => {
    loadInitialData();
  },
  { deep: true }
);
// Watch untuk validasi tanggal yang dipilih
watch(selectedTanggal, (newDate) => {
  if (newDate && !isDateAvailable(newDate)) {
    toast.warning(
      "Tanggal yang dipilih tidak tersedia. Silakan pilih tanggal yang tersedia."
    );
    // Reset atau cari tanggal terdekat yang available
    if (availableDates.value.length > 0) {
      selectedTanggal.value = availableDates.value[0].date;
    }
  }
});
onMounted(() => {
  if (route.params.tugas_akhir_id) {
    fetchShowPenjadwalan(route.params.tugas_akhir_id);
  }
});
</script>
<template>
  <div
    v-if="loadingShowPenjadwalan"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>

  <div v-else-if="errorShowPenjadwalan" class="p-4">
    <ErrorMsg :message="errorShowPenjadwalan" />
  </div>
  <div v-else>
    <Breadcrumb />
    <div class="p-4 bg-white card-rounded lg:p-8">
      <div class="mx-auto max-w-screen-2xl">
        <UserData
          :headText="dataShowPenjadwalan?.mahasiswa?.nim || 'NIM Mahasiswa'"
          :bodyText="dataShowPenjadwalan?.mahasiswa?.name || 'Nama Mahasiswa'"
          :headText2="
            dataShowPenjadwalan?.kategori?.nama_kategori ||
            'Kategori Tugas Akhir'
          "
          :bodyText2="
            dataShowPenjadwalan?.judul_tugas_akhir || 'Judul Tugas Akhir'
          "
          :tahunAjaran="
            dataShowPenjadwalan?.tahun_ajaran?.tahun_ajaran || 'Tahun Ajaran'
          "
        />
        <div class="flex flex-col gap-4 mt-4">
          <div class="flex flex-col gap-4 opacity-50">
            <InputText
              id="ketua-penguji"
              label="Ketua Penguji"
              placeholder="Pilih Dosen"
              :modelValue="penguji.ketua"
              :disabled="true"
            />
            <InputText
              id="sekretaris-penguji"
              label="Sekretaris Penguji"
              placeholder="Pilih Dosen"
              :modelValue="penguji.sekretaris"
              :disabled="true"
            />
            <InputText
              id="penguji"
              label="Penguji"
              placeholder="Pilih Dosen"
              :modelValue="penguji.penguji"
              :disabled="true"
            />
          </div>
          <div class="flex flex-wrap justify-between gap-4 sm:flex-nowrap">
            <div class="flex flex-col w-full">
              <InputDate
                id="tanggal"
                label="Tanggal"
                :value="selectedTanggal"
                :min="dateRange.min"
                :max="dateRange.max"
                @update:value="selectedTanggal = $event"
                required
              />
              <div
                v-if="selectedTanggal && !isDateAvailable(selectedTanggal)"
                class="mt-1 text-sm text-red-500"
              >
                Tanggal tidak tersedia
              </div>
              <!-- Tampilkan daftar tanggal available sebagai hint -->
              <!-- <div class="mt-1 text-xs text-gray-500">
                Tanggal tersedia:
                {{ availableDateStrings.slice(0, 3).join(", ") }}
                <span v-if="availableDateStrings.length > 3">...</span>
              </div> -->
            </div>
            <InputDropdown
              id="ruang"
              label="Ruang"
              placeholder="Pilih ruang"
              :options="ruangOptions"
              :modelValue="selectedRuang"
              @update:modelValue="selectedRuang = $event"
              required
            />
            <InputDropdown
              id="sesi"
              label="Sesi"
              placeholder="Pilih sesi"
              :options="sesiOptions"
              :modelValue="selectedSesi"
              @update:modelValue="selectedSesi = $event"
              required
            />
          </div>
          <Button
            variant="primary"
            size="lg"
            class="self-end hidden w-fit sm:flex"
            :disabled="!isFormValid || isSubmitting"
            @click="handleSubmit"
          >
            {{
              isSubmitting ? "Menyimpan..." : isUpdate ? "Update " : "Simpan "
            }}
          </Button>
          <Button
            variant="primary"
            size="md"
            class="self-end w-fit sm:hidden"
            :disabled="!isFormValid || isSubmitting"
            @click="handleSubmit"
          >
            {{ isSubmitting ? "Menyimpan..." : isUpdate ? "Update" : "Simpan" }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
