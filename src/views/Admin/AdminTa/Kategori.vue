<script setup>
import { ref, computed, onMounted } from "vue";
import ModalDelete from "@/components/Tugas-akhir/Modals/ModalDeleteRuang&sesi.vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useKategori } from "@/services/TugasAkhir/Admin/kategori.js";
import { useToast } from "vue-toastification";
const toast = useToast();
// Ambil data kategori dari service

const { data, loading, error, fetchData, addKategori, editKategori } =
  useKategori();

// Search
const searchQuery = ref("");
const handleSearch = () => {};
// Data kategori
const categories = computed(() =>
  (data.value || []).map((item) => ({
    id: item.id,
    name: item.nama_kategori,
  }))
);

// Filter pencarian kategori
const filteredCategories = computed(() =>
  categories.value.filter(
    (category) =>
      typeof category.name === "string" &&
      category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// Modal & aksi kategori
const selectedCategory = ref(null);
const isEditing = ref(false);
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const categoryToDelete = ref(null);

// Fungsi untuk kategori
const openAddModalKategori = () => {
  selectedCategory.value = { name: "" };
  isEditing.value = false;
  isModalOpen.value = true;
};

const openEditModalKategori = (category) => {
  selectedCategory.value = { ...category };
  isEditing.value = true;
  isModalOpen.value = true;
};

const saveKategori = async () => {
  // Validasi input tidak boleh kosong
  if (!selectedCategory.value.name || !selectedCategory.value.name.trim()) {
    toast.error("Nama kategori tidak boleh kosong!");
    return;
  }

  if (isEditing.value) {
    try {
      const result = await editKategori(selectedCategory.value.id, {
        nama_kategori: selectedCategory.value.name,
      });
      const idx = (data.value || []).findIndex(
        (c) => c.id === selectedCategory.value.id
      );
      if (idx !== -1) {
        data.value[idx].nama_kategori = result.data.nama_kategori;
      }
      isModalOpen.value = false;
      toast.success("Kategori berhasil diubah!");
    } catch (e) {
      toast.error("Gagal mengubah kategori: " + (error.value || e.message));
    }
  } else {
    try {
      const result = await addKategori({
        nama_kategori: selectedCategory.value.name,
      });
      if (data.value) {
        data.value.push({
          id: result.data.id,
          nama_kategori: result.data.nama_kategori,
        });
      } else {
        data.value = [
          {
            id: result.data.id,
            nama_kategori: result.data.nama_kategori,
          },
        ];
      }
      isModalOpen.value = false;
      toast.success("Kategori berhasil ditambahkan!");
    } catch (e) {
      toast.error("Gagal menambahkan kategori: " + (error.value || e.message));
    }
  }
};
const deleteKategori = () => {
  if (categoryToDelete.value) {
    categories.value = categories.value.filter(
      (category) => category.id !== categoryToDelete.value.id
    );
    categoryToDelete.value = null;
  }
  isDeleteModalOpen.value = false;
};

const confirmDeleteKategori = (category) => {
  categoryToDelete.value = category;
  isDeleteModalOpen.value = true;
};

// Table headers
const tableHeaders = ["Kategori"];
</script>

<template>
  <Breadcrumb :items="breadcrumbItems" />

  <div class="p-4 bg-white shadow-custom card-rounded lg:p-8">
    <div class="flex justify-between mb-4 space-x-4">
      <SearchBar
        v-model="searchQuery"
        @search="handleSearch"
        filterKey="kategori"
        class=""
      />

      <Button
        variant="primary"
        size="sm"
        @click="openAddModalKategori"
        leftIconPath="M12 4v16m8-8H4"
        class=""
      >
        Kategori
      </Button>
    </div>
    <div v-if="loading" class="py-8">
      <Loading />
    </div>
    <ErrorMsg v-else-if="error" :message="error" />
    <Table
      v-else
      :headers="tableHeaders"
      :items="filteredCategories"
      min-width="min-w-full"
      class="table-custom"
    >
      <template #header> </template>
      <template #row="{ item }">
        <td class="flex justify-between px-6 py-3">
          <span>
            {{ item.name }}
          </span>
          <Button
            variant="transparent"
            size="md"
            @click.stop="openEditModalKategori(item)"
            leftIconPath="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            class="!inline-flex !p-2 !min-h-0 !min-w-0 fill-secondary"
          >
          </Button>
        </td>
      </template>
    </Table>
    <!-- Modal Tambah/Edit Kategori with DefaultModal -->
    <DefaultModal
      v-if="isModalOpen"
      :headText="isEditing ? 'Edit Kategori' : 'Tambah Kategori'"
      bodyText=""
      @close="isModalOpen = false"
    >
      <div class="mt-4">
        <InputText
          id="category-name"
          label="Nama Kategori"
          placeholder="Masukkan Nama Kategori"
          v-model="selectedCategory.name"
        />
        <div class="flex justify-end gap-2 mt-4">
          <Button variant="danger" @click="isModalOpen = false"> Batal </Button>
          <Button variant="primary" @click="saveKategori">
            {{ isEditing ? "Simpan" : "Tambah" }}
          </Button>
        </div>
      </div>
    </DefaultModal>
  </div>
</template>

<style scoped>
/* Styling untuk header kolom terakhir (Aksi) */
:deep(.table-custom th:last-child) {
  text-align: center !important;
}
</style>
