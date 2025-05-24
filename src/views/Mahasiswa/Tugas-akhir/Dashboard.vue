<script setup>
import { ref, computed, onMounted } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import FlowBar from "@/components/Tugas-akhir/Dashboard/FlowBar.vue";
import SummaryCard from "@/components/Tugas-akhir/Dashboard/SummaryCard.vue";
import StatusCard from "@/components/Tugas-akhir/Dashboard/StatusCard.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import LineChart from "@/components/Tugas-akhir/Dashboard/LineChart.vue";
import {
  BAB,
  TanggalUjian,
  TotalBimbingan,
  currentFlowStep,
  StatusCardIdentifier,
  statusProperties,
  statuses,
  STATUS,
  useDashboard
} from "@/services/TugasAkhir/Mhs/dashboard.js";

const { loading, error } = useDashboard();

// statusCard titles
const cardTitles = {
  0: "Request Pembimbing",
  1: "Proposal Tugas Akhir",
  2: "Ujian Tugas Akhir",
};

// fungsi untuk menyamakan kartu dan title
const getActiveStatus = () => {
  switch (StatusCardIdentifier.value) {
    case 0:
      return statuses.reqBimbingan.value;
    case 1:
      return statuses.proposal.value;
    case 2:
      return statuses.ujianTA.value;
    default:
      return statusValues.WAITING;
  }
};

// fungsi untuk menyamakan kartu dan icon
const getIconPath = () => {
  switch (StatusCardIdentifier.value) {
    case 0:
      return iconPaths.requestPembimbing;
    case 1:
      return iconPaths.proposal;
    case 2:
      return iconPaths.ujianTA;
    default:
      return iconPaths.proposal;
  }
};

// Flow steps dari flowbar
const flowSteps = [
  { name: "Request Pembimbing" },
  { name: "Daftar Proposal" },
  { name: "Seminar Proposal" },
  { name: "Seminar Hasil" },
  { name: "Daftar Ujian Tugas Akhir" },
  { name: "Ujian Tugas Akhir" },
];

// Icon paths
const iconPaths = {
  requestPembimbing:
    "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  proposal:
    "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75",
  ujianTA:
    "M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12",
  book: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  calendar:
    "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z",
  graduation:
    "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
};

// Computed property for status card configuration
const statusCardConfig = computed(() => {
  const activeStatus = getActiveStatus();
  const iconPath = getIconPath();
  const statusProps =
    statusProperties[activeStatus] || statusProperties[statusValues.WAITING];

  return {
    title: cardTitles[StatusCardIdentifier.value],
    icon: iconPath,
    ...statusProps,
  };
});

// Summary cards configuration
const summaryCards = computed(() => [
  {
    icon: iconPaths.book,
    iconColor: "danger",
    title: BAB.value,
    subtitle: "Progress Bimbingan",
  },
  {
    icon: iconPaths.calendar,
    iconColor: "success",
    title: TanggalUjian.value,
    subtitle: "Jadwal Ujian TA",
  },
  {
    icon: iconPaths.graduation,
    iconColor: "warning",
    title: TotalBimbingan.value,
    subtitle: "Total Bimbingan",
  },
]);
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="flex items-center justify-center min-h-[80dvh]">
    <Loading />
  </div>
  <!-- Error State -->
  <ErrorMsg v-else-if="error" :msg="error" />

  <template v-else>
    <Breadcrumb />

    <!-- Flow bar card -->
    <div class="p-4 bg-white card-rounded lg:p-8">
      <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
        <h5 class="body2-bold sm:body1-bold">Flow Tugas Akhir</h5>
        <div class="overflow-x-auto">
          <FlowBar class="pb-16 mx-auto sm:pb-20" :current-step="currentFlowStep" :steps="flowSteps" />
        </div>
      </div>
    </div>

    <!-- Status card & Summary Cards -->
    <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      <!-- Status Card -->
      <!-- filepath: /var/www/html/Frontend-Port/src/views/Mahasiswa/Tugas-akhir/Dashboard.vue -->
      <div class="flex-1 p-4 mt-4 bg-white card-rounded lg:p-8">
        <div v-if="statuses.reqBimbingan.value === STATUS.PLACEHOLDER && StatusCardIdentifier.value === 0"
          class="text-center body2-bold">
          Silahkan Request Pembimbing
        </div>
        <StatusCard v-else :title="statusCardConfig.title" :icon="statusCardConfig.icon"
          :iconColor="statusCardConfig.iconColor" :statusLabel="statusCardConfig.statusLabel"
          :statusType="statusCardConfig.statusType" labelSize="lg" />
      </div>

      <!-- Summary Cards -->
      <div class="flex flex-col flex-grow p-4 bg-white card-rounded lg:p-8 sm:mt-4 sm:flex-row justify-evenly">
        <template v-for="(card, index) in summaryCards" :key="index">
          <!-- Card -->
          <SummaryCard :icon="card.icon" :iconColor="card.iconColor" :title="card.title || '-'"
            :subtitle="card.subtitle" />

          <!-- Divider (except after last card) -->
          <template v-if="index < summaryCards.length - 1">
            <div class="self-stretch hidden w-px h-auto mx-4 my-8 sm:flex bg-placeholder"></div>
            <div class="sm:hidden max-w-[240px] w-10/12 h-px bg-placeholder mx-auto my-4"></div>
          </template>
        </template>
      </div>
    </div>
    <div class="p-4 mt-4 bg-white card-rounded lg:p-8 min-h-fit">
    </div>
  </template>
</template>
