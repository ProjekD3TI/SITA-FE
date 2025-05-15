<script setup>
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
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
                />
                <InputText
                    label="Sekretaris Penguji"
                    placeholder="Pilih Dosen"
                    :value="penguji.sekretaris"
                />
                <InputText
                    label="Penguji"
                    placeholder="Pilih Dosen"
                    :value="penguji.penguji"
                />
            </div>
            <div class="flex gap-4 justify-between">
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