<template>
  <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Tambah Ruang</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nama Ruang -->
              <div class="space-y-2">
                  <label class="text-sm font-medium leading-none">
                      Nama Ruang <span class="text-red-500">*</span>
                  </label>
                  <input v-model="formData.nama_ruang" type="text"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Masukkan nama ruang" />
                  <p v-if="errors.nama_ruang" class="text-sm text-red-500">
                      {{ errors.nama_ruang[0] }}
                  </p>
              </div>

              <!-- Kapasitas -->
              <div class="space-y-2">
                  <label class="text-sm font-medium leading-none">
                      Kapasitas <span class="text-red-500">*</span>
                  </label>
                  <input v-model="formData.kapasitas" type="number" min="1"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Masukkan kapasitas ruang" />
                  <p v-if="errors.kapasitas" class="text-sm text-red-500">
                      {{ errors.kapasitas[0] }}
                  </p>
              </div>

              <!-- Gedung -->
              <div class="space-y-2">
                  <label class="text-sm font-medium leading-none">
                      Gedung <span class="text-red-500">*</span>
                  </label>
                  <select v-model="formData.id_gedung" @change="onGedungChange"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="">Pilih Gedung</option>
                      <option v-for="gedung in gedungList" :key="gedung.id_gedung" :value="gedung.id_gedung">
                          {{ gedung.nama_gedung }}
                      </option>
                  </select>
                  <p v-if="errors.id_gedung" class="text-sm text-red-500">
                      {{ errors.id_gedung[0] }}
                  </p>
              </div>

              <!-- Lantai -->
              <div class="space-y-2">
                  <label class="text-sm font-medium leading-none">
                      Lantai <span class="text-red-500">*</span>
                  </label>
                  <select v-model="formData.id_lantai" :disabled="!formData.id_gedung || loadingLantai"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50">
                      <option value="">{{ loadingLantai ? 'Loading...' : 'Pilih Lantai' }}</option>
                      <option v-for="lantai in lantaiList" :key="lantai.id_lantai" :value="lantai.id_lantai">
                          {{ lantai.nama_lantai }}
                      </option>
                  </select>
                  <p v-if="errors.id_lantai" class="text-sm text-red-500">
                      {{ errors.id_lantai[0] }}
                  </p>
              </div>

              <!-- Dimensi -->
              <div class="space-y-2">
                  <label class="text-sm font-medium leading-none">
                      Dimensi <span class="text-red-500">*</span>
                  </label>
                  <input v-model="formData.dimensi" type="text"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Contoh: 10m x 8m" />
                  <p v-if="errors.dimensi" class="text-sm text-red-500">
                      {{ errors.dimensi[0] }}
                  </p>
              </div>
          </div>

          <!-- Fasilitas -->
          <div class="space-y-2">
              <label class="text-sm font-medium leading-none">
                  Fasilitas <span class="text-red-500">*</span>
              </label>
              <textarea v-model="formData.fasilitas" rows="4"
                  class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Masukkan fasilitas yang tersedia di ruang ini"></textarea>
              <p v-if="errors.fasilitas" class="text-sm text-red-500">
                  {{ errors.fasilitas[0] }}
              </p>
          </div>

          <!-- Upload Foto -->
          <div class="space-y-2">
              <label class="text-sm font-medium leading-none">
                  Foto Ruang <span class="text-red-500">*</span>
              </label>
              <input ref="fileInput" type="file" multiple accept="image/*" @change="handleFileChange"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              <p class="text-xs text-gray-500">Upload multiple foto ruang (JPG, PNG, GIF, SVG)</p>
              <p v-if="errors.foto_ruang" class="text-sm text-red-500">
                  {{ errors.foto_ruang[0] }}
              </p>

              <!-- Preview Images -->
              <div v-if="previewImages.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div v-for="(image, index) in previewImages" :key="index" class="relative">
                      <img :src="image" :alt="`Preview ${index + 1}`" 
                          class="w-full h-24 object-cover rounded-md border">
                      <button type="button" @click="removeImage(index)"
                          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                          ×
                      </button>
                  </div>
              </div>
          </div>

          <!-- Preview Card -->
          <div v-if="formData.nama_ruang || formData.kapasitas" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-blue-900 mb-2">Preview Ruang:</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Nama:</strong> {{ formData.nama_ruang || 'Belum diisi' }}</div>
                  <div><strong>Kapasitas:</strong> {{ formData.kapasitas || 'Belum diisi' }} orang</div>
                  <div><strong>Gedung:</strong> {{ getGedungName() || 'Belum dipilih' }}</div>
                  <div><strong>Lantai:</strong> {{ getLantaiName() || 'Belum dipilih' }}</div>
                  <div><strong>Dimensi:</strong> {{ formData.dimensi || 'Belum diisi' }}</div>
                  <div class="col-span-2"><strong>Fasilitas:</strong> {{ formData.fasilitas || 'Belum diisi' }}</div>
              </div>
          </div>

          <div class="flex space-x-2">
              <button type="submit"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  :disabled="isSubmitting">
                  {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
              </button>
              <button type="button" @click="$router.go(-1)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2">
                  Batal
              </button>
          </div>
      </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const router = useRouter();
const toast = useToast();
const fileInput = ref(null);
const isSubmitting = ref(false);
const loadingLantai = ref(false);
const gedungList = ref([]);
const lantaiList = ref([]);
const previewImages = ref([]);
const selectedFiles = ref([]);

const formData = reactive({
  nama_ruang: "",
  kapasitas: "",
  fasilitas: "",
  dimensi: "",
  id_gedung: "",
  id_lantai: "",
});

const errors = reactive({});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const fetchGedungList = async () => {
  try {
      setupAxios();
      const response = await axios.get("/api/admin_pengelola/gedung");
      gedungList.value = response.data.data || [];
  } catch (error) {
      toast.error("Gagal memuat data gedung");
  }
};

const fetchLantaiByGedung = async (id_gedung) => {
  try {
      loadingLantai.value = true;
      setupAxios();
      const response = await axios.get(`/api/lantai/by-gedung/${id_gedung}`);
      lantaiList.value = response.data.data || [];
  } catch (error) {
      toast.error("Gagal memuat data lantai");
      lantaiList.value = [];
  } finally {
      loadingLantai.value = false;
  }
};

const onGedungChange = () => {
  formData.id_lantai = "";
  lantaiList.value = [];
  if (formData.id_gedung) {
      fetchLantaiByGedung(formData.id_gedung);
  }
};

const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  selectedFiles.value = files;
  
  // Create preview images
  previewImages.value = [];
  files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
          previewImages.value.push(e.target.result);
      };
      reader.readAsDataURL(file);
  });
};

const removeImage = (index) => {
  previewImages.value.splice(index, 1);
  selectedFiles.value.splice(index, 1);
  
  // Update file input
  const dt = new DataTransfer();
  selectedFiles.value.forEach(file => dt.items.add(file));
  fileInput.value.files = dt.files;
};

const getGedungName = () => {
  const gedung = gedungList.value.find(g => g.id_gedung == formData.id_gedung);
  return gedung ? gedung.nama_gedung : '';
};

const getLantaiName = () => {
  const lantai = lantaiList.value.find(l => l.id_lantai == formData.id_lantai);
  return lantai ? lantai.nama_lantai : '';
};

const handleSubmit = async () => {
  try {
      isSubmitting.value = true;
      setupAxios();

      Object.keys(errors).forEach((key) => delete errors[key]);

      const formDataToSend = new FormData();
      formDataToSend.append('nama_ruang', formData.nama_ruang);
      formDataToSend.append('kapasitas', formData.kapasitas);
      formDataToSend.append('fasilitas', formData.fasilitas);
      formDataToSend.append('dimensi', formData.dimensi);
      formDataToSend.append('id_gedung', formData.id_gedung);
      formDataToSend.append('id_lantai', formData.id_lantai);

      // Append files
      selectedFiles.value.forEach((file, index) => {
          formDataToSend.append(`foto_ruang[${index}]`, file);
      });

      const response = await axios.post(
          "/api/admin_pengelola/ruang/create",
          formDataToSend,
          {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          }
      );

      toast.success(response.data.message || "Ruang berhasil ditambahkan");
      router.push("/admin-pengelola/ruang");
  } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
          if (error.response.data.errors) {
              Object.assign(errors, error.response.data.errors);
          } else if (typeof error.response.data === "object") {
              Object.assign(errors, error.response.data);
          }
          toast.error(error.response.data.message || "Validasi gagal");
      } else if (error.response?.status === 401) {
          toast.error("Sesi anda telah berakhir. Silakan login kembali.");
          router.push("/login-admin");
      } else {
          toast.error(error.response?.data?.message || "Gagal menambahkan ruang");
      }
  } finally {
      isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchGedungList();
});
</script>
