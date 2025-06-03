<script setup>
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import UserData from "@/components/Tugas-akhir/UserData.vue";
import InputText from "@/components/Tugas-akhir/Forms/InputText.vue";
import InputDropdown from "@/components/Tugas-akhir/Forms/InputDropdown.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import { ref, computed, onMounted, watch } from "vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import DefaultAvatar from "@/assets/images/Profile Avatar.svg";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useShowPlottingPenguji } from "@/services/TugasAkhir/Admin/ujianTA.js";

const toast = useToast();
const route = useRoute();
const router = useRouter();

const {
  fetchShowPlottingPenguji,
  dataShowPlottingPenguji,
  submitPlottingPenguji,
  updatePlottingPenguji,
  loadingShowPlottingPenguji,
  errorShowPlottingPenguji,
} = useShowPlottingPenguji(route.params.id);

const selectedKetuaPenguji = ref("");
const selectedPenguji = ref("");
const selectedSekretarisPenguji = ref("");

onMounted(() => {
  if (route.params.tugas_akhir_id) {
    fetchShowPlottingPenguji(route.params.tugas_akhir_id);
  }
});

const mahasiswaData = computed(() => {
  // dataShowPlottingPenguji.value bisa berupa array atau objek
  const data = Array.isArray(dataShowPlottingPenguji.value)
    ? dataShowPlottingPenguji.value[0]
    : dataShowPlottingPenguji.value;
  if (!data || !data.mahasiswa) return null;
  return {
    mahasiswa: data.mahasiswa,
    kategori: data.kategori,
    judul_proposal: data.judul_proposal,
    tahun_ajaran: data.tahun_ajaran,
    dosen_pembimbing: data.dosen_pembimbing,
    dosen_penguji: data.dosen_penguji || [],
  };
});

const dosens = ref([]); // Awalnya kosong

// Fetch data dosen dari backend setelah dataShowPlottingPenguji berubah
watch(
  () => dataShowPlottingPenguji.value,
  (val) => {
    if (val && val.daftar_dosen) {
      dosens.value = val.daftar_dosen;
    }
    // Set default value dari backend jika dosen_penguji sudah ada
    if (val && Array.isArray(val.dosen_penguji)) {
      // Cari ketua dan penguji (bisa disesuaikan jika struktur berubah)
      const ketua = val.dosen_penguji.find(
        (d) => d.jabatan_penguji === "ketua"
      );
      const penguji = val.dosen_penguji.find(
        (d) => d.jabatan_penguji === "penguji"
      );
      selectedKetuaPenguji.value = ketua ? ketua.id.toString() : "";
      selectedPenguji.value = penguji ? penguji.id.toString() : "";
    } else {
      selectedKetuaPenguji.value = "";
      selectedPenguji.value = "";
    }
  },
  { immediate: true }
);

// Daftar pilihan dosen untuk dropdown
const list_dosen = computed(() => {
  if (!dosens.value || dosens.value.length === 0) {
    return [];
  }
  // Ambil id dosen pembimbing (sekretaris)
  const pembimbingId = mahasiswaData.value?.dosen_pembimbing?.id?.toString();
  return dosens.value
    .filter((dosen) => dosen.id.toString() !== pembimbingId)
    .map((dosen) => ({
      value: dosen.id.toString(),
      label: `${dosen.name} (${dosen.nik})`,
    }));
});

// Mendapatkan data dosen yang dipilih untuk Ketua Penguji
const selectedKetuaDosenData = computed(() => {
  if (
    !selectedKetuaPenguji.value ||
    !dosens.value ||
    dosens.value.length === 0
  ) {
    return null;
  }
  return dosens.value.find(
    (dosen) => dosen.id.toString() === selectedKetuaPenguji.value.toString()
  );
});

// Mendapatkan data dosen yang dipilih untuk Penguji
const selectedPengujiDosenData = computed(() => {
  if (!selectedPenguji.value || !dosens.value || dosens.value.length === 0) {
    return null;
  }
  return dosens.value.find(
    (dosen) => dosen.id.toString() === selectedPenguji.value.toString()
  );
});

const handleSubmit = async () => {
  if (
    !selectedKetuaPenguji.value ||
    !selectedSekretarisPenguji.value ||
    !selectedPenguji.value
  ) {
    toast.error("Semua jabatan penguji harus dipilih!");
    return;
  }
  const mahasiswa = mahasiswaData.value;
  const payload = {
    tugas_akhir_id:
      mahasiswa?.mahasiswa?.tugas_akhir_id || route.params.tugas_akhir_id,
    list_dosen: [
      {
        dosen_id: Number(selectedKetuaPenguji.value),
        jabatan_penguji: "ketua",
      },
      {
        dosen_id: Number(selectedSekretarisPenguji.value),
        jabatan_penguji: "sekretaris",
      },
      { dosen_id: Number(selectedPenguji.value), jabatan_penguji: "penguji" },
    ],
  };
  try {
    loadingShowPlottingPenguji.value = true;
    await submitPlottingPenguji(payload);
    // toast.success("Plotting penguji berhasil disimpan!");
    router.push({
      name: "UjianTAforAdmin",
      query: { refreshPlottingPenguji: Date.now() },
    });
  } catch (e) {
    toast.error("Gagal menyimpan plotting penguji.");
  } finally {
    loadingShowPlottingPenguji.value = false;
  }
};

const handleUpdate = async () => {
  if (
    !selectedKetuaPenguji.value ||
    !selectedSekretarisPenguji.value ||
    !selectedPenguji.value
  ) {
    toast.error("Semua jabatan penguji harus dipilih!");
    return;
  }
  const mahasiswa = mahasiswaData.value;
  // Pastikan hanya 3 dosen, tidak lebih!
  const payload = {
    tugas_akhir_id:
      mahasiswa?.mahasiswa?.tugas_akhir_id || route.params.tugas_akhir_id,
    list_dosen: [
      {
        dosen_id: Number(selectedKetuaPenguji.value),
        jabatan_penguji: "ketua",
      },
      {
        dosen_id: Number(selectedSekretarisPenguji.value),
        jabatan_penguji: "sekretaris",
      },
      {
        dosen_id: Number(selectedPenguji.value),
        jabatan_penguji: "penguji",
      },
    ],
  };
  try {
    loadingShowPlottingPenguji.value = true;
    await updatePlottingPenguji(payload.tugas_akhir_id, payload);
    // toast.success("Plotting penguji berhasil diupdate!");
    router.push({
      name: "UjianTAforAdmin",
      query: { refreshPlottingPenguji: Date.now() },
    });
  } catch (e) {
    toast.error("Gagal mengupdate plotting penguji.");
  } finally {
    loadingShowPlottingPenguji.value = false;
  }
};

watch(
  () => mahasiswaData.value?.dosen_pembimbing,
  (val) => {
    selectedSekretarisPenguji.value = val?.id?.toString() || "";
  },
  { immediate: true }
);
</script>
<template>
  <div
    v-if="loadingShowPlottingPenguji"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>

  <div v-else-if="errorShowPlottingPenguji" class="p-4">
    <ErrorMsg :message="errorShowPlottingPenguji" />
  </div>

  <div v-else>
    <Breadcrumb />
    <div class="p-4 bg-white card-rounded lg:p-8">
      <div class="mx-auto max-w-screen-2xl">
        <UserData
          :headText="mahasiswaData?.mahasiswa?.nim || 'NIM Mahasiswa'"
          :bodyText="mahasiswaData?.mahasiswa?.name || 'Nama Mahasiswa'"
          :headText2="mahasiswaData?.kategori || 'Kategori Tugas Akhir'"
          :bodyText2="mahasiswaData?.judul_proposal || 'Judul Tugas Akhir'"
          :tahunAjaran="
            mahasiswaData?.tahun_ajaran || 'Tahun Ajaran Tugas Akhir'
          "
        />
        <div class="flex flex-col gap-4 mt-4">
          <div class="flex flex-col gap-2">
            <InputDropdown
              id="ketua-penguji"
              label="Ketua Penguji"
              placeholder="Pilih Dosen"
              :options="list_dosen"
              v-model="selectedKetuaPenguji"
            />
            <div v-if="selectedKetuaDosenData" class="flex gap-2 mb-2 sm:gap-4">
              <div class="flex gap-2 sm:gap-4">
                <!-- Icon Dosen -->
                <img
                  :src="DefaultAvatar"
                  alt=""
                  class="self-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                />

                <!-- Informasi Dosen -->
                <div class="self-center">
                  <h5
                    class="body4-bold sm:body2-bold lg:body1-bold text-primary"
                  >
                    {{ selectedKetuaDosenData.name }}
                  </h5>
                  <span class="body5 lg:body4"
                    >{{ selectedKetuaDosenData.nik }} | D-3 Teknik
                    Informatika</span
                  >
                </div>
              </div>
            </div>
            <InputText
              id="dosen-pembimbing"
              class="mt-2"
              label="Sekretaris Penguji"
              placeholder="Pilih Dosen"
              :modelValue="mahasiswaData?.dosen_pembimbing.name || ''"
              :disabled="true"
            />
            <div class="flex gap-2 mb-2 sm:gap-4">
              <div class="flex gap-2 sm:gap-4">
                <!-- Icon Dosen -->
                <img
                  :src="DefaultAvatar"
                  alt=""
                  class="self-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                />

                <!-- Informasi Dosen -->
                <div class="self-center">
                  <h5
                    class="body4-bold sm:body2-bold lg:body1-bold text-primary"
                  >
                    {{ mahasiswaData?.dosen_pembimbing.name }} (Dosen
                    Pembimbing)
                  </h5>
                  <span class="body5 lg:body4"
                    >{{ mahasiswaData?.dosen_pembimbing.nik }} | D-3 Teknik
                    Informatika
                  </span>
                </div>
              </div>
            </div>
            <InputDropdown
              id="penguji"
              class="mt-2"
              label="Penguji"
              placeholder="Pilih Dosen"
              :options="list_dosen"
              v-model="selectedPenguji"
            />
            <div
              v-if="selectedPengujiDosenData"
              class="flex gap-2 mb-2 sm:gap-4"
            >
              <div class="flex gap-2 sm:gap-4">
                <!-- Icon Dosen -->
                <img
                  :src="DefaultAvatar"
                  alt=""
                  class="self-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                />

                <!-- Informasi Dosen -->
                <div class="self-center">
                  <h5
                    class="body4-bold sm:body2-bold lg:body1-bold text-primary"
                  >
                    {{ selectedPengujiDosenData.name }}
                  </h5>
                  <span class="body5 lg:body4"
                    >{{ selectedPengujiDosenData.nik }} | D-3 Teknik
                    Informatika</span
                  >
                </div>
              </div>
            </div>
            <Button
              v-if="
                !mahasiswaData?.dosen_penguji ||
                mahasiswaData.dosen_penguji.length === 0
              "
              variant="primary"
              size="lg"
              class="self-end hidden w-fit sm:flex"
              :disabled="false"
              @click="handleSubmit"
            >
              Simpan
            </Button>
            <Button
              v-else
              variant="primary"
              size="lg"
              class="self-end hidden w-fit sm:flex"
              :disabled="false"
              @click="handleUpdate"
            >
              Update
            </Button>
            <Button
              v-if="
                !mahasiswaData?.dosen_penguji ||
                mahasiswaData.dosen_penguji.length === 0
              "
              variant="primary"
              size="md"
              class="self-end w-fit sm:hidden"
              :disabled="false"
              @click="handleSubmit"
            >
              Simpan
            </Button>
            <Button
              v-else
              variant="primary"
              size="md"
              class="self-end w-fit sm:hidden"
              :disabled="false"
              @click="handleUpdate"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
