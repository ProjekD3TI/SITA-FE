<script setup>
import { ref, computed, onMounted } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import UserData from "@/components/Tugas-akhir/UserData.vue";
import InputDropdown from "@/components/Tugas-akhir/Forms/InputDropdown.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputDate from "@/components/Tugas-akhir/Forms/InputDate.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useShowPenjadwalan } from "@/services/TugasAkhir/Admin/ujianTA.js";
const route = useRoute();
const router = useRouter();
const toast = useToast();

const {
  dataShowPenjadwalan,
  loadingShowPenjadwalan,
  errorShowPenjadwalan,
  fetchShowPenjadwalan,
} = useShowPenjadwalan();

const Today = new Date().toISOString().split("T")[0];
const penguji = computed(() => {
  const arr = dataShowPenjadwalan.value?.dosen_penguji || [];
  return {
    ketua: arr.find((d) => d.jabatan_penguji === "ketua")?.name || "",
    sekretaris: arr.find((d) => d.jabatan_penguji === "sekretaris")?.name || "",
    penguji: arr.find((d) => d.jabatan_penguji === "penguji")?.name || "",
  };
});

onMounted(() => {
  if (route.params.tugas_akhir_id) {
    fetchShowPenjadwalan(route.params.tugas_akhir_id);
  }
});
</script>
<template>
  <div
    v-if="loadingShowPenjadwalan"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>

  <div v-else-if="errorShowPenjadwalan" class="p-4">
    <ErrorMsg :message="errorShowPenjadwalan" />
  </div>
  <div v-else>
    <Breadcrumb />
    <div class="p-4 bg-white card-rounded lg:p-8">
      <div class="mx-auto max-w-screen-2xl">
        <UserData
          :headText="dataShowPenjadwalan?.mahasiswa?.nim || 'NIM Mahasiswa'"
          :bodyText="dataShowPenjadwalan?.mahasiswa?.name || 'Nama Mahasiswa'"
          :headText2="dataShowPenjadwalan?.kategori || 'Kategori Tugas Akhir'"
          :bodyText2="
            dataShowPenjadwalan?.judul_tugas_akhir || 'Judul Tugas Akhir'
          "
          :tahunAjaran="
            dataShowPenjadwalan?.tahun_ajaran || 'Tahun Ajaran Tugas Akhir'
          "
        />
        <div class="flex flex-col gap-4 mt-4">
          <div class="flex flex-col gap-4 opacity-50">
            <InputText
              id="ketua-penguji"
              label="Ketua Penguji"
              placeholder="Pilih Dosen"
              :modelValue="penguji.ketua"
              :disabled="true"
            />
            <InputText
              id="sekretaris-penguji"
              label="Sekretaris Penguji"
              placeholder="Pilih Dosen"
              :modelValue="penguji.sekretaris"
              :disabled="true"
            />
            <InputText
              id="penguji"
              label="Penguji"
              placeholder="Pilih Dosen"
              :modelValue="penguji.penguji"
              :disabled="true"
            />
          </div>
          <div class="flex flex-wrap justify-between gap-4 sm:flex-nowrap">
            <InputDate id="tanggal" label="Tanggal" :value="Today" />
            <InputDropdown
              id="ruang"
              label="Ruang"
              placeholder="Pilih ruang"
              :options="[
                { value: 'Ruang 101', label: 'Ruang 101' },
                { value: 'Ruang 102', label: 'Ruang 102' },
              ]"
            />
            <InputDropdown
              id="sesi"
              label="Sesi"
              placeholder="Pilih sesi"
              :options="[
                { value: 'Sesi 1', label: 'Sesi 1' },
                { value: 'Sesi 2', label: 'Sesi 2' },
              ]"
            />
          </div>
          <Button
            variant="primary"
            size="lg"
            class="self-end hidden w-fit sm:flex"
            :disabled="false"
          >
            Simpan
          </Button>
          <Button
            variant="primary"
            size="md"
            class="self-end w-fit sm:hidden"
            :disabled="false"
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
