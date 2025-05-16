<script setup>
import { ref, computed } from 'vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import InputText from '@/components/Tugas-akhir/Forms/InputText.vue';
import InputTextArea from '@/components/Tugas-akhir/Forms/InputTextarea.vue';

</script>
<template>
    <Breadcrumb :items="breadcrumbItems"/>
    <div class="card-rounded bg-white p-6 lg:p-8 mt-6">
        <div class="max-w-screen-2xl mx-auto">
            <div class="">
                <h5 class="body2-bold font-bold sm:font-bold sm:body1-bold lg:heading5 xl:heading4">
                Seminar Proposal
                </h5>
                <p class="body4">John Batubara | V3423999 | Pengembangan el Pikir Satu Dua Tiga</p>
            </div>
            <div class="mt-6 flex flex-col gap-4">
                <InputText
                    type="number"
                    label="Nilai Proposal"
                    placeholder="Masukkan Nilai"
                />
                <InputTextArea
                    label="Catatan Proposal"
                    placeholder="Masukkan Catatan"
                />
                <Button
                    variant="primary"
                    class="w-fit self-end"
                    size="lg"
                >Simpan</Button>
            </div>
        </div>
    </div>
</template>