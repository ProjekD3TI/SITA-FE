<template>
  <router-view v-if="$route.path.includes('berkas')"></router-view>
  <router-view
    v-else-if="$route.path.includes('detail-ujian-ta')"
  ></router-view>
  <div v-else>
    <Accordion :items="accordionItems" :showStatus="true" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Accordion from "@/components/Tugas-akhir/Accordion.vue";
import { useRoute } from "vue-router";
const route = useRoute();

// Data untuk ditampilkan di dalam accordion - setiap item memiliki data lengkap
const accordionItems = ref([
  {
    id: 1,
    title: "Tugas Akhir 1",
    headText: "Dosen Pembimbing",
    bodyText: "Dr. Budi Santoso, M.Kom",
    headText2: "Kategori",
    bodyText2: "Internet of Things",
    headText3: "Status",
    bodyText3: "Aktif",
    tahunLabel: "Tahun Ajaran",
    tahunAjaran: "2024/2025",
    date1: "Senin, 15 Mei 2025",
    time1: "Sesi 1 (08.00-09.30)",
    room1: "Lab Komputer 1",
    status1: "success",
    statusLabel1: "Terjadwal",
    showHistoryButton: false,
    showDaftarButton: false, // Sembunyikan tombol Daftar khusus untuk item ini
    showBerkasButton: true,
    // showDetailButton: false,
  },
  {
    id: 2,
    title: "Tugas Akhir 2",
    headText: "Dosen Penguji",
    bodyText: "Prof. Dr. Ahmad Hadi Hidayat, M.Sc",
    headText2: "Kategori",
    bodyText2: "Internet of Things",
    headText3: "Status",
    bodyText3: "Non-Aktif",
    tahunLabel: "Tahun Ajaran",
    tahunAjaran: "2023/2024",
    date1: "Jumat, 30 Juni 2025",
    time1: "Sesi 2 (10.00-11.30)",
    room1: "Ruang Seminar",
    status1: "danger",
    statusLabel1: "Tidak Lulus",
    date2: "Jumat, 24 Juni 2025",
    time2: "Sesi 2 (10.00-11.30)",
    room2: "Ruang Seminar",
    status2: "warning",
    statusLabel2: "Revisi",
    showHistoryButton: true,
    showDaftarButton: false, // Sembunyikan tombol Daftar khusus untuk item ini
    showBerkasButton: true,
    showDetailButton: false,
  },
]);
</script>
