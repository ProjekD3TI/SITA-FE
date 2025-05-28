<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import UserData from '@/components/Tugas-akhir/UserData.vue';
import InputDropdown from '@/components/Tugas-akhir/Forms/InputDropdown.vue';
import DefaultAvatar from '@/assets/images/Profile Avatar.svg';
import Button from '@/components/Tugas-akhir/Button.vue';
import Loading from '@/components/Loading.vue';
import ErrorMsg from '@/components/ErrorMsg.vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useShowPlottingPembimbing } from '@/services/TugasAkhir/Admin/bimbingan.js';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { dataShowPlotting, fetchData, submitPlotting, updatePlotting, loadingShowPlotting, errorShowPlotting } = useShowPlottingPembimbing(route.params.id);
const loading = ref(false);
const error = ref(null);

onMounted(() => {
    if (route.params.tugas_akhir_id) {
        fetchData(route.params.tugas_akhir_id);
    }
});

const mahasiswaData = computed(() => {
    // dataDetailPlotting.value bisa berupa array, ambil elemen pertama
    const data = Array.isArray(dataShowPlotting.value) ? dataShowPlotting.value[0] : dataShowPlotting.value;
    if (!data || !data.mahasiswa || !Array.isArray(data.mahasiswa) || data.mahasiswa.length === 0) return null;
    return data.mahasiswa[0];
});

const dosen_list = computed(() => {
    // dataDetailPlotting.value bisa berupa array, ambil elemen pertama
    const data = Array.isArray(dataShowPlotting.value) ? dataShowPlotting.value[0] : dataShowPlotting.value;
    if (!data || !data.daftar_dosen) return [];
    return data.daftar_dosen.map(d => ({
        value: d.id,
        label: d.name,
        nik: d.nik
    }));
});

const selectedDosenPembimbingValue = ref(null);

const selectedDosenPembimbing = computed(() => {
    // Ambil data detail (array atau object)
    const data = Array.isArray(dataShowPlotting.value) ? dataShowPlotting.value[0] : dataShowPlotting.value;
    if (!data || !data.daftar_dosen) return null;
    // Cari dosen berdasarkan id (karena v-model pakai value: d.id)
    return data.daftar_dosen.find(d => d.id === selectedDosenPembimbingValue.value) || null;
});
watch(dataShowPlotting, (val) => {
    const data = Array.isArray(val) ? val[0] : val;
    if (data && data.mahasiswa && Array.isArray(data.mahasiswa) && data.mahasiswa[0]?.dosen_pembimbing) {
        selectedDosenPembimbingValue.value = data.mahasiswa[0].dosen_pembimbing.id;
    }
}, { immediate: true });


const handleSubmit = async () => {
    const mahasiswa = mahasiswaData.value;
    if (!mahasiswa || !selectedDosenPembimbingValue.value) {
        toast.error('Pilih dosen pembimbing terlebih dahulu!');
        return;
    }
    try {
        loading.value = true;
        await submitPlotting({
            tugas_akhir_id: mahasiswa.id,
            dosen_id: selectedDosenPembimbingValue.value
        });
        router.push({ name: 'BimbinganforAdmin', query: { refresh: Date.now() } });
    } catch (e) {
        // toast.error('Gagal menyimpan plotting pembimbing.');
    } finally {
        loading.value = false;
    }
};

const handleUpdate = async () => {
    const mahasiswa = mahasiswaData.value;
    if (!mahasiswa || !selectedDosenPembimbingValue.value) {
        toast.error('Pilih dosen pembimbing terlebih dahulu!');
        return;
    }
    try {
        loading.value = true;
        await updatePlotting({
            tugas_akhir_id: mahasiswa.id,
            dosen_id: selectedDosenPembimbingValue.value
        });
        // toast.success('Plotting pembimbing berhasil diupdate!');
        router.push({ name: 'BimbinganforAdmin', query: { refresh: Date.now() } });
    } catch (e) {
        toast.error('Gagal mengupdate plotting pembimbing.');
    } finally {
        loading.value = false;
    }
};
</script>
<template>
    <div v-if="loadingShowPlotting || loading" class="flex items-center justify-center min-h-[80dvh]">
        <Loading />
    </div>

    <div v-else-if="errorShowPlotting || error" class="p-4">
        <ErrorMsg :message="errorShowPlotting || error" />
    </div>

    <div v-else>
        <Breadcrumb />
        <div class="p-6 bg-white card-rounded lg:p-8">
            <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
                <UserData :headText="mahasiswaData?.mahasiswa" :bodyText="mahasiswaData?.nim" headText2="Kategori"
                    :bodyText2="mahasiswaData?.kategori" :tahunAjaran="mahasiswaData?.tahun_ajaran" />
                <InputDropdown id="dosen-pembimbing" label="Dosen Pembimbing" :options="dosen_list"
                    placeholder="Pilih Dosen Pembimbing" v-model="selectedDosenPembimbingValue" />
                <div v-if="selectedDosenPembimbing" class="flex gap-2 sm:gap-4">
                    <div class="flex gap-2 sm:gap-4">
                        <!-- Icon Dosen -->
                        <img :src="DefaultAvatar" alt="" class="self-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">

                        <!-- Informasi Dosen -->
                        <div class="self-center">
                            <h5 class="body4-bold sm:body2-bold lg:body1-bold text-primary">{{
                                selectedDosenPembimbing.name
                                }}</h5>
                            <span class="body5 lg:body4">{{ selectedDosenPembimbing.nik }} | D-3 Teknik
                                Informatika</span>
                        </div>
                    </div>
                </div>
                <Button v-if="!mahasiswaData?.dosen_pembimbing" variant="primary" size="lg" class="self-end w-fit"
                    @click="handleSubmit">
                    Simpan
                </Button>
                <Button v-else variant="primary" size="lg" class="self-end w-fit" @click="handleUpdate">
                    Update
                </Button>
            </div>

        </div>
    </div>

</template>