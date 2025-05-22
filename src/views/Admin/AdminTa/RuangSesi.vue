<script setup>
import { ref, computed } from 'vue';
import TabDiv from '@/components/Tugas-akhir/TabDiv.vue';
import Modal from '@/components/Tugas-akhir/Modals/ModalRuang&sesi.vue'; 
import SearchBar from '@/components/Tugas-akhir/Forms/SearchBar.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import ModalDeleteRuangSesi from '@/components/Tugas-akhir/Modals/ModalDeleteRuang&sesi.vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';

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
const searchQuery = ref("");
const handleSearch = () => {};

// Data ruang
const ruangs = ref([
  { id: 1, name: "Lab. Mixed Reality" },
  { id: 2, name: "Lab. Pemrograman" },
  { id: 3, name: "Lab. Jaringan" },
  { id: 4, name: "Lab. Rekayasa Perangkat Lunak" },
  { id: 5, name: "Teaching Factory" },
]);

// Data sesi - menambahkan properti waktu_mulai dan waktu_selesai
const sesis = ref([
  { id: 1, name: "Sesi Pagi", waktu_mulai: "08:00", waktu_selesai: "10:00" },
  { id: 2, name: "Sesi Siang", waktu_mulai: "10:30", waktu_selesai: "12:30" },
  { id: 3, name: "Sesi Sore", waktu_mulai: "13:00", waktu_selesai: "15:00" },
  { id: 4, name: "Sesi Malam", waktu_mulai: "15:30", waktu_selesai: "17:30" },
]);

// Filter pencarian ruang
const filteredRuangs = computed(() =>
  ruangs.value.filter((ruang) =>
    ruang.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// Filter pencarian sesi
const filteredSesis = computed(() =>
  sesis.value.filter((sesi) =>
    sesi.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// Modal & aksi ruang
const selectedRuang = ref(null);
const isEditing = ref(false);
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const ruangToDelete = ref(null);

// Modal & aksi sesi
const selectedSesi = ref(null);
const isEditingSesi = ref(false);
const isModalOpenSesi = ref(false);
const isDeleteModalOpenSesi = ref(false);
const sesiToDelete = ref(null);

// Fungsi untuk ruang
const openAddModalRuang = () => {
  selectedRuang.value = { name: "" };
  isEditing.value = false;
  isModalOpen.value = true;
};

const openEditModalRuang = (ruang) => {
  selectedRuang.value = { ...ruang };
  isEditing.value = true;
  isModalOpen.value = true;
};

const saveRuang = () => {
  if (isEditing.value) {
    const index = ruangs.value.findIndex(
      (r) => r.id === selectedRuang.value.id
    );
    ruangs.value[index] = { ...selectedRuang.value };
  } else {
    ruangs.value.push({
      ...selectedRuang.value,
      id: Date.now(),
    });
  }
  isModalOpen.value = false;
};

const deleteRuang = () => {
  if (ruangToDelete.value) {
    ruangs.value = ruangs.value.filter(
      (ruang) => ruang.id !== ruangToDelete.value.id
    );
    ruangToDelete.value = null;
  }
  isDeleteModalOpen.value = false;
};

const confirmDeleteRuang = (ruang) => {
  ruangToDelete.value = ruang;
  isDeleteModalOpen.value = true; // Tampilkan modal dengan mengubah state
};

// Fungsi untuk sesi - dimodifikasi untuk menangani 3 input
const openAddModalSesi = () => {
  selectedSesi.value = { name: "", waktu_mulai: "", waktu_selesai: "" };
  isEditingSesi.value = false;
  isModalOpenSesi.value = true;
};

const openEditModalSesi = (sesi) => {
  selectedSesi.value = { ...sesi };
  isEditingSesi.value = true;
  isModalOpenSesi.value = true;
};

const saveSesi = () => {
  if (isEditingSesi.value) {
    const index = sesis.value.findIndex((s) => s.id === selectedSesi.value.id);
    sesis.value[index] = { ...selectedSesi.value };
  } else {
    sesis.value.push({
      ...selectedSesi.value,
      id: Date.now(),
    });
  }
  isModalOpenSesi.value = false;
};

const deleteSesi = () => {
  if (sesiToDelete.value) {
    sesis.value = sesis.value.filter(
      (sesi) => sesi.id !== sesiToDelete.value.id
    );
    sesiToDelete.value = null;
  }
  isDeleteModalOpenSesi.value = false;
};

const confirmDeleteSesi = (sesi) => {
  sesiToDelete.value = sesi;
  isDeleteModalOpenSesi.value = true; // Tampilkan modal dengan mengubah state
};
</script>

<template>
  <Breadcrumb />
  <TabDiv :tabs="tabs" :use-named-slots="true">
    <!-- === TAB 1: RUANG === -->
    <template #tab1>
      <div class="flex justify-between items-center mb-4">
        <div class="w-5/6">
          <SearchBar
            v-model="searchQuery"
            @search="handleSearch"
            filterKey="ruang"
          />
        </div>
        <!-- Tombol tambah ruang -->
        <Button
          variant="primary"
          @click="openAddModalRuang"
          leftIconPath="M12 4v16m8-8H4"
        >
          Tambah Ruang
        </Button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="ruang in filteredRuangs"
          :key="ruang.id"
          class="p-4 border rounded shadow bg-white"
        >
          <p class="font-semibold">{{ ruang.name }}</p>
          <div class="mt-2 flex gap-2">
            <Button
              variant="danger"
              @click="confirmDeleteRuang(ruang)"
              leftIconPath="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            >
              Hapus
            </Button>
            <Button
              variant="primary"
              @click="openEditModalRuang(ruang)"
              leftIconPath="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            >
              Edit
            </Button>
          </div>
        </div>
      </div>

      <!-- Modal Tambah/Edit Ruang -->
      <Modal
        :show="isModalOpen"
        :title="isEditing ? 'Edit Ruang' : 'Tambah Ruang'"
        @close="isModalOpen = false"
        @submit="saveRuang"
      >
        <input
          v-model="selectedRuang.name"
          type="text"
          class="w-full p-2 border rounded"
          placeholder="Masukkan Nama ruang"
        />
      </Modal>

      <!-- Modal Konfirmasi Hapus Ruang -->
      <ModalDeleteRuangSesi
        :show="isDeleteModalOpen"
        title="Konfirmasi Hapus Ruang"
        :description="`Apakah anda yakin akan menghapus ruang '${
          ruangToDelete?.name || 'ini'
        }'? Anda tidak dapat mengembalikan ruangan yang telah dihapus.`"
        confirmText="Hapus"
        @close="isDeleteModalOpen = false"
        @confirm="deleteRuang"
      />
    </template>

    <!-- === TAB 2: SESI === -->
    <template #tab2>
      <div class="flex justify-between items-center mb-4">
        <div class="w-5/6">
          <SearchBar
            v-model="searchQuery"
            @search="handleSearch"
            filterKey="sesi"
          />
        </div>
        <!-- Tombol tambah sesi -->
        <Button
          variant="primary"
          @click="openAddModalSesi"
          leftIconPath="M12 4v16m8-8H4"
        >
          Tambah Sesi
        </Button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="sesi in filteredSesis"
          :key="sesi.id"
          class="p-4 border rounded shadow bg-white"
        >
          <p class="font-semibold">{{ sesi.name }}</p>
          <!-- Menampilkan waktu mulai dan waktu selesai -->
          <p class="text-sm text-gray-600 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="inline-block w-4 h-4 mr-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            {{ sesi.waktu_mulai }} - {{ sesi.waktu_selesai }}
          </p>
          <div class="mt-2 flex gap-2">
            <Button
              variant="danger"
              @click="confirmDeleteSesi(sesi)"
              leftIconPath="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            >
              Hapus
            </Button>
            <Button
              variant="primary"
              @click="openEditModalSesi(sesi)"
              leftIconPath="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            >
              Edit
            </Button>
          </div>
        </div>
      </div>

      <!-- Modal Tambah/Edit Sesi dengan 3 input field -->
      <Modal
        :show="isModalOpenSesi"
        :title="isEditingSesi ? 'Edit Sesi' : 'Tambah Sesi'"
        @close="isModalOpenSesi = false"
        @submit="saveSesi"
      >
        <div class="space-y-4">
          <!-- Input Nama Sesi -->
          <div>
            <label
              for="nama_sesi"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Sesi
            </label>
            <input
              id="nama_sesi"
              v-model="selectedSesi.name"
              type="text"
              class="w-full p-2 border rounded"
              placeholder="Masukkan nama sesi"
            />
          </div>

          <!-- Input Waktu Mulai -->
          <div>
            <label
              for="waktu_mulai"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Waktu Mulai
            </label>
            <input
              id="waktu_mulai"
              v-model="selectedSesi.waktu_mulai"
              type="time"
              class="w-full p-2 border rounded"
              placeholder="08:00"
            />
          </div>

          <!-- Input Waktu Selesai -->
          <div>
            <label
              for="waktu_selesai"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Waktu Selesai
            </label>
            <input
              id="waktu_selesai"
              v-model="selectedSesi.waktu_selesai"
              type="time"
              class="w-full p-2 border rounded"
              placeholder="10:00"
            />
          </div>
        </div>
      </Modal>

      <!-- Modal Konfirmasi Hapus Sesi -->
      <ModalDeleteRuangSesi
        :show="isDeleteModalOpenSesi"
        title="Konfirmasi Hapus Sesi"
        :description="`Apakah anda yakin akan menghapus sesi '${
          sesiToDelete?.name || 'ini'
        }'? Anda tidak dapat mengembalikan sesi yang telah dihapus.`"
        confirmText="Hapus"
        @close="isDeleteModalOpenSesi = false"
        @confirm="deleteSesi"
      />
    </template>
  </TabDiv>
</template>
