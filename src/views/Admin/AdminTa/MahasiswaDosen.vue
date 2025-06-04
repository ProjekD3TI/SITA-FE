<script setup>
import { ref, computed } from "vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import ModalFilter from "@/components/Tugas-akhir/Modals/ModalFilter.vue";
import StatusLabel from "@/components/Tugas-akhir/Label.vue";
import TabDiv from "@/components/Tugas-akhir/TabDiv.vue";
import ModalSelected from "@/components/Tugas-akhir/Modals/ModalSelected.vue"; // Tambahkan ini

// Data tab
const tabs = [
  {
    id: "tab1",
    label: "Mahasiswa",
    icon: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    id: "tab2",
    label: "Dosen",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
];

// Search for Mahasiswa
const searchQueryMahasiswa = ref("");
const handleSearchMahasiswa = () => { };

// Search for Dosen
const searchQueryDosen = ref("");
const handleSearchDosen = () => { };

// Data mahasiswa
const students = ref([
  {
    id: 1,
    name: "Budi Santoso",
    nim: "V3423000",
    angkatan: "2023",
    email: "budi.santoso@student.uns.ac.id",
    status: "success", // Untuk "Aktif"
  },
  {
    id: 2,
    name: "Siti Rahma",
    nim: "V3423000",
    angkatan: "2023",
    email: "siti.rahma@student.uns.ac.id",
    status: "success",
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    nim: "V3423000",
    angkatan: "2023",
    email: "ahmad.fauzi@student.uns.ac.id",
    status: "success",
  },
  {
    id: 4,
    name: "Maya Indah",
    nim: "V3423000",
    angkatan: "2023",
    email: "maya.indah@student.uns.ac.id",
    status: "inactive", // Untuk "Non Aktif"
  },
  {
    id: 5,
    name: "Doni Kusuma",
    nim: "V3423000",
    angkatan: "2023",
    email: "doni.kusuma@student.uns.ac.id",
    status: "inactive",
  },
]);

// Data dosen
const lecturers = ref([
  {
    id: 1,
    name: "Budi Santoso",
    nip: "00913945587",
    email: "budi.santoso@staff.uns.ac.id",
    status: "success", // Untuk "Aktif"
  },
  {
    id: 2,
    name: "Siti Rahma",
    nip: "00913945587",
    email: "siti.rahma@staff.uns.ac.id",
    status: "success",
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    nip: "00913945587",
    email: "ahmad.fauzi@staff.uns.ac.id",
    status: "success",
  },
  {
    id: 4,
    name: "Maya Indah",
    nip: "00913945587",
    email: "maya.indah@staff.uns.ac.id",
    status: "inactive", // Untuk "Non Aktif"
  },
  {
    id: 5,
    name: "Doni Kusuma",
    nip: "00913945587",
    email: "doni.kusuma@staff.uns.ac.id",
    status: "inactive",
  },
]);

// Status options for filter
const statuses = [
  { value: "success", label: "Aktif" },
  { value: "inactive", label: "Non Aktif" },
];

// Filter untuk Mahasiswa
const selectedStatusesMahasiswa = ref([]);
const handleFilterMahasiswa = (filterData) => {
  console.log("Filter data received for mahasiswa:", filterData);
  selectedStatusesMahasiswa.value = filterData.values || [];
};

// Filter untuk Dosen
const selectedStatusesDosen = ref([]);
const handleFilterDosen = (filterData) => {
  console.log("Filter data received for dosen:", filterData);
  selectedStatusesDosen.value = filterData.values || [];
};

// Filter pencarian mahasiswa with status filters
const filteredStudents = computed(() => {
  let result = [...students.value];

  // Apply text search filter
  if (searchQueryMahasiswa.value && searchQueryMahasiswa.value.trim() !== "") {
    const searchLower = searchQueryMahasiswa.value.toLowerCase().trim();
    result = result.filter(
      (student) =>
        student.name.toLowerCase().includes(searchLower) ||
        student.nim.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)
    );
  }

  // Apply status filter if any statuses are selected
  if (
    selectedStatusesMahasiswa.value &&
    selectedStatusesMahasiswa.value.length > 0
  ) {
    console.log("Filtering by statuses:", selectedStatusesMahasiswa.value);
    result = result.filter((student) =>
      selectedStatusesMahasiswa.value.includes(student.status)
    );
  }

  return result;
});

// Filter pencarian dosen with status filters
const filteredLecturers = computed(() => {
  let result = [...lecturers.value];

  // Apply text search filter
  if (searchQueryDosen.value && searchQueryDosen.value.trim() !== "") {
    const searchLower = searchQueryDosen.value.toLowerCase().trim();
    result = result.filter(
      (lecturer) =>
        lecturer.name.toLowerCase().includes(searchLower) ||
        lecturer.nip.toLowerCase().includes(searchLower) ||
        lecturer.email.toLowerCase().includes(searchLower)
    );
  }

  // Apply status filter if any statuses are selected
  if (selectedStatusesDosen.value && selectedStatusesDosen.value.length > 0) {
    console.log("Filtering by statuses:", selectedStatusesDosen.value);
    result = result.filter((lecturer) =>
      selectedStatusesDosen.value.includes(lecturer.status)
    );
  }

  return result;
});

// Function to toggle student status
const toggleStudentStatus = (student) => {
  const index = students.value.findIndex((s) => s.id === student.id);
  if (index !== -1) {
    // Toggle status between active and inactive
    students.value[index].status =
      student.status === "success" ? "inactive" : "success";
  }
};

// Function to toggle lecturer status
const toggleLecturerStatus = (lecturer) => {
  const index = lecturers.value.findIndex((l) => l.id === lecturer.id);
  if (index !== -1) {
    // Toggle status between active and inactive
    lecturers.value[index].status =
      lecturer.status === "success" ? "inactive" : "success";
  }
};

// Table headers
const tableHeadersMahasiswa = [
  "Nama Lengkap",
  "NIM",
  "Angkatan",
  "Email",
  "Status",
];
const tableHeadersDosen = ["Nama Lengkap", "NIP", "Email", "Status"];

// Checked items for mahasiswa
const checkedMahasiswa = ref([]);
const checkedLecturers = ref([]); // TAMBAHKAN

// Fungsi untuk mengubah status massal mahasiswa
const setMahasiswaStatus = (status) => {
  students.value = students.value.map((student) => {
    if (checkedMahasiswa.value.includes(student.id)) {
      return { ...student, status };
    }
    return student;
  });
  checkedMahasiswa.value = [];
};

// Fungsi untuk mengubah status massal dosen
const setLecturerStatus = (status) => {
  lecturers.value = lecturers.value.map((lecturer) => {
    if (checkedLecturers.value.includes(lecturer.id)) {
      return { ...lecturer, status };
    }
    return lecturer;
  });
  checkedLecturers.value = [];
};

// Untuk menutup modal
const closeModalSelected = () => {
  checkedMahasiswa.value = [];
};

// Untuk menutup modal dosen
const closeModalSelectedLecturer = () => {
  checkedLecturers.value = [];
};
</script>

<template>
  <Breadcrumb :items="breadcrumbItems" />

  <TabDiv :tabs="tabs" :use-named-slots="true">
    <!-- === TAB 1: MAHASISWA === -->
    <template #tab1>
      <div class="flex gap-2 lg:gap-4 justify-between items-center mb-4">
        <ModalFilter title="Status" :items="statuses" filterType="status" @apply="handleFilterMahasiswa"
          triggerText="Status" :preselectedValues="selectedStatusesMahasiswa" />
        <SearchBar v-model="searchQueryMahasiswa" @search="handleSearchMahasiswa" filterKey="mahasiswa" />
      </div>

      <Table :headers="tableHeadersMahasiswa" :items="filteredStudents" min-width="min-w-full" :showCheckbox="true"
        :checkedItems="checkedMahasiswa" @update:checkedItems="checkedMahasiswa = $event">
        <template #row="{ item }">
          <td class="py-3 px-6">{{ item.name }}</td>
          <td class="py-3 px-6">{{ item.nim }}</td>
          <td class="py-3 px-6">{{ item.angkatan }}</td>
          <td class="py-3 px-6">{{ item.email }}</td>
          <td class="py-3 px-6">
            <StatusLabel class="w-fit hidden lg:block" :status="item.status"
              :label="item.status === 'success' ? 'Aktif' : 'Non Aktif'" :customLabel="true" size="md" />
          </td>
        </template>
      </Table>

      <!-- ModalSelected muncul jika ada yang dicentang -->
      <ModalSelected v-if="checkedMahasiswa.length > 0" :count="checkedMahasiswa.length" @close="closeModalSelected"
        @setActive="setMahasiswaStatus('success')" @setInactive="setMahasiswaStatus('inactive')" />
    </template>

    <!-- === TAB 2: DOSEN === -->
    <template #tab2>
      <div class="flex gap-2 lg:gap-4 justify-between items-center mb-4">
        <ModalFilter title="Status" :items="statuses" filterType="status" @apply="handleFilterDosen"
          triggerText="Status" :preselectedValues="selectedStatusesDosen" />
        <SearchBar v-model="searchQueryDosen" @search="handleSearchDosen" filterKey="dosen" />
      </div>

      <Table :headers="tableHeadersDosen" :items="filteredLecturers" min-width="min-w-full" :showCheckbox="true"
        :checkedItems="checkedLecturers" @update:checkedItems="checkedLecturers = $event">
        <template #row="{ item }">
          <td class="py-3 px-6">{{ item.name }}</td>
          <td class="py-3 px-6">{{ item.nip }}</td>
          <td class="py-3 px-6">{{ item.email }}</td>
          <td class="py-3 px-6">
            <StatusLabel class="w-fit hidden lg:block" :status="item.status"
              :label="item.status === 'success' ? 'Aktif' : 'Non Aktif'" :customLabel="true" size="md" />
          </td>
        </template>
      </Table>
      <ModalSelected v-if="checkedLecturers.length > 0" :count="checkedLecturers.length"
        @close="closeModalSelectedLecturer" @setActive="setLecturerStatus('success')"
        @setInactive="setLecturerStatus('inactive')" />
    </template>
  </TabDiv>
</template>
