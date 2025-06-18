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
import ModalSetAktifTahunAjaran from "@/components/Tugas-akhir/Modals/ModalSetAktifTahunAjaran.vue";
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
const { defaultSemester, loadingSemester, errorSemester } = useSemester();

const toast = useToast();
const searchQuery = ref("");
const currentPage = ref(1);

function handleSearch({ value }) {
  currentPage.value = 1;
  fetchData(1, value);
}

// Ambil list tahun ajaran dari response API yang benar
const tahunAjaranList = computed(() => {
  // dataTahunAjaran.value.data karena response API: { data: { data: [...], pagination: {...} } }
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
      // toast.success("Tahun ajaran berhasil diubah!");
    } else {
      await submitTahunAjaran({
        tahun_ajaran: selectedTahunAjaran.value.tahun_ajaran,
      });
      // toast.success("Tahun ajaran berhasil ditambahkan!");
    }
    isModalOpen.value = false;
    fetchData(currentPage.value, searchQuery.value);
  } catch (e) {
    toast.error("Gagal menyimpan tahun ajaran.");
  }
};

const tableHeaders = ["Tahun Ajaran", "Aksi"];

onMounted(() => {
  fetchData(currentPage.value, searchQuery.value);
});
watch(currentPage, (val) => {
  fetchData(val, searchQuery.value);
});

function openModalSetAktifTahunAjaran() {
  showModalSetAktif.value = true;
}
function handleSetAktifTahunAjaran({ tahunAjaran, semester }) {
  // proses simpan data di sini
}
</script>

<template>
  <Breadcrumb />

  <div class="p-4 bg-white shadow-custom card-rounded lg:p-6">
    <div class="flex justify-between mb-2">
      <div class="flex gap-x-2">
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
          class="hidden sm:flex"
        >
          Tahun Ajaran
        </Button>
        <Button
          variant="secondary"
          size="md"
          @click="openModalSetAktifTahunAjaran"
          class="hidden sm:flex"
        >
          Set Tahun Ajaran
        </Button>
      </div>
      <div class="flex gap-2">
        <Label v-if="defaultTahunAjaran" :label="defaultTahunAjaran" />
        <Label v-if="defaultSemester" :label="defaultSemester" />
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
            <span v-if="item.is_default" class="ml-2 font-bold text-green-600"
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
    <ModalSetAktifTahunAjaran
      v-if="showModalSetAktif"
      :tahunAjaranList="tahunAjaranList.map((t) => t.tahun_ajaran)"
      @close="showModalSetAktif = false"
      @submit="handleSetAktifTahunAjaran"
    />
  </div>
</template>

<style scoped>
:deep(.table-custom th:last-child) {
  text-align: center !important;
}
</style>
