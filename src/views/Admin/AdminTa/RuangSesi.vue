<script setup>
import { ref, computed, onMounted, watch } from "vue";
import TabDiv from "@/components/Tugas-akhir/TabDiv.vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
// import ModalDeleteRuangSesi from "@/components/Tugas-akhir/Modals/ModalDeleteRuang&sesi.vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputTime from "@/components/Tugas-akhir/Forms/InputTime.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useToast } from "vue-toastification";
import { useRuang } from "@/services/TugasAkhir/Admin/ruang";
import { useSesi } from "@/services/TugasAkhir/Admin/sesi";

// Toast notifications
const toast = useToast();
const currentPageRuang = ref(1);
const currentPageSesi = ref(1);
// Data tab
const tabs = [
  {
    id: "tab1",
    label: "Ruang",
    icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z",
  },
  {
    id: "tab2",
    label: "Sesi",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
];

// Search
function onSearchRuang({ value }) {
  currentPageRuang.value = 1;
  fetchRuangs(1, value);
}
function onSearchSesi({ value }) {
  currentPageSesi.value = 1;
  fetchSesis(1, value);
}

// === RUANG API ===
const {
  data: ruangsData,
  loading: ruangLoading,
  error: ruangError,
  fetchData: fetchRuangs,
  pagination: paginationRuang,
  addRuang,
  editRuang,
  // deleteRuang,
} = useRuang();

// === SESI API ===
const {
  data: sesisData,
  loading: sesiLoading,
  error: sesiError,
  fetchData: fetchSesis,
  pagination: paginationSesi,
  addSesi,
  editSesi,
  // deleteSesi,
} = useSesi();

// Data transformations
const ruangs = computed(() => ruangsData.value || []);
const sesis = computed(() => sesisData.value || []);

const listRuang = computed(() => {
  return Array.isArray(ruangs.value) ? ruangs.value : [];
});
const listSesi = computed(() => {
  return Array.isArray(sesis.value) ? sesis.value : [];
});

// Modal states
const selectedRuang = ref(null);
const isEditing = ref(false);
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const ruangToDelete = ref(null);

const selectedSesi = ref(null);
const isEditingSesi = ref(false);
const isModalOpenSesi = ref(false);
const isDeleteModalOpenSesi = ref(false);
const sesiToDelete = ref(null);

// Table headers
const tableHeadersRuang = ["Nama Ruang", "Aksi"];
const tableHeadersSesi = ["Nama Sesi", "Waktu", "Aksi"];

// === FUNGSI UNTUK RUANG ===
const openAddModalRuang = () => {
  selectedRuang.value = { nama_ruang: "" };
  isEditing.value = false;
  isModalOpen.value = true;
};

const openEditModalRuang = (ruang) => {
  selectedRuang.value = { ...ruang };
  isEditing.value = true;
  isModalOpen.value = true;
};

const saveRuang = async () => {
  // Validasi
  if (!selectedRuang.value?.nama_ruang?.trim()) {
    toast.error("Nama ruang tidak boleh kosong");
    return;
  }

  selectedRuang.value.nama_ruang = selectedRuang.value.nama_ruang.trim();

  try {
    if (isEditing.value) {
      await editRuang(selectedRuang.value.id, selectedRuang.value);
      toast.success("Ruang berhasil diperbarui");
    } else {
      await addRuang(selectedRuang.value);
      toast.success("Ruang berhasil ditambahkan");
    }

    isModalOpen.value = false;
    await fetchRuangs();
  } catch (err) {
    toast.error("Gagal menyimpan ruang: " + (ruangError.value || err.message));
  }
};

// const confirmDeleteRuang = (ruang) => {
//   ruangToDelete.value = ruang;
//   isDeleteModalOpen.value = true;
// };

// const deleteRuangHandler = async () => {
//   if (ruangToDelete.value) {
//     try {
//       await deleteRuang(ruangToDelete.value.id);
//       toast.success("Ruang berhasil dihapus");
//       await fetchRuangs();

//       ruangToDelete.value = null;
//       isDeleteModalOpen.value = false;
//     } catch (err) {
//       toast.error(
//         "Gagal menghapus ruang: " + (ruangError.value || err.message)
//       );
//     }
//   }
// };

// === FUNGSI UNTUK SESI ===
const openAddModalSesi = () => {
  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, "0");
  const currentMinute = now.getMinutes().toString().padStart(2, "0");
  const nextHour = (now.getHours() + 1).toString().padStart(2, "0");

  selectedSesi.value = {
    nama_sesi: "",
    waktu_mulai: `${currentHour}:${currentMinute}`,
    waktu_selesai: `${nextHour}:${currentMinute}`,
  };
  isEditingSesi.value = false;
  isModalOpenSesi.value = true;
};

const openEditModalSesi = (sesi) => {
  selectedSesi.value = { ...sesi };
  isEditingSesi.value = true;
  isModalOpenSesi.value = true;
};

const saveSesi = async () => {
  // Validasi
  if (!selectedSesi.value?.nama_sesi?.trim()) {
    toast.error("Nama sesi tidak boleh kosong");
    return;
  }

  if (!selectedSesi.value.waktu_mulai) {
    toast.error("Waktu mulai harus diisi");
    return;
  }

  if (!selectedSesi.value.waktu_selesai) {
    toast.error("Waktu selesai harus diisi");
    return;
  }

  if (selectedSesi.value.waktu_mulai >= selectedSesi.value.waktu_selesai) {
    toast.error("Waktu selesai harus setelah waktu mulai");
    return;
  }

  try {
    const payload = {
      nama_sesi: selectedSesi.value.nama_sesi.trim(),
      waktu_mulai: selectedSesi.value.waktu_mulai,
      waktu_selesai: selectedSesi.value.waktu_selesai,
    };

    if (isEditingSesi.value) {
      await editSesi(selectedSesi.value.id, payload);
      toast.success("Sesi berhasil diperbarui");
    } else {
      await addSesi(payload);
      toast.success("Sesi berhasil ditambahkan");
    }

    await fetchSesis();
    isModalOpenSesi.value = false;
  } catch (err) {
    toast.error("Gagal menyimpan sesi: " + (sesiError.value || err.message));
  }
};

// const confirmDeleteSesi = (sesi) => {
//   sesiToDelete.value = sesi;
//   isDeleteModalOpenSesi.value = true;
// };

// const deleteSesiHandler = async () => {
//   if (sesiToDelete.value) {
//     try {
//       await deleteSesi(sesiToDelete.value.id);
//       toast.success("Sesi berhasil dihapus");
//       await fetchSesis();

//       sesiToDelete.value = null;
//       isDeleteModalOpenSesi.value = false;
//     } catch (err) {
//       toast.error("Gagal menghapus sesi: " + (sesiError.value || err.message));
//     }
//   }
// };
const searchQueryRuang = ref("");
const searchQuerySesi = ref("");
// Load data on mount
onMounted(() => {
  fetchRuangs(currentPageRuang.value);
  fetchSesis(currentPageSesi.value);
});
watch(currentPageRuang, (val) => {
  fetchRuangs(val, searchQueryRuang.value);
});
watch(currentPageSesi, (val) => {
  fetchSesis(val, searchQuerySesi.value);
});
</script>

<template>
  <div>
    <Breadcrumb />
    <TabDiv :tabs="tabs" :use-named-slots="true">
      <!-- === TAB 1: RUANG === -->
      <template #tab1>
        <div>
          <div class="flex items-stretch justify-between gap-2 mb-4 sm:gap-4">
            <SearchBar
              class="flex-grow"
              v-model="searchQueryRuang"
              @search="onSearchRuang"
              filterKey="ruang"
            />
            <Button
              variant="primary"
              size="sm"
              @click="openAddModalRuang"
              leftIconPath="M12 4v16m8-8H4"
              class="sm:hidden w-fit"
            >
              <span class="">Tambah</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              @click="openAddModalRuang"
              leftIconPath="M12 4v16m8-8H4"
              class="hidden sm:flex w-fit"
            >
              Tambah
            </Button>
          </div>
          <div v-if="ruangLoading" class="py-8">
            <Loading />
          </div>
          <ErrorMsg v-else-if="ruangError" :message="error" />
          <Table
            v-else
            :headers="tableHeadersRuang"
            :items="listRuang"
            min-width="min-w-full"
            :pagination="paginationRuang"
            @pageChange="
              (page) => {
                currentPageRuang = page;
              }
            "
          >
            <template #row="{ item }">
              <td class="w-4/5 px-3 py-3 sm:px-6 body5 sm:body4 text-blackText">
                {{ item.nama_ruang }}
              </td>
              <td class="w-1/5 px-6 py-3 text-center">
                <div class="flex justify-center gap-2">
                  <!-- <Button
                    variant="danger"
                    size="md"
                    @click.stop="confirmDeleteRuang(item)"
                    leftIconPath="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    class="!inline-flex !p-2 !min-h-0 !min-w-0"
                  >
                  </Button> -->
                  <Button
                    variant="outlined-secondary"
                    size="md"
                    @click.stop="openEditModalRuang(item)"
                    leftIconPath="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    class="!inline-flex !p-1.5 sm:!p-2 !min-h-0 !min-w-0"
                  >
                  </Button>
                </div>
              </td>
            </template>
          </Table>
        </div>

        <!-- Modal Tambah/Edit Ruang -->
        <DefaultModal
          v-if="isModalOpen"
          :headText="isEditing ? 'Edit Ruang' : 'Tambah Ruang'"
          bodyText=""
          @close="isModalOpen = false"
        >
          <div class="mt-4">
            <InputText
              id="room-name"
              label="Nama Ruang"
              placeholder="Masukkan Nama ruang"
              v-model="selectedRuang.nama_ruang"
            />
            <div class="flex justify-end gap-2 mt-4">
              <Button variant="danger" @click="isModalOpen = false">
                Batal
              </Button>
              <Button
                variant="primary"
                @click="saveRuang"
                :disabled="ruangLoading"
              >
                <span v-if="ruangLoading">Memproses...</span>
                <span v-else>{{ isEditing ? "Simpan" : "Tambah" }}</span>
              </Button>
            </div>
          </div>
        </DefaultModal>

        <!-- Modal Konfirmasi Hapus Ruang -->
        <!-- <ModalDeleteRuangSesi
          :show="isDeleteModalOpen"
          title="Konfirmasi Hapus Ruang"
          :description="`Apakah anda yakin akan menghapus ruang '${
            ruangToDelete?.nama_ruang || 'ini'
          }'? Anda tidak dapat mengembalikan ruangan yang telah dihapus.`"
          confirmText="Hapus"
          @close="isDeleteModalOpen = false"
          @confirm="deleteRuangHandler"
        /> -->
      </template>

      <!-- === TAB 2: SESI === -->
      <template #tab2>
        <div>
          <div class="flex justify-between gap-2 mb-4 sm:gap-4 items-strech">
            <SearchBar
              v-model="searchQuerySesi"
              @search="onSearchSesi"
              filterKey="sesi"
            />
            <Button
              variant="primary"
              size="sm"
              @click="openAddModalSesi"
              leftIconPath="M12 4v16m8-8H4"
              class="sm:hidden w-fit"
            >
              Tambah
            </Button>
            <Button
              variant="primary"
              size="md"
              @click="openAddModalSesi"
              leftIconPath="M12 4v16m8-8H4"
              class="hidden sm:flex w-fit"
            >
              Tambah
            </Button>
          </div>
          <div v-if="sesiLoading" class="py-8">
            <Loading />
          </div>
          <ErrorMsg v-else-if="sesiError" :message="error" />
          <Table
            v-else
            :headers="tableHeadersSesi"
            :items="listSesi"
            minWidth="min-w-[400px]"
            :pagination="paginationSesi"
            @pageChange="
              (page) => {
                currentPageSesi = page;
              }
            "
          >
            <template #row="{ item }">
              <td class="w-2/5 px-3 py-3 sm:px-6 body5 sm:body4 text-blackText">
                {{ item.nama_sesi }}
              </td>
              <td class="w-2/5 px-3 py-3 sm:px-6 body5 sm:body4 text-blackText">
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4 mr-1"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  {{ item.waktu_mulai }} - {{ item.waktu_selesai }}
                </div>
              </td>
              <td class="w-1/5 px-6 py-3 text-center">
                <div class="flex justify-center gap-2">
                  <!-- <Button
                    variant="danger"
                    size="md"
                    @click.stop="confirmDeleteSesi(item)"
                    leftIconPath="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    class="!inline-flex !p-2 !min-h-0 !min-w-0"
                  >
                  </Button> -->
                  <Button
                    variant="outlined-secondary"
                    size="md"
                    @click.stop="openEditModalSesi(item)"
                    leftIconPath="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    class="!p-1.5 sm:!p-2 !min-h-0 !min-w-0"
                  >
                  </Button>
                </div>
              </td>
            </template>
          </Table>
        </div>

        <!-- Modal Tambah/Edit Sesi -->
        <DefaultModal
          v-if="isModalOpenSesi"
          :headText="isEditingSesi ? 'Edit Sesi' : 'Tambah Sesi'"
          bodyText=""
          @close="isModalOpenSesi = false"
        >
          <div class="mt-4">
            <InputText
              id="nama_sesi"
              label="Nama Sesi"
              placeholder="Masukkan nama sesi"
              v-model="selectedSesi.nama_sesi"
            />
            <InputTime
              id="waktu_mulai"
              label="Waktu Mulai"
              :value="selectedSesi.waktu_mulai"
              @update:value="(val) => (selectedSesi.waktu_mulai = val)"
            />

            <InputTime
              id="waktu_selesai"
              label="Waktu Selesai"
              :value="selectedSesi.waktu_selesai"
              @update:value="(val) => (selectedSesi.waktu_selesai = val)"
            />

            <div class="flex justify-end gap-2 mt-4">
              <Button
                variant="danger"
                @click="isModalOpenSesi = false"
                :disabled="sesiLoading"
              >
                Batal
              </Button>
              <Button
                variant="primary"
                @click="saveSesi"
                :disabled="sesiLoading"
              >
                {{ isEditingSesi ? "Simpan" : "Tambah" }}
              </Button>
            </div>
          </div>
        </DefaultModal>

        <!-- Modal Konfirmasi Hapus Sesi -->
        <!-- <ModalDeleteRuangSesi
          :show="isDeleteModalOpenSesi"
          title="Konfirmasi Hapus Sesi"
          :description="`Apakah anda yakin akan menghapus sesi '${
            sesiToDelete?.nama_sesi || 'ini'
          }'? Anda tidak dapat mengembalikan sesi yang telah dihapus.`"
          confirmText="Hapus"
          @close="isDeleteModalOpenSesi = false"
          @confirm="deleteSesiHandler"
        />-->
      </template>
    </TabDiv>
  </div>
</template>

<style scoped>
:deep(table th:last-child),
:deep(table td:last-child) {
  text-align: center !important;
}

:deep(table th:nth-child(3)) {
  text-align: center !important;
}

:deep(table td:last-child > div) {
  justify-content: center !important;
}
</style>
