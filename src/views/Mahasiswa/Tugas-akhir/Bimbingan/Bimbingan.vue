<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputDropdown from "@/components/Tugas-akhir/Forms/InputDropdown.vue";
import UserData from "@/components/Tugas-akhir/UserData.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import StatusLabel from "@/components/Tugas-akhir/Label.vue";
import ProgressBarBAB from "@/components/Tugas-akhir/ProgressBarBAB.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import ModalTimer from "@/components/Tugas-akhir/Modals/ModalTimer.vue";
import ModalDetailBimbingan from "@/components/Tugas-akhir/Modals/ModalDetailBimbingan.vue";
import DefaultAvatar from "@/assets/images/Profile Avatar.svg";
import {
  useBimbingan,
  useRequestPembimbing,
  getStatusClass,
  getStatusLabel,
  defaultTahunAjaran,
  hasActiveTA,
  hasPembimbing,
  waitingResponse,
  declined,
  namaDosenRequestPembimbing,
  kategoriTA,
  tahunAjaranTA,
  pembimbings,
  selectedDosenData,
  // formattedBimbinganData,
  listBimbingan,
  categories,
  selectedPembimbing,
  namaPembimbing,
  dataNilaiBimbingan,
} from "@/services/TugasAkhir/Mhs/bimbingan.js";
import { getUserData } from "@/services/authMahasiswa";
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const userData = getUserData();
const username = userData?.name || userData?.email?.split("@")[0] || "User";
const nim = userData?.nim || "";
const {
  loadingBimbingan,
  errorBimbingan,
  highestBAB,
  paginationBimbingan,
  fetchData,
} = useBimbingan();

const {
  loadingRequest,
  errorRequest,
  submitRequestPembimbing,
  fetchRequestData,
} = useRequestPembimbing();

// Dummy dosen

// ============================================
// KONFIGURASI AWAL DAN STATE MANAGEMENT
// ============================================

const currentPage = ref(1);
const selectedCategory = ref("");
const timerModalRef = ref(null);
const showBimbinganModal = ref(false);
const selectedBimbingan = ref(null);
const modalDetailRef = ref(null);
const showNilaiModal = ref(false);

// ============================================
// COMPUTED PROPERTIES
// ============================================
const enhancedSelectedDosenData = computed(() => {
  if (!selectedDosenData.value) return null;

  // Cari data lengkap dari pembimbings
  const enhancedDosen = pembimbings.value.find(
    (dosen) => dosen.value?.toString() === selectedPembimbing.value?.toString()
  );

  return {
    ...selectedDosenData.value,
    akses_ta: enhancedDosen?.akses_ta || 1,
    disabled: enhancedDosen?.disabled || false,
  };
});
const isSubmitDisabled = computed(
  () =>
    !selectedDosenData.value || !selectedCategory.value || loadingRequest.value
);

// ============================================
// METHODS & HANDLERS
// ============================================

const openModal = () => {
  timerModalRef.value.open();
};

function toRoman(num) {
  const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return romans[num - 1] || num;
}
const toast = useToast(); // Tambahkan ini
const validateDosenAccess = () => {
  const selectedDosen = enhancedSelectedDosenData.value;

  if (selectedDosen && selectedDosen.akses_ta !== 1) {
    toast.error("Dosen yang dipilih tidak memiliki akses Tugas Akhir!");
    return false;
  }

  return true;
};
const handleSubmit = async () => {
  if (!selectedCategory.value || !selectedPembimbing.value) return;
  if (!validateDosenAccess()) {
    return;
  }
  const payload = {
    kategori_id: selectedCategory.value,
    dosen_id: selectedPembimbing.value,
  };
  const success = await submitRequestPembimbing(payload);
  if (success) {
    await fetchRequestData();
  } else {
    toast.error("Gagal mengirim permintaan pembimbing.");
  }
};
const handleRowClick = (item) => {
  const index = numberedBimbingan.value.findIndex((b) => b === item);
  selectedBimbingan.value = { ...item, index };
  showBimbinganModal.value = true;
  nextTick(() => {
    modalDetailRef.value?.open();
  });
};
const closeDetailModal = () => {
  showBimbinganModal.value = false;
  selectedBimbingan.value = null;
};
// Ganti listBimbingan dengan numberedBimbingan yang sudah include nomor urut
const numberedBimbingan = computed(() => {
  const currentPageValue = Number(currentPage.value) || 1;
  const perPage = Number(paginationBimbingan.value?.per_page) || 10;
  const startNumber = perPage * (currentPageValue - 1) + 1;

  return listBimbingan.value.map((item, index) => ({
    ...item,
    rowNumber: startNumber + index,
  }));
});
// ============================================
// LIFECYCLE HOOKS
onMounted(() => {
  fetchData(currentPage.value);
});
watch(currentPage, (val) => {
  fetchData(val);
});
// Watch untuk route query refresh
watch(
  () => route.query.refresh,
  (newValue) => {
    if (newValue) {
      // Reset ke halaman 1 dan fetch data
      currentPage.value = 1;
      fetchData(1);
      // Clean query parameter
      router.replace({ path: route.path });
    }
  }
);
// ============================================
</script>

<template>
  <router-view v-if="$route.path.includes('tambah-bimbingan')"></router-view>

  <div
    v-else-if="loadingBimbingan || loadingRequest"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>

  <div v-else-if="errorBimbingan || errorRequest" class="p-4">
    <ErrorMsg :msg="errorBimbingan || errorRequest" />
  </div>

  <div v-else>
    <!-- Breadcrumb untuk navigasi -->
    <Breadcrumb />

    <!-- STATE 1: BELUM ADA TA AKTIF - FORM REQUEST PEMBIMBING -->
    <div
      v-if="!hasActiveTA && !hasPembimbing"
      class="p-4 bg-white card-rounded lg:p-8 shadow-custom"
    >
      <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
        <h5 class="body4-bold sm:body3-bold text-blackText">
          Anda belum memiliki pembimbing, silahkan pilih dosen untuk diminta
          menjadi pembimbing terlebih dahulu!
        </h5>

        <!-- Form Request Pembimbing -->
        <form class="flex flex-col gap-4 mt-2">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- Input Kategori -->
            <InputDropdown
              id="kategori-dropdown"
              label="Kategori Tugas Akhir"
              :options="categories"
              placeholder="Pilih kategori tugas akhir"
              v-model="selectedCategory"
              default-option-text="-- Pilih kategori --"
              required
            />

            <!-- Input Tahun Ajaran (Disabled) -->
            <InputText
              id="tahun-ajaran"
              label="Tahun Ajaran"
              placeholder="Tahun Ajaran"
              :modelValue="defaultTahunAjaran"
              :disabled="true"
            />

            <!-- Input Dosen Pembimbing -->
            <InputDropdown
              class="sm:col-span-2"
              id="dosen-dropdown"
              label="Dosen Pembimbing"
              :options="pembimbings"
              placeholder="Pilih dosen pembimbing"
              v-model="selectedPembimbing"
              default-option-text="-- Pilih dosen --"
              required
            />
          </div>
          <div
            v-if="
              enhancedSelectedDosenData &&
              enhancedSelectedDosenData.akses_ta !== 1
            "
            class="p-2 px-6 text-red-700 bg-red-100 border border-red-400 body4 input-rounded"
          >
            Dosen yang dipilih Non-aktif
          </div>

          <!-- Preview Dosen Terpilih -->
          <div class="flex gap-2 sm:gap-4">
            <div v-if="selectedDosenData" class="flex gap-2 sm:gap-4">
              <!-- Icon Dosen -->
              <img
                :src="DefaultAvatar"
                alt=""
                class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
              />

              <!-- Informasi Dosen -->
              <div class="self-center">
                <h5 class="body4-bold sm:body2-bold lg:body1-bold text-primary">
                  {{ selectedDosenData.name }}
                </h5>
                <span class="body5 lg:body4"
                  >{{ selectedDosenData.nik }} | D-3 Teknik Informatika</span
                >
              </div>
            </div>
          </div>

          <!-- Tombol Submit -->
          <Button
            class="self-end w-fit"
            type="button"
            variant="primary"
            size="lg"
            @click="openModal"
            :disabled="isSubmitDisabled"
          >
            Kirim
          </Button>
        </form>
      </div>

      <ModalTimer
        ref="timerModalRef"
        @submit="handleSubmit"
        headText="Pastikan Dosen dan Kategori yang Dipilih Benar."
        bodyText="Anda tidak dapat merubah atau menghapus permintaan yang telah terkirim."
        submitText="Kirim"
        :showCancel="false"
        :enableTimer="false"
      />
    </div>

    <!-- STATE 2: MENUNGGU RESPON DOSEN -->
    <div
      v-else-if="!hasPembimbing && waitingResponse"
      class="p-4 bg-white card-rounded lg:p-8 shadow-custom"
    >
      <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
        <h5 class="body4-bold sm:body3-bold text-blackText">
          Permintaan anda kepada dosen untuk menjadi pembimbing telah terkirim.
          Mohon tunggu untuk dosen merespon permintaan anda.
        </h5>

        <!-- Info Dosen & Status Request -->
        <UserData
          headText="Dosen Pembimbing"
          :bodyText="namaDosenRequestPembimbing"
          headText2="Kategori TA"
          :bodyText2="kategoriTA"
          :tahunAjaran="tahunAjaranTA"
          :showStatus="true"
          status="warning"
          statusLabel="Menunggu"
        />
      </div>
    </div>

    <!-- STATE 3: REQUEST DITOLAK DOSEN -->
    <div
      v-else-if="!hasPembimbing && declined"
      class="p-4 bg-white card-rounded lg:p-8 shadow-custom"
    >
      <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
        <h5 class="body3-bold sm:body2-bold lg:body1-bold">
          Mohon maaf dosen menolak permintaan anda, mohon tunggu admin untuk
          menentukan dosen pembimbing untuk anda.
        </h5>

        <UserData
          headText="Dosen Pembimbing"
          :bodyText="namaDosenRequestPembimbing"
          headText2="Kategori TA"
          :bodyText2="kategoriTA"
          :tahunAjaran="tahunAjaranTA"
          :showStatus="true"
          status="danger"
          statusLabel="Ditolak"
        />
      </div>
    </div>

    <!-- STATE 4: PUNYA PEMBIMBING - TAMPILKAN DATA BIMBINGAN -->
    <div v-else-if="hasPembimbing">
      <!-- Header: Info Dosen & Progress BAB -->
      <div class="p-6 bg-white card-rounded lg:p-8 shadow-custom">
        <!-- Info Dosen Pembimbing -->
        <UserData
          class="max-w-screen-xl mx-auto mb-4"
          headText="Dosen Pembimbing"
          :bodyText="namaPembimbing"
          headText2="Kategori"
          :bodyText2="kategoriTA"
          :tahunAjaran="tahunAjaranTA"
        />

        <!-- Progress BAB & Tombol Tambah -->
        <div
          class="flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row md:gap-8"
        >
          <!-- Progress Bar BAB -->
          <ProgressBarBAB class="sm:ms-3" :currentStep="highestBAB" />

          <!-- Tombol Tambah Bimbingan -->
          <div class="flex flex-wrap justify-end w-full gap-2 md:w-fit">
            <router-link
              class="flex-grow"
              to="/mahasiswa/tugas-akhir/bimbingan/tambah-bimbingan"
            >
              <!-- Desktop Button -->
              <Button
                class="hidden w-full lg:flex"
                variant="primary"
                size="lg"
                left-icon-path="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
              >
                Tambah
              </Button>

              <!-- Mobile Button -->
              <Button
                class="w-full lg:hidden"
                variant="primary"
                size="md"
                left-icon-path="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
              >
                Tambah
              </Button>
            </router-link>
            <div v-if="dataNilaiBimbingan" class="flex-grow">
              <Button
                class="hidden w-full lg:flex"
                variant="success"
                size="lg"
                @click="showNilaiModal = true"
              >
                Lihat Nilai
              </Button>

              <!-- Mobile Button -->
              <Button
                class="w-full lg:hidden"
                variant="success"
                size="md"
                @click="showNilaiModal = true"
              >
                Lihat Nilai
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabel Riwayat Bimbingan -->
      <div class="p-4 mt-4 bg-white card-rounded lg:p-8 shadow-custom">
        <Table
          :headers="['Tanggal', 'BAB', 'Catatan', 'Status']"
          :items="numberedBimbingan"
          min-width="min-w-[600px]"
          @rowClick="handleRowClick"
          :pagination="paginationBimbingan"
          @pageChange="
            (page) => {
              currentPage = page;
            }
          "
        >
          <template #row="{ item }">
            <!-- Kolom No -->
            <!-- <td
              class="px-3 py-3 border-r border-white rounded-l-lg sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.rowNumber }}
            </td> -->

            <!-- Kolom Tanggal -->
            <td
              class="px-3 py-3 border-r border-white rounded-l-lg sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.tanggal_bimbingan }}
            </td>

            <!-- Kolom BAB -->
            <td
              class="px-3 py-3 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              BAB {{ toRoman(item.bab) }}
            </td>

            <!-- Kolom Catatan -->
            <td
              class="py-3 px-3 max-w-[250px] truncate sm:max-w-[200px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[450px] lg:whitespace-nowrap sm:py-3 sm:px-6 border-r border-white body5 sm:body4 text-blackText"
            >
              {{ item.catatan }}
            </td>

            <!-- Kolom Status -->
            <td
              class="px-3 py-3 border-r border-white rounded-r-lg sm:py-3 sm:px-6"
            >
              <!-- Desktop Status -->
              <StatusLabel
                class="hidden w-fit lg:block"
                :status="getStatusClass(item.status_verifikasi)"
                size="md"
                :label="getStatusLabel(item.status_verifikasi)"
              />

              <!-- Mobile Status -->
              <StatusLabel
                class="block w-fit lg:hidden"
                :status="getStatusClass(item.status_verifikasi)"
                size="sm"
                :label="getStatusLabel(item.status_verifikasi)"
              />
            </td>
          </template>
        </Table>
      </div>
      <DefaultModal
        v-if="showNilaiModal"
        headText="Nilai Bimbingan"
        :bodyText="`${username} | ${nim}`"
        @close="showNilaiModal = false"
      >
        <div class="flex flex-wrap gap-4">
          <InputText
            id="nilai-disiplin"
            class="sm:min-w-[300px] flex-grow"
            label="Disiplin (20%)"
            :modelValue="dataNilaiBimbingan?.disiplin"
            :disabled="true"
          />
          <InputText
            id="nilai-komunikasi"
            class="sm:min-w-[300px] flex-grow"
            label="Komunikasi (20%)"
            :modelValue="dataNilaiBimbingan?.komunikasi"
            :disabled="true"
          />
          <InputText
            id="nilai-skill-pengetahuan"
            class="sm:min-w-[300px] flex-grow"
            label="Skill / Pengetahuan (45%)"
            :modelValue="dataNilaiBimbingan?.skill_pengetahuan"
            :disabled="true"
          />
          <InputText
            id="nilai-tingkah-laku"
            class="sm:min-w-[300px] flex-grow"
            label="Tingkah Laku (15%)"
            :modelValue="dataNilaiBimbingan?.tingkah_laku"
            :disabled="true"
          />
        </div>
        <InputText
          id="nilai-rerata"
          class="flex-grow mt-4"
          label="Nilai rata-rata"
          :modelValue="dataNilaiBimbingan?.rerata_bimbingan"
          :disabled="true"
        />
      </DefaultModal>
      <ModalDetailBimbingan
        ref="modalDetailRef"
        v-if="showBimbinganModal && selectedBimbingan"
        :bimbinganKe="
          paginationBimbingan?.total - selectedBimbingan.rowNumber + 1
        "
        :tanggalBimbingan="selectedBimbingan.tanggal_bimbingan"
        :bab="selectedBimbingan.bab"
        :catatan="selectedBimbingan.catatan"
        :status="getStatusClass(selectedBimbingan.status_verifikasi)"
        :statusLabel="getStatusLabel(selectedBimbingan.status_verifikasi)"
        @close="closeDetailModal"
      />
    </div>
  </div>
</template>
