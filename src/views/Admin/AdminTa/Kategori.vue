<script setup>
import { ref, computed,onMounted } from "vue";
import ModalDelete from "@/components/Tugas-akhir/Modals/ModalDeleteRuang&sesi.vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import { useKategori } from "@/services/TugasAkhir/Admin/kategori.js";
import { useToast } from "vue-toastification";
const toast = useToast();
// Ambil data kategori dari service

const { data, loading, error, fetchData,addKategori,editKategori } = useKategori();

// Search
const searchQuery = ref("");
const handleSearch = () => {};
// Data kategori
const categories = ref([]);
onMounted(async () => {
  await fetchData();
  // Mapping: dari { id, nama_kategori } menjadi { id, name }
  categories.value = (data.value || []).map(item => ({
    id: item.id,
    name: item.nama_kategori
  }));
  console.log("Kategori data:", categories.value);
});


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
  if (isEditing.value) {
    try {
      const result = await editKategori(selectedCategory.value.id, {
        nama_kategori: selectedCategory.value.name,
      });
      // Update data di list
      const idx = categories.value.findIndex(c => c.id === selectedCategory.value.id);
      if (idx !== -1) {
        categories.value[idx].name = result.data.nama_kategori;
      }
      isModalOpen.value = false;
      toast.success("Kategori berhasil diubah!");
    } catch (e) {
      toast.error("Gagal mengubah kategori: " + (error.value || e.message));
    }
  } else {
    try {
      const result = await addKategori({ nama_kategori: selectedCategory.value.name });
      categories.value.push({
        id: result.data.id,
        name: result.data.nama_kategori,
      });
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
const tableHeaders = ["Nama Kategori", "Aksi"];
</script>

<template>
  <Breadcrumb :items="breadcrumbItems" />

  <div class="bg-white rounded-lg shadow-md p-8">
  <div class="flex justify-between items-center mb-4 space-x-4">
    <div class="w-4/5">  
      <SearchBar
        v-model="searchQuery"
        @search="handleSearch"
        filterKey="kategori"
      />
    </div>
    
    <div class="w-1/5"> 
      <Button
        variant="primary"
        size="lg"
        @click="openAddModalKategori"
        leftIconPath="M12 4v16m8-8H4"
        class="w-full" 
      >
        Tambah Kategori
      </Button>
    </div>
  </div>

    <Table
    :headers="tableHeaders"
    :items="filteredCategories"
    min-width="min-w-full"
    class="table-custom"
  >
    <template #header>
      <tr>
        <th class="py-3 px-6 text-center w-4/5">Nama Kategori</th>
        <th class="py-3 px-6 text-center w-1/5 whitespace-nowrap">Aksi</th>
      </tr>
    </template>
    <template #row="{ item }">
      <td class="py-3 px-6 w-4/5">{{ item.name }}</td>
      <td class="py-3 px-6 text-center w-1/5">
        <div class="flex gap-2 justify-center">
          <Button
            variant="danger"
            size="md"
            @click.stop="confirmDeleteKategori(item)"
            leftIconPath="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            class="!inline-flex !p-2 !min-h-0 !min-w-0"
          >
          </Button>
          <Button
            variant="primary"
            size="md"
            @click.stop="openEditModalKategori(item)"
            leftIconPath="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            class="!inline-flex !p-2 !min-h-0 !min-w-0"
          >
          </Button>
        </div>
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
          :value="selectedCategory.name"
          @update:value="(value) => (selectedCategory.name = value)"
        />
        <div class="flex justify-end mt-4 gap-2">
          <Button variant="danger" @click="isModalOpen = false"> Batal </Button>
          <Button variant="primary" @click="saveKategori">
            {{ isEditing ? "Simpan" : "Tambah" }}
          </Button>
        </div>
      </div>
    </DefaultModal>

    <!-- Modal Konfirmasi Hapus Kategori -->
    <ModalDelete
      :show="isDeleteModalOpen"
      title="Konfirmasi Hapus Kategori"
      :description="`Apakah anda yakin akan menghapus kategori '${
        categoryToDelete?.name || 'ini'
      }'? Anda tidak dapat mengembalikan kategori yang telah dihapus.`"
      confirmText="Hapus"
      @close="isDeleteModalOpen = false"
      @confirm="deleteKategori"
    />
  </div>
</template>

<style scoped>
/* Styling untuk header kolom terakhir (Aksi) */
:deep(.table-custom th:last-child) {
  text-align: center !important;
}
</style>
