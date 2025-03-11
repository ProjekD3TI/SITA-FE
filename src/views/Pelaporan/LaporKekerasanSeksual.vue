<template>
  <div>
    <Header />
    <div class="container mx-auto px-4 py-8 mt-16">
      <div class="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-6">Laporan Kekerasan Seksual</h2>

        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div>
              <!-- Judul/Nama Laporan -->
              <div class="mb-4">
                <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Judul Laporan</label>
                <input
                  type="text"
                  id="title"
                  v-model="report.title"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <!-- Kategori -->
              <div class="mb-4">
                <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  id="category"
                  v-model="report.category"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="pelecehan_verbal">Pelecehan Verbal</option>
                  <option value="pelecehan_fisik">Pelecehan Fisik</option>
                  <option value="pelecehan_online">Pelecehan Online</option>
                  <option value="intimidasi_seksual">Intimidasi Seksual</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <!-- Bukti Laporan (File Input) -->
              <div class="mb-4">
                <label for="evidence" class="block text-sm font-medium text-gray-700 mb-1">Bukti Laporan (Foto)</label>
                <input
                  type="file"
                  id="evidence"
                  @change="handleFileUpload"
                  accept="image/*"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <p class="text-xs text-gray-500 mt-1">Format yang didukung: JPG, PNG, JPEG (max 5MB)</p>
              </div>

              <!-- Deskripsi Laporan -->
              <div class="mb-4">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Laporan</label>
                <textarea
                  id="description"
                  v-model="report.description"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                ></textarea>
              </div>
            </div>

            <!-- Right Column -->
            <div>
              <!-- Informasi Pelapor -->
              <div class="mb-4">
                <label for="reporterName" class="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
                <input
                  type="text"
                  id="reporterName"
                  v-model="report.reporterName"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="nim" class="block text-sm font-medium text-gray-700 mb-1">NIM Pelapor</label>
                <input
                  type="text"
                  id="nim"
                  v-model="report.nim"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Nomor HP Pelapor</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="report.phone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="incidentDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Kejadian</label>
                <input
                  type="date"
                  id="incidentDate"
                  v-model="report.incidentDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <!-- Tombol Kirim -->
              <div class="mt-6">
                <button
                  type="submit"
                  class="w-full px-6 py-3 bg-[#E53935] text-white rounded-md hover:bg-red-700 transition duration-300 font-medium"
                >
                  Kirim Laporan
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "../../components/Header.vue";
import Footer from "../../components/Footer.vue";

export default {
  name: 'LaporKekerasanSeksual',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      report: {
        title: '',
        category: '',
        description: '',
        reporterName: '',
        nim: '',
        phone: '',
        incidentDate: '',
        evidenceFile: null
      }
    };
  },
  methods: {
    handleFileUpload(event) {
      this.report.evidenceFile = event.target.files[0];
    },
    submitForm() {
      // Handle form submission here
      console.log('Form submitted:', this.report);
      // Add API call or other logic to submit the report
      alert('Laporan berhasil dikirim!');
      this.resetForm();
    },
    resetForm() {
      this.report = {
        title: '',
        category: '',
        description: '',
        reporterName: '',
        nim: '',
        phone: '',
        incidentDate: '',
        evidenceFile: null
      };
      // Reset file input
      document.getElementById('evidence').value = '';
    }
  }
};
</script>

<style scoped>
/* Custom styling */
</style>