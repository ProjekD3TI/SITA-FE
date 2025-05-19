<script setup>
import { ref, computed, } from 'vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import DefaultAvatar from '@/assets/images/Profile Avatar.svg';
import DefaultModal from '@/components/Tugas-akhir/Modals/DefaultModal.vue';
import InputText from '@/components/Tugas-akhir/Forms/InputText.vue';
import InputTextarea from '@/components/Tugas-akhir/Forms/InputTextarea.vue';
import FilePDFDummy from '@/assets/SV-Undangan Sosialisasi Teknis dan Informasi Lomba OLIVIA Tahun 2025.pdf';
import router from '@/router';

const showNilaiModal = ref(false);

const openNilaiModal = () => {
  showNilaiModal.value = true;
};

// const pdfUrl = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";
const pdfUrl = FilePDFDummy;
const mahasiswa = {
  nim: '12345678',
  nama: 'John Doe',
  img: DefaultAvatar,
};

// TA details
const tugasAkhirDetails = {
  judul: "Pengembangan El Pikir Satu Dua Tiga",
  kategori: "Internet Of Things",
  dosenPembimbing: "Agus Kotak S.Ht",
  tahunAjaran: "2023/2024",
//   nilai_proposal: 90,
//   catatan_proposal: "Tugas akhir sangat baik, presentasi lancar, dan mahasiswa dapat menjawab semua pertanyaan dengan tepat.",
  nilai_proposal: null,
  catatan_proposal: null
};

const isNilaiKosong = computed(() =>
  tugasAkhirDetails.nilai_proposal == null && tugasAkhirDetails.catatan_proposal == null
);
const goToInputNilai = () => {
  router.push({
    name: 'InputNilaiProposalForAdmin',
    params: { nim: mahasiswa.nim },
  });
  console.log('Row clicked in Pengajuan:', item);
};

</script>
<template>
    <router-view v-if="$route.path.includes('input-nilai')"></router-view>

    <div v-else>
        <Breadcrumb :items="breadcrumbItems" />
        <div class="card-rounded bg-white p-6 lg:p-8 mt-6">
            <div class="max-w-screen-2xl mx-auto">
                <div class="flex flex-col md:flex-row">
                    <!-- PDF Preview (Left Side) -->
                    <div class="basis-7/12 md:pe-8 order-last md:order-first">
                        <object
                            :data="pdfUrl"
                            type="application/pdf"
                            class="w-full h-[750px] mt-6 md:mt-0"
                        >
                            <p class="p-4 text-center">
                            Browser Anda tidak mendukung tampilan PDF.
                            <a :href="pdfUrl" target="_blank" class="text-primary">Klik di sini</a> untuk membuka PDF.
                            </p>
                        </object>
                    </div>
                    
                    <!-- Details (Right Side) -->
                    <div class="basis-5/12 flex flex-col gap-4">
                        <!-- Detail items -->
                        <div class="flex flex-col gap-2">
                            <div class="flex gap-2 sm:gap-4 mx-auto w-full">
                                <img :src="mahasiswa.img" alt="" class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
                                <div>
                                    <h5 class="body1-bold">{{ mahasiswa.nama }}</h5>
                                    <p class="body1 text-primary">{{ mahasiswa.nim }}</p>
                                </div>
                            </div>
                            <div>
                                <h5 class="body1-bold">Judul Tugas Akhir</h5>
                                <p class="body1 text-primary">{{ tugasAkhirDetails.judul }}</p>
                            </div>
                            
                            <div>
                                <h5 class="body1-bold">Kategori</h5>
                                <p class="body1 text-primary">{{ tugasAkhirDetails.kategori }}</p>
                            </div>
                            
                            <div>
                                <h5 class="body1-bold">Dosen Pembimbing</h5>
                                <p class="body1 text-primary">{{ tugasAkhirDetails.dosenPembimbing }}</p>
                            </div>
                            
                            <div>
                                <h5 class="body1-bold">Tahun Ajaran</h5>
                                <p class="body1 text-secondary">{{ tugasAkhirDetails.tahunAjaran }}</p>
                            </div>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex self-end gap-4 items-center">
                            
                            <Button
                                v-if="isNilaiKosong"
                                variant="primary"
                                size="lg"
                                class="w-fit sm:flex hidden"
                                :class="buttonClasses"
                                @click="goToInputNilai"
                            >
                            Input Nilai
                            </Button>

                            <Button
                                v-if="isNilaiKosong"
                                variant="primary"
                                size="md"
                                class="w-fit sm:hidden"
                                :class="buttonClasses"
                                @click="goToInputNilai"
                            >
                            Input Nilai
                            </Button>

                            <Button
                                v-if="!isNilaiKosong"
                                variant="success"
                                size="lg"
                                class="w-fit sm:flex hidden"
                                :class="buttonClasses"
                                @click="openNilaiModal"
                            >
                            Lihat Nilai
                            </Button>

                            <Button
                                v-if="!isNilaiKosong"
                                variant="success"
                                size="md"
                                class="w-fit sm:hidden"
                                :class="buttonClasses"
                                @click="openNilaiModal"
                            >
                            Lihat Nilai
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <DefaultModal
            v-if="showNilaiModal"
            headText="Nilai Seminar Proposal"
            bodyText="Nama Mahasiswa | V3423999 | Judul Tugas Akhir"
            @close="showNilaiModal = false"
        >
        <div class="flex flex-col gap-4">
            <InputText
                label="Nilai"
                :value="tugasAkhirDetails.nilai_proposal"
                disabled="true"
            />
            <InputTextarea
                label="Catatan"
                :modelValue="tugasAkhirDetails.catatan_proposal"    
                disabled="true"
            />
            <Button
                variant="secondary"
                class="w-fit self-end"
                size="lg"
                leftIconPath="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            >Edit</Button>
        </div>
        </DefaultModal>
    </div>
</template>
