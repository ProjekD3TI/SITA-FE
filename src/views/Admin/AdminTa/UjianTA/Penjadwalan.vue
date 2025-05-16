<script setup>
import { ref, computed } from 'vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import UserData from '@/components/Tugas-akhir/UserData.vue';
import InputDropdown from '@/components/Tugas-akhir/Forms/InputDropdown.vue';
import InputText from '@/components/Tugas-akhir/Forms/InputText.vue';
import InputDate from '@/components/Tugas-akhir/Forms/InputDate.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
const Today = new Date().toISOString().split('T')[0];
const penguji = ref({
    
        ketua: 'Dr. John Doe',
        sekretaris: 'Dr. Jane Smith',
        penguji: 'Dr. Richard Roe'
    
});
const mahasiswa = ref(    
    {
        nim: 'V234567890',
        nama: 'John Doe',
        kategori: 'Internet of Things',
        judul_proposal_ta: 'Pengembangan Aplikasi Mobile',
        dosen_pembimbing: 'Dr. Jane Smith'
    });
</script>
<template>
    <Breadcrumb :items="breadcrumbItems" />
    <div class="card-rounded card-rounded bg-white p-4 lg:p-8">
        <UserData
            :headText="mahasiswa.nim"
            :bodyText="mahasiswa.nama"
            :headText2="mahasiswa.kategori"
            :bodyText2="mahasiswa.judul_proposal_ta"
            tahunAjaran="2024/2025"
        />
        <div class="flex flex-col gap-4 mt-4">
            <div class="flex flex-col gap-4 opacity-50">
                <InputText
                    label="Ketua Penguji"
                    placeholder="Pilih Dosen"
                    :value="penguji.ketua"
                    disabled="true"
                />
                <InputText
                    label="Sekretaris Penguji"
                    placeholder="Pilih Dosen"
                    :value="penguji.sekretaris"
                    disabled="true"
                />
                <InputText
                    label="Penguji"
                    placeholder="Pilih Dosen"
                    :value="penguji.penguji"
                    disabled="true"
                />
            </div>
            <div class="flex flex-wrap sm:flex-nowrap gap-4 justify-between">
                <InputDate
                    label="Tanggal"
                    :value="Today"
                />
                <InputDropdown
                    label="Ruang"
                    placeholder="Pilih ruang"
                />
                <InputDropdown
                    label="Sesi"
                    placeholder="Pilih sesi"
                />
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
</template>