<script setup>
import { ref, computed, onMounted, watch } from "vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useToast } from "vue-toastification";
import Label from "@/components/Tugas-akhir/Label.vue";
import InputDropdown from "@/components/Tugas-akhir/Forms/InputDropdown.vue";
import {
  useTahunAjaran,
  useSemester,
} from "@/services/TugasAkhir/Admin/tahunAjaran.js";

// Import untuk ambil tahun ajaran
const {
  dataTahunAjaran,
  loadingTahunAjaran,
  errorTahunAjaran,
  paginationTahunAjaran,
  defaultTahunAjaran,
  submitTahunAjaran,
  updateTahunAjaran,
  updateDefaultTahunAjaran,
  fetchData,
} = useTahunAjaran();

// Import untuk ambil semester
const {
  dataSemester,
  defaultSemester,
  loadingSemester,
  errorSemester,
  updateDefaultSemester,
} = useSemester();

const toast = useToast();
const searchQuery = ref("");
const currentPage = ref(1);

function handleSearch({ value }) {
  currentPage.value = 1;
  fetchData(1, value);
}

// Ambil list tahun ajaran dari response API yang benar
const tahunAjaranList = computed(() => {
  return Array.isArray(dataTahunAjaran.value?.data)
    ? dataTahunAjaran.value.data
    : [];
});

const pagination = computed(() => {
  return dataTahunAjaran.value?.pagination || {};
});

// Modal & aksi tahun ajaran
const selectedTahunAjaran = ref(null);
const isEditing = ref(false);
const isModalOpen = ref(false);
const showModalSetAktif = ref(false);

// State untuk modal set aktif (sebelumnya ada di ModalSetAktifTahunAjaran)
const selectedTahunAjaranAktif = ref(null);
const selectedSemesterAktif = ref(null);

const openAddModalTahunAjaran = () => {
  selectedTahunAjaran.value = { tahun_ajaran: "" };
  isEditing.value = false;
  isModalOpen.value = true;
};

const openEditModalTahunAjaran = (item) => {
  selectedTahunAjaran.value = { ...item };
  isEditing.value = true;
  isModalOpen.value = true;
};

const saveTahunAjaran = async () => {
  if (
    !selectedTahunAjaran.value.tahun_ajaran ||
    !selectedTahunAjaran.value.tahun_ajaran.trim()
  ) {
    toast.error("Tahun ajaran tidak boleh kosong!");
    return;
  }
  try {
    if (isEditing.value) {
      await updateTahunAjaran(selectedTahunAjaran.value.id, {
        tahun_ajaran: selectedTahunAjaran.value.tahun_ajaran,
      });
    } else {
      await submitTahunAjaran({
        tahun_ajaran: selectedTahunAjaran.value.tahun_ajaran,
      });
    }
    isModalOpen.value = false;
    fetchData(currentPage.value, searchQuery.value);
  } catch (e) {
    toast.error("Gagal menyimpan tahun ajaran.");
  }
};

const tableHeaders = ["Tahun Ajaran", "Aksi"];

// Format tahun ajaran untuk InputDropdown
const formattedTahunAjaranOptions = computed(() => {
  return tahunAjaranList.value.map((tahun) => ({
    value: tahun.tahun_ajaran,
    label: tahun.tahun_ajaran,
  }));
});

// Fungsi untuk membuka modal set aktif
function openModalSetAktifTahunAjaran() {
  // Set nilai default berdasarkan data yang sudah ada
  const defaultTA = tahunAjaranList.value.find((t) => t.is_default === 1);
  selectedTahunAjaranAktif.value = defaultTA
    ? defaultTA.tahun_ajaran
    : tahunAjaranList.value.length > 0
    ? tahunAjaranList.value[0].tahun_ajaran
    : null;

  const defaultSem = dataSemester.value.find((s) => s.is_default === 1);
  selectedSemesterAktif.value = defaultSem
    ? defaultSem.id
    : dataSemester.value.length > 0
    ? dataSemester.value[0].id
    : null;

  showModalSetAktif.value = true;
}

// Fungsi untuk menyimpan pengaturan aktif
async function saveAktifSettings() {
  try {
    // Temukan ID tahun ajaran dari nama
    const tahunAjaranObj = tahunAjaranList.value.find(
      (t) => t.tahun_ajaran === selectedTahunAjaranAktif.value
    );

    if (tahunAjaranObj) {
      await updateDefaultTahunAjaran(tahunAjaranObj.id);
    }

    if (selectedSemesterAktif.value) {
      await updateDefaultSemester(selectedSemesterAktif.value);
    }

    toast.success("Tahun ajaran dan semester default berhasil diubah.");
    showModalSetAktif.value = false;
    fetchData(currentPage.value, searchQuery.value);
  } catch (e) {
    toast.error("Gagal mengubah tahun ajaran/semester default.");
  }
}

onMounted(() => {
  fetchData(currentPage.value, searchQuery.value);
});

watch(currentPage, (val) => {
  fetchData(val, searchQuery.value);
});
</script>

<template>
  <Breadcrumb />

  <div class="p-4 bg-white shadow-custom card-rounded lg:p-6">
    <div
      class="flex flex-wrap justify-between gap-2 mb-2 sm:mb-4 sm:flex-nowrap"
    >
      <div class="flex flex-grow gap-x-2">
        <SearchBar
          v-model="searchQuery"
          @search="handleSearch"
          filterKey="tahun_ajaran"
        />
        <Button
          variant="primary"
          size="md"
          @click="openAddModalTahunAjaran"
          leftIconPath="M12 4v16m8-8H4"
          class="hidden md:flex"
        >
          Tambah
        </Button>
        <Button
          variant="primary"
          size="sm"
          @click="openAddModalTahunAjaran"
          leftIconPath="M12 4v16m8-8H4"
          class="md:hidden"
        >
          Tambah
        </Button>
        <Button
          variant="secondary"
          size="md"
          @click="openModalSetAktifTahunAjaran"
          class="hidden md:flex"
        >
          Default
        </Button>
        <Button
          variant="secondary"
          size="sm"
          @click="openModalSetAktifTahunAjaran"
          class="md:hidden"
        >
          Default
        </Button>
      </div>
      <div class="flex items-center w-full sm:w-fit gap-x-2">
        <Label
          v-if="defaultTahunAjaran"
          :label="defaultTahunAjaran"
          class="w-full sm:hidden"
          size="sm"
          status="primary"
        />
        <Label
          v-if="defaultSemester"
          :label="defaultSemester"
          class="w-full sm:hidden"
          size="sm"
          status="primary"
        />
        <Label
          v-if="defaultTahunAjaran"
          :label="defaultTahunAjaran"
          class="hidden sm:flex"
          size="lg"
          status="primary"
        />
        <Label
          v-if="defaultSemester"
          :label="defaultSemester"
          class="hidden sm:flex"
          size="lg"
          status="primary"
        />
      </div>
    </div>
    <div v-if="loadingTahunAjaran" class="py-8">
      <Loading />
    </div>
    <ErrorMsg v-else-if="errorTahunAjaran" :message="errorTahunAjaran" />
    <Table
      v-else
      :headers="tableHeaders"
      :items="tahunAjaranList"
      min-width="min-w-full"
      class="table-custom"
      :pagination="pagination"
      @pageChange="
        (page) => {
          currentPage.value = page;
        }
      "
    >
      <template #row="{ item }">
        <td
          class="w-4/5 px-3 py-2 sm:py-3 sm:px-6 text-blackText body5 sm:body4"
        >
          <span>
            {{ item.tahun_ajaran }}
            <span v-if="item.is_default" class="ml-2 font-bold text-primary"
              >(Default)</span
            >
          </span>
        </td>
        <td class="flex justify-center px-3 py-2 my-auto sm:py-3 sm:px-6">
          <Button
            variant="outlined-secondary"
            size="md"
            @click.stop="openEditModalTahunAjaran(item)"
            leftIconPath="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            class="!inline-flex !p-1 sm:!p-2 !min-h-0 !min-w-0"
          >
          </Button>
        </td>
      </template>
    </Table>

    <!-- Modal Tambah/Edit Tahun Ajaran -->
    <DefaultModal
      v-if="isModalOpen"
      :headText="isEditing ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'"
      bodyText=""
      @close="isModalOpen = false"
    >
      <div class="mt-4">
        <InputText
          id="tahun_ajaran-name"
          label="Nama Tahun Ajaran"
          placeholder="Masukkan Tahun Ajaran"
          v-model="selectedTahunAjaran.tahun_ajaran"
        />
        <div class="flex justify-end gap-2 mt-4">
          <Button variant="danger" @click="isModalOpen = false"> Batal </Button>
          <Button variant="primary" @click="saveTahunAjaran">
            {{ isEditing ? "Simpan" : "Tambah" }}
          </Button>
        </div>
      </div>
    </DefaultModal>
    <!-- Modal Set Aktif Tahun Ajaran dan Semester -->
    <DefaultModal
      v-if="showModalSetAktif"
      :headText="'Set Tahun Ajaran dan Semester Aktif'"
      bodyText=""
      @close="showModalSetAktif = false"
    >
      <div class="mt-4 space-y-4">
        <div>
          <InputDropdown
            id="tahun-ajaran-dropdown"
            label="Tahun Ajaran"
            placeholder="Pilih Tahun Ajaran"
            v-model="selectedTahunAjaranAktif"
            :options="formattedTahunAjaranOptions"
            required
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold">Semester</label>
          <div class="flex gap-4">
            <!-- Radio button standard -->
            <div
              v-for="semester in dataSemester"
              :key="semester.id"
              class="flex items-center"
            >
              <input
                type="radio"
                :id="`semester-${semester.id}`"
                :value="semester.id"
                v-model="selectedSemesterAktif"
                class="mr-2"
              />
              <label :for="`semester-${semester.id}`">
                {{ semester.nama_semester === "A" ? "Ganjil" : "Genap" }}
              </label>
            </div>
            <p
              v-if="!dataSemester || dataSemester.length === 0"
              class="text-sm text-gray-500"
            >
              Tidak ada data semester
            </p>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button variant="primary" @click="saveAktifSettings">Simpan</Button>
        </div>
      </div>
    </DefaultModal>
  </div>
</template>

<style scoped>
:deep(.table-custom th:last-child) {
  text-align: center !important;
}
</style>
