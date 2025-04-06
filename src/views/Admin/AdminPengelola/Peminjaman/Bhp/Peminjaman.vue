<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Create Peminjaman BHP</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          BHP
        </label>
        <div class="space-y-1">
          <SearchableSelect
            v-model="formData.id_bhp"
            :options="bhpList"
            value-key="id_bhp"
            label-key="nama_bhp"
            placeholder="Pilih BHP"
            @update:model-value="updateSelectedBhp"
          />
          <p v-if="selectedBhp" class="text-sm text-gray-600">
            Stok tersedia: {{ selectedBhp.kondisi_bagus }}
          </p>
        </div>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tipe Peminjam
        </label>
        <select
          v-model="formData.tipe_peminjam"
          placeholder="Pilih Tipe Peminjam"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="mahasiswa">Mahasiswa</option>
          <option value="dosen">Dosen</option>
        </select>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Peminjam
        </label>
        <SearchableSelect
          v-model="formData.id_peminjam"
          :options="
            formData.tipe_peminjam === 'mahasiswa' ? mahasiswaList : dosenList
          "
          value-key="id"
          label-key="name"
          placeholder="Pilih Peminjam"
          :disabled="!formData.tipe_peminjam"
        />
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Kegunaan
        </label>
        <textarea
          v-model="formData.kegunaan"
          class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        ></textarea>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tanggal Pinjam
        </label>
        <input
          v-model="formData.tanggal_pinjam"
          type="date"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Jumlah Penggunaan
        </label>
        <input
          v-model="formData.jumlah_penggunaan"
          type="number"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span></span>
      </div>

      <div class="flex space-x-2">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Update
        </button>
        <button
          type="button"
          @click="$router.go(-1)"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import SearchableSelect from "../../../../../components/SearchableSelect.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const id = route.params.id;

const formData = ref({
  id_bhp: "",
  id_peminjam: "",
  tipe_peminjam: "",
  kegunaan: "",
  tanggal_pinjam: "",
  jumlah_penggunaan: "",
});

const bhpList = ref([]);
const mahasiswaList = ref([]);
const dosenList = ref([]);
const selectedBhp = ref(null);
const showStockError = ref(false);

const updateSelectedBhp = (bhpId) => {
  selectedBhp.value = bhpList.value.find((bhp) => bhp.id_bhp === bhpId);
};

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

watch(
  () => formData.value.tipe_peminjam,
  (newValue) => {
    formData.value.id_peminjam = "";
  },
  () => formData.value.jumlah_penggunaan,
  (newValue) => {
    if (selectedBhp.value) {
      showStockError.value =
        parseInt(newValue) > selectedBhp.value.kondisi_bagus;
    }
  }
);

const fetchBhp = async () => {
  try {
    setupAxios();
    const response = await axios.get("/api/admin_pengelola/bhp");
    bhpList.value = response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    }
  }
};

const fetchMahasiswaAndDosen = async () => {
  try {
    setupAxios();
    const [mahasiswaResponse, dosenResponse] = await Promise.all([
      axios.get("/api/admin_pengelola/mahasiswa"),
      axios.get("/api/admin_pengelola/dosen"),
    ]);

    mahasiswaList.value = mahasiswaResponse.data.data;
    dosenList.value = dosenResponse.data.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    }
  }
};

onMounted(async () => {
  setupAxios();
  await fetchMahasiswaAndDosen();
  await fetchBhp();
});

const handleSubmit = async () => {
  try {
    setupAxios();
    const response = await axios.post(
      `/api/admin_pengelola/peminjaman_bhp/create`,
      formData.value
    );

    toast.success(response.data.message || "Peminjaman BHP berhasil dibuat");
    router.push("/admin-pengelola/peminjaman-bhp");
  } catch (error) {
    console.error("Error creating peminjaman:", error);

    if (showStockError.value) {
      toast.error("Jumlah penggunaan melebihi stok tersedia");
      return;
    }
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else if (error.response?.status === 422) {
      toast.error(error.response.data.message || "Validasi gagal");
    } else {
      toast.error(
        error.response?.data?.message || "Gagal membuat peminjaman BHP"
      );
    }
  }
};
</script>
