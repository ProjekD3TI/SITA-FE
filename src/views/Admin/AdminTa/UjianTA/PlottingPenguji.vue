<script setup>
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import UserData from '@/components/Tugas-akhir/UserData.vue';
import InputText from '@/components/Tugas-akhir/Forms/InputText.vue';
import InputDate from '@/components/Tugas-akhir/Forms/InputDate.vue';
import InputDropdown from '@/components/Tugas-akhir/Forms/InputDropdown.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import { ref,computed } from 'vue';
import DefaultAvatar from '@/assets/images/Profile Avatar.svg';

const mahasiswa = ref({
    nim: 'V234567890',
    name: 'John Doe',
});
const tugas_akhir = ref({
    kategori: 'Internet of Things',
    judul_proposal_ta: 'Pengembangan Aplikasi Mobile',
    dosen_pembimbing: {
        name: 'Dr. Jane Smith',
        nik: '987654321',
        program_studi: 'D-3 Teknik Informatika'
    },
    tahun_ajaran: '2024/2025',
})
const dosens = ref([
    {
        id: 1,
        name: 'Dr. John Doe',
        nik: '123456789',
        program_studi: 'D-3 Teknik Informatika'
    },
    {
        id: 2,
        name: 'Dr. Jane Smith',
        nik: '987654321',
        program_studi: 'D-3 Teknik Informatika'
    },
    {
        id: 3,
        name: 'Dr. Richard Roe',
        nik: '456789123',
        program_studi: 'D-3 Teknik Informatika'
    }
])

const selectedKetuaPenguji = ref('');
const selectedPenguji = ref('');

// Daftar pilihan dosen untuk dropdown
const pembimbings = computed(() => {
  if (!dosens.value || dosens.value.length === 0) {
    return [];
  }
  
  return dosens.value.map(dosen => ({
    value: dosen.id.toString(),
    label: `${dosen.name} (${dosen.nik})`
  }));
});

// Mendapatkan data dosen yang dipilih untuk Ketua Penguji
const selectedKetuaDosenData = computed(() => {
  if (!selectedKetuaPenguji.value || !dosens.value || dosens.value.length === 0) {
    return null;
  }
  return dosens.value.find(dosen =>
    dosen.id.toString() === selectedKetuaPenguji.value.toString()
  );
});

// Mendapatkan data dosen yang dipilih untuk Penguji
const selectedPengujiDosenData = computed(() => {
  if (!selectedPenguji.value || !dosens.value || dosens.value.length === 0) {
    return null;
  }
  return dosens.value.find(dosen =>
    dosen.id.toString() === selectedPenguji.value.toString()
  );
});
</script>
<template>
    <Breadcrumb />
    <div class="card-rounded card-rounded bg-white p-4 lg:p-8">
        <div class="max-w-screen-2xl mx-auto">
            <UserData
                :headText="mahasiswa.nim"
                :bodyText="mahasiswa.name"
                :headText2="tugas_akhir.kategori"
                :bodyText2="tugas_akhir.judul_proposal_ta"
                :tahunAjaran="tugas_akhir.tahun_ajaran"
            />
            <div class="flex flex-col gap-4 mt-4">
                <div class="flex flex-col gap-2 ">
                    <InputDropdown
                        id="ketua-penguji"
                        label="Ketua Penguji"
                        placeholder="Pilih Dosen"
                        :options="pembimbings"
                        v-model="selectedKetuaPenguji"
                    />
                    <div v-if="selectedKetuaDosenData" class="flex mb-2 gap-2 sm:gap-4">
                        <div  class="flex gap-2 sm:gap-4">
                        <!-- Icon Dosen -->
                        <img :src="DefaultAvatar" alt="" class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 self-center">
                    
                        <!-- Informasi Dosen -->
                        <div class="self-center">
                            <h5 class="body4-bold sm:body2-bold lg:body1-bold text-primary">{{ selectedKetuaDosenData.name }}</h5>
                            <span class="body5 lg:body4">{{ selectedKetuaDosenData.nik }} | D-3 Teknik Informatika</span>
                        </div>
                        </div>
                    </div>
                    <InputText
                        id="dosen-pembimbing"
                        class="mt-2"
                        label="Sekretaris Penguji"
                        placeholder="Pilih Dosen"
                        :value="tugas_akhir.dosen_pembimbing.name"
                        :disabled="true"
                    />
                    <div class="flex mb-2 gap-2 sm:gap-4">
                        <div  class="flex gap-2 sm:gap-4">
                        <!-- Icon Dosen -->
                        <img :src="DefaultAvatar" alt="" class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 self-center">
                        
                        <!-- Informasi Dosen -->
                        <div class="self-center">
                            <h5 class="body4-bold sm:body2-bold lg:body1-bold text-primary">{{ tugas_akhir.dosen_pembimbing.name }} ( Dosen Pembimbing)</h5>
                            <span class="body5 lg:body4">{{ tugas_akhir.dosen_pembimbing.nik }} | D-3 Teknik Informatika </span>
                        </div>
                        </div>
                    </div>
                    <InputDropdown
                        id="penguji"
                        class="mt-2"
                        label="Penguji"
                        placeholder="Pilih Dosen"
                        :options="pembimbings"
                        v-model="selectedPenguji"
                    />
                    <div v-if="selectedPengujiDosenData" class="flex mb-2 gap-2 sm:gap-4">
                        <div  class="flex gap-2 sm:gap-4">
                        <!-- Icon Dosen -->
                        <img :src="DefaultAvatar" alt="" class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 self-center">
                        
                        <!-- Informasi Dosen -->
                        <div class="self-center">
                            <h5 class="body4-bold sm:body2-bold lg:body1-bold text-primary">{{ selectedPengujiDosenData.name }}</h5>
                            <span class="body5 lg:body4">{{ selectedPengujiDosenData.nik }} | D-3 Teknik Informatika</span>
                        </div>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        size="lg"
                        class="w-fit self-end"
                        :disabled="false"
                    >
                        Simpan
                    </Button>
                </div>
            </div>    
        </div>

    </div>
</template>