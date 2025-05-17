<script setup>
import { ref, computed } from 'vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import UserData from '@/components/Tugas-akhir/UserData.vue';
import InputDropdown from '@/components/Tugas-akhir/Forms/InputDropdown.vue';
import DefaultAvatar from '@/assets/images/Profile Avatar.svg';
import Button from '@/components/Tugas-akhir/Button.vue';
import Loading from '@/components/Loading.vue';
import ErrorMsg from '@/components/ErrorMsg.vue';

const loading = ref(false);
const error = ref(null);
const mahasiswa = {
    nim: '12345678',
    nama: 'John Doe',
    img: DefaultAvatar,
};
const tugas_akhir = {
    judul: "Pengembangan El Pikir Satu Dua Tiga",
    kategori: "Internet Of Things",
    tahunAjaran: "2023/2024",
};

const dosen = [
    { 
        nip : 12345678,
        nama : 'Agus Kotak S.Ht',
        img : DefaultAvatar,
    },
    { 
        nip : 12345679,
        nama : 'Budi Susanto S.Kom',
        img : DefaultAvatar,
    },
    { 
        nip : 12345680,
        nama : 'Cindy Wijaya S.T',
        img : DefaultAvatar,
    },
];

const dosen_list = dosen.map(d => ({
    value: d.nip,
    label: d.nama
}));

const selectedDosenPembimbingValue = ref(null);

const selectedDosenPembimbing = computed(() => {
  return dosen.find(d => d.nip === selectedDosenPembimbingValue.value) || null;
});
</script>
<template>
    <Breadcrumb :items="breadcrumbItems"/>
    <Loading v-if="loading" />
    <ErrorMsg v-else-if="error" :message="errorMessage" />
    <div v-else class="card-rounded bg-white p-6 lg:p-8">
        <div class="flex flex-col gap-4 max-w-screen-2xl mx-auto">
            <UserData
                :headText="mahasiswa.nama"
                :bodyText="mahasiswa.nim"
                headText2="Kategori"
                :bodyText2="tugas_akhir.kategori"
                :tahunAjaran="tugas_akhir.tahunAjaran"
            />
            <InputDropdown
                label="Dosen Pembimbing"
                :options="dosen_list"
                placeholder="Pilih Dosen Pembimbing"
                v-model="selectedDosenPembimbingValue"
            />
            <div v-if="selectedDosenPembimbing" class="flex gap-2 sm:gap-4">
                <div  class="flex gap-2 sm:gap-4">
                <!-- Icon Dosen -->
                <img :src="DefaultAvatar" alt="" class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 self-center">
            
                <!-- Informasi Dosen -->
                <div class="self-center">
                    <h5 class="body4-bold sm:body2-bold lg:body1-bold text-primary">{{ selectedDosenPembimbing.nama }}</h5>
                    <span class="body5 lg:body4">{{ selectedDosenPembimbing.nip }} | D-3 Teknik Informatika</span>
                </div>
                </div>
            </div>
            <Button
                variant="primary"
                size="lg"
                class="w-fit self-end"

            >
                Simpan
            </Button>
        </div>

    </div>
</template>