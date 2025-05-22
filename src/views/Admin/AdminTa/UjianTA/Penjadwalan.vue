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
    <Breadcrumb />
    <div class="card-rounded card-rounded bg-white p-4 lg:p-8">
        <div class="max-w-screen-2xl mx-auto">
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
                        id="ketua-penguji"
                        label="Ketua Penguji"
                        placeholder="Pilih Dosen"
                        :value="penguji.ketua"
                        :disabled="true"
                    />
                    <InputText
                        id="sekretaris-penguji"
                        label="Sekretaris Penguji"
                        placeholder="Pilih Dosen"
                        :value="penguji.sekretaris"
                        :disabled="true"
                    />
                    <InputText
                        id="penguji"
                        label="Penguji"
                        placeholder="Pilih Dosen"
                        :value="penguji.penguji"
                        :disabled="true"
                    />
                </div>
                <div class="flex flex-wrap sm:flex-nowrap gap-4 justify-between">
                    <InputDate
                        id="tanggal"
                        label="Tanggal"
                        :value="Today"
                    />
                    <InputDropdown
                        id="ruang"
                        label="Ruang"
                        placeholder="Pilih ruang"
                        :options="[{ value: 'Ruang 101', label: 'Ruang 101' }, { value: 'Ruang 102', label: 'Ruang 102' }]"
                    />
                    <InputDropdown
                        id="sesi"
                        label="Sesi"
                        placeholder="Pilih sesi"
                        :options="[{ value: 'Sesi 1', label: 'Sesi 1' }, { value: 'Sesi 2', label: 'Sesi 2' }]"
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
    </div>
</template>