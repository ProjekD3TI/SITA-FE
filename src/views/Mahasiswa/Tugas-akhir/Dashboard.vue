<script setup>
import { ref } from 'vue';
import HeroAsset from '@/assets/images/blue-dashboard.svg';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue'
import FlowBar from '@/components/Tugas-akhir/FlowBar.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import ModalTimer from '@/components/Tugas-akhir/Modals/ModalTimer.vue';

const modalRef = ref(null);

const showModal = () => {
  modalRef.value.open();
};

const studentName = ref('Mahasiswa 1');
const bimbinganProgress = ref({
  completed: 5,
  total: 9,
});
const proposalStatus = ref('Terverifikasi');
const pendaftaranStatus = ref('Belum Tersedia');
const revisiStatus = ref('Belum Tersedia');
</script>
<template>
  <Breadcrumb :items="breadcrumbItems" />
  <div class="card-rounded bg-white p-4 lg:p-8 mt-4">
    <div class="flex flex-col gap-4 max-w-screen-2xl mx-auto">
      <h5 class="body2-bold sm:body1-bold">Flow Tugas Akhir</h5>
      <div class="overflow-x-auto">
        <FlowBar 
          class="pb-16 sm:pb-20 mx-auto"
          :current-step="-1" 
          :steps="[
            { name: 'Request Pembimbing' },
            { name: 'Daftar Proposal' },
            { name: 'Seminar Proposal' },
            { name: 'Seminar Hasil' },
            { name: 'Daftar Ujian Tugas Akhir' },
            { name: 'Ujian Tugas Akhir' }
          ]"
        />
      </div>
    </div>
  </div>
  <div class="card-rounded bg-white p-4 lg:p-8 mt-4">
    <Button
      @click="showModal"
      variant="primary"
      size="lg"
    >Mulai Bimbingan</Button>
    <ModalTimer ref="modalRef" />
  </div>

</template>