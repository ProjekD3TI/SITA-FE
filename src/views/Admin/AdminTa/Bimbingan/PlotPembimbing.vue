<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import UserData from "@/components/Tugas-akhir/UserData.vue";
import InputDropdown from "@/components/Tugas-akhir/Forms/InputDropdown.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import DefaultAvatar from "@/assets/images/Profile Avatar.svg";
import Button from "@/components/Tugas-akhir/Button.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useShowPlottingPembimbing } from "@/services/TugasAkhir/Admin/bimbingan.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const {
  dataShowPlotting,
  fetchData,
  submitPlotting,
  updatePlotting,
  loadingShowPlotting,
  errorShowPlotting,
} = useShowPlottingPembimbing(route.params.id);

onMounted(() => {
  if (route.params.tugas_akhir_id) {
    fetchData(route.params.tugas_akhir_id);
  }
});

const mahasiswaData = computed(() => {
  // dataDetailPlotting.value bisa berupa array, ambil elemen pertama
  const data = Array.isArray(dataShowPlotting.value)
    ? dataShowPlotting.value[0]
    : dataShowPlotting.value;
  if (
    !data ||
    !data.mahasiswa ||
    !Array.isArray(data.mahasiswa) ||
    data.mahasiswa.length === 0
  )
    return null;
  return data.mahasiswa[0];
});

const dosen_list = computed(() => {
  const data = Array.isArray(dataShowPlotting.value)
    ? dataShowPlotting.value[0]
    : dataShowPlotting.value;
  if (!data || !data.daftar_dosen) return [];

  return data.daftar_dosen.map((dosen) => {
    const hasAccess = dosen.akses_ta === 1;
    return {
      value: dosen.id,
      label: hasAccess ? `${dosen.name} ` : `${dosen.name} - (Non-Aktif)`,
      disabled: !hasAccess, // ✅ Disable jika akses_ta = 0
      akses_ta: dosen.akses_ta,
      nik: dosen.nik,
      name: dosen.name,
      raw_dosen: dosen, // ✅ Simpan data dosen lengkap
    };
  });
});
const validateDosenAccess = () => {
  const selectedDosen = selectedDosenPembimbing.value;

  if (selectedDosen && selectedDosen.akses_ta !== 1) {
    toast.error("Dosen yang dipilih tidak memiliki akses Tugas Akhir!");
    return false;
  }

  return true;
};
const selectedDosenPembimbingValue = ref(null);

const selectedDosenPembimbing = computed(() => {
  // Ambil data detail (array atau object)
  const data = Array.isArray(dataShowPlotting.value)
    ? dataShowPlotting.value[0]
    : dataShowPlotting.value;
  if (!data || !data.daftar_dosen) return null;
  // Cari dosen berdasarkan id (karena v-model pakai value: d.id)
  return (
    data.daftar_dosen.find(
      (d) => d.id === selectedDosenPembimbingValue.value
    ) || null
  );
});
watch(
  dataShowPlotting,
  (val) => {
    const data = Array.isArray(val) ? val[0] : val;
    if (
      data &&
      data.mahasiswa &&
      Array.isArray(data.mahasiswa) &&
      data.mahasiswa[0]?.dosen_pembimbing
    ) {
      if (!selectedDosenPembimbingValue.value) {
        selectedDosenPembimbingValue.value =
          data.mahasiswa[0].dosen_pembimbing.dosen_pembimbing_id ??
          data.mahasiswa[0].dosen_pembimbing.id;
      }
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  const mahasiswa = mahasiswaData.value;
  if (!mahasiswa || !selectedDosenPembimbingValue.value) {
    toast.error("Pilih dosen pembimbing terlebih dahulu!");
    return;
  }
  // ✅ TAMBAHAN: Validasi akses TA
  if (!validateDosenAccess()) {
    return;
  }
  try {
    loadingShowPlotting.value = true;
    await submitPlotting({
      tugas_akhir_id: mahasiswa.tugas_akhir_id,
      dosen_pembimbing_id: selectedDosenPembimbingValue.value,
    });
    router.push({ name: "BimbinganforAdmin", query: { refresh: Date.now() } });
  } catch (e) {
    toast.error("Gagal menyimpan plotting pembimbing.");
  } finally {
    loadingShowPlotting.value = false;
  }
};

const handleUpdate = async () => {
  const mahasiswa = mahasiswaData.value;
  if (!mahasiswa || !selectedDosenPembimbingValue.value) {
    toast.error("Pilih dosen pembimbing terlebih dahulu!");
    return;
  }
  // ✅ TAMBAHAN: Validasi akses TA
  if (!validateDosenAccess()) {
    return;
  }
  try {
    loadingShowPlotting.value = true;
    await updatePlotting({
      tugas_akhir_id: mahasiswa.tugas_akhir_id,
      dosen_pembimbing_id: selectedDosenPembimbingValue.value,
    });
    // toast.success('Plotting pembimbing berhasil diupdate!');
    router.push({ name: "BimbinganforAdmin", query: { refresh: Date.now() } });
  } catch (e) {
    toast.error("Gagal memperbarui plotting pembimbing.");
  } finally {
    loadingShowPlotting.value = false;
  }
};
</script>
<template>
  <div
    v-if="loadingShowPlotting"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>

  <div v-else-if="errorShowPlotting" class="p-4">
    <ErrorMsg :message="errorShowPlotting" />
  </div>

  <div v-else>
    <Breadcrumb />
    <div class="p-6 bg-white card-rounded lg:p-8">
      <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
        <UserData
          :headText="mahasiswaData?.mahasiswa?.name || 'Nama Mahasiswa'"
          :bodyText="mahasiswaData?.mahasiswa?.nim || 'NIM Mahasiswa'"
          headText2="Kategori"
          :bodyText2="
            mahasiswaData?.kategori?.nama_kategori || 'Kategori Tugas Akhir'
          "
          :tahunAjaran="
            mahasiswaData?.tahun_ajaran || 'Tahun Ajaran Tugas Akhir'
          "
        />
        <InputText
          v-if="mahasiswaData?.has_dosen_penguji == true"
          id="dosen-pembimbing"
          label="Dosen Pembimbing"
          :modelValue="
            mahasiswaData?.dosen_pembimbing?.name || 'Nama Dosen Pembimbing'
          "
          :disabled="true"
        />
        <InputDropdown
          v-else
          id="dosen-pembimbing"
          label="Dosen Pembimbing"
          :options="dosen_list"
          placeholder="Pilih Dosen Pembimbing"
          v-model="selectedDosenPembimbingValue"
          required
        />
        <div
          v-if="
            selectedDosenPembimbing && selectedDosenPembimbing.akses_ta !== 1
          "
          class="p-2 px-6 text-red-700 bg-red-100 border border-red-400 input-rounded body4"
        >
          Dosen yang dipilih non-aktif!
        </div>
        <div v-if="selectedDosenPembimbing" class="flex gap-2 sm:gap-4">
          <div class="flex gap-2 sm:gap-4">
            <!-- Icon Dosen -->
            <img
              :src="DefaultAvatar"
              alt=""
              class="self-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            />

            <!-- Informasi Dosen -->
            <div class="self-center">
              <h5 class="body4-bold sm:body2-bold lg:body1-bold text-primary">
                {{ selectedDosenPembimbing.name }}
              </h5>
              <span class="body5 lg:body4"
                >{{ selectedDosenPembimbing.nik }} | D-3 Teknik
                Informatika</span
              >
            </div>
          </div>
        </div>
        <Button
          v-if="!mahasiswaData?.dosen_pembimbing?.dosen_pembimbing_id"
          variant="primary"
          size="lg"
          class="self-end hidden w-fit sm:flex"
          @click="handleSubmit"
        >
          Simpan
        </Button>
        <Button
          v-else-if="mahasiswaData?.has_dosen_penguji == true"
          variant="secondary"
          size="lg"
          class="self-end hidden w-fit sm:flex"
          @click="router.back()"
        >
          Kembali
        </Button>
        <Button
          v-else
          variant="primary"
          size="lg"
          class="self-end hidden w-fit sm:flex"
          @click="handleUpdate"
        >
          Update
        </Button>

        <Button
          v-if="!mahasiswaData?.dosen_pembimbing?.dosen_pembimbing_id"
          variant="primary"
          size="md"
          class="self-end w-fit sm:hidden"
          @click="handleSubmit"
        >
          Simpan
        </Button>
        <Button
          v-else-if="mahasiswaData?.has_dosen_penguji == true"
          variant="secondary"
          size="md"
          class="self-end w-fit sm:hidden"
          @click="router.back()"
        >
          Kembali
        </Button>
        <Button
          v-else
          variant="primary"
          size="md"
          class="self-end w-fit sm:hidden"
          @click="handleUpdate"
        >
          Update
        </Button>
      </div>
    </div>
  </div>
</template>
