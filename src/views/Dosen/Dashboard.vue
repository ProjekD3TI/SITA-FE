<template>
  <div class="p-6">
    <div class="bg-white shadow rounded-lg p-6 mb-4">
      <h1 class="text-2xl font-semibold text-gray-800">Dashboard Dosen</h1>
      <div class="text-gray-600 mt-2 space-y-1">
        <p class="font-medium">
          NIK: {{ userData?.nik || "NIK tidak tersedia" }}
        </p>
        <p class="font-medium">{{ userData?.email }}</p>
        <p>Selamat datang, {{ userData?.name || "Dosen" }}</p>
        <p class="font-medium">
          Nomor Telepon: {{ userData?.no_telp || "Nomor telepon tidak tersedia" }}
        </p>
        <p class="mt-2">
          Jabatan saat ini: {{ userData?.jabatan || "Tidak ada jabatan" }}
        </p>
        
        <!-- Statistik Laporan -->
        <div class="mt-4 pt-3 border-t border-gray-200">
          <h2 class="font-semibold text-lg text-gray-700 mb-2">Statistik Laporan Saya</h2>
          <div v-if="isLoadingLaporan" class="text-sm text-gray-500">
            Memuat data laporan...
          </div>
          <div v-else class="grid grid-cols-2 gap-4">
            <div class="bg-blue-50 p-3 rounded-md">
              <p class="text-sm text-blue-700">Total Laporan Kejadian Saya</p>
              <p class="text-2xl font-bold text-blue-800">{{ jumlahLaporan }}</p>
            </div>
            <div class="bg-red-50 p-3 rounded-md">
              <p class="text-sm text-red-700">Total Laporan Kekerasan Saya</p>
              <p class="text-2xl font-bold text-red-800">{{ jumlahLaporanKekerasan }}</p>
            </div>
            <div class="col-span-2 bg-purple-50 p-3 rounded-md">
              <p class="text-sm text-purple-700">Total Semua Laporan Saya</p>
              <p class="text-2xl font-bold text-purple-800">{{ jumlahLaporan + jumlahLaporanKekerasan }}</p>
            </div>
          </div>
        </div>
        
        <!-- Chart -->
        <div class="mt-6">
          <h2 class="font-semibold text-lg text-gray-700 mb-4">Visualisasi Laporan</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Doughnut Chart -->
            <div class="bg-white p-4 rounded-lg shadow">
              <h3 class="text-md font-medium text-gray-600 mb-3">Perbandingan Jenis Laporan</h3>
              <div class="h-64">
                <canvas ref="doughnutChart"></canvas>
                <div v-if="isLoadingLaporan" class="flex h-full items-center justify-center">
                  <p class="text-gray-500">Memuat chart...</p>
                </div>
              </div>
            </div>
            
            <!-- Bar Chart -->
            <div class="bg-white p-4 rounded-lg shadow">
              <h3 class="text-md font-medium text-gray-600 mb-3">Statistik Laporan per Bulan</h3>
              <div class="h-64">
                <canvas ref="barChart"></canvas>
                <div v-if="isLoadingLaporan" class="flex h-full items-center justify-center">
                  <p class="text-gray-500">Memuat chart...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { decryptData } from "../../services/encrypt";
import VueCookies from "vue-cookies";
import axios from "axios";
import Chart from 'chart.js/auto';

const userData = ref(null);
const jumlahLaporan = ref(0);
const jumlahLaporanKekerasan = ref(0);
const isLoadingLaporan = ref(true);
const laporanUmumByMonth = ref(Array(12).fill(0));
const laporanKekerasanByMonth = ref(Array(12).fill(0));

// References untuk chart
const doughnutChart = ref(null);
const barChart = ref(null);

// Instans chart (untuk cleanup nanti)
let doughnutChartInstance = null;
let barChartInstance = null;

// Helper function untuk memeriksa apakah laporan dimiliki oleh dosen yang login
const isLaporanMatchingDosen = (laporan, dosenName) => {
  if (!laporan || !dosenName) return false;
  
  // Field yang mungkin berisi nama pelapor
  const possibleReporterFields = [
    'nama_pelapor',
    'pelapor',
    'nama_dosen',
    'dosen_nama',
    'dosen',
    'reporter',
    'reported_by',
    'nama',
    'name'
  ];
  
  // Cek apakah ada field yang cocok dengan nama dosen
  for (const field of possibleReporterFields) {
    if (
      laporan[field] && 
      typeof laporan[field] === 'string' &&
      laporan[field].toLowerCase() === dosenName.toLowerCase()
    ) {
      return true;
    }
  }
  
  return false;
};

// Fungsi untuk mengambil dan memproses data laporan
const fetchLaporan = async () => {
  try {
    if (!userData.value) {
      console.error('Data user tidak tersedia');
      return;
    }
    
    const dosenName = userData.value.name;
    console.log('User data:', userData.value);
    console.log('Filtering laporan for dosen:', dosenName);
    
    // Ambil data laporan umum
    // const responseLaporan = await axios.get("http://pelaporan-d3ti.my.id/api/laporan");
    const responseLaporan = await axios.get("https://v3422040.mhs.d3tiuns.com/api/laporan");
    console.log('Response Laporan:', responseLaporan.data);
    
    if (responseLaporan.data && Array.isArray(responseLaporan.data)) {
      // Log contoh laporan untuk memeriksa struktur
      if (responseLaporan.data.length > 0) {
        console.log('Contoh struktur laporan:', responseLaporan.data[0]);
        
        // Coba deteksi field yang mungkin berisi informasi pelapor
        const sampleLaporan = responseLaporan.data[0];
        console.log('Field di laporan yang mungkin berisi informasi pelapor:');
        ['nama_pelapor', 'pelapor', 'nama_dosen', 'dosen_nama', 'dosen', 'reporter', 'reported_by', 'nama', 'name'].forEach(field => {
          if (sampleLaporan[field]) {
            console.log(`- ${field}: ${sampleLaporan[field]}`);
          }
        });
      }
      
      // Filter laporan berdasarkan nama dosen pelapor
      const filteredLaporan = responseLaporan.data.filter(laporan => 
        isLaporanMatchingDosen(laporan, dosenName)
      );
      
      console.log(`Filtered Laporan Kejadian for ${dosenName}: ${filteredLaporan.length} dari ${responseLaporan.data.length}`);
      jumlahLaporan.value = filteredLaporan.length;
      
      // Hitung jumlah laporan per bulan
      const monthData = Array(12).fill(0);
      filteredLaporan.forEach(laporan => {
        try {
          // Coba berbagai kemungkinan field untuk tanggal
          const dateStr = laporan.created_at || laporan.tanggal || laporan.tgl_lapor || laporan.date;
          if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              const month = date.getMonth();
              if (month >= 0 && month < 12) {
                monthData[month]++;
              }
            }
          }
        } catch (e) {
          console.error("Error processing date:", e, laporan);
        }
      });
      
      laporanUmumByMonth.value = monthData;
    }
    
    // Ambil data laporan kekerasan
    // const responseLaporanKekerasan = await axios.get("http://pelaporan-d3ti.my.id/api/laporan_kekerasan");
    const responseLaporanKekerasan = await axios.get("https://v3422040.mhs.d3tiuns.com/api/laporan_kekerasan");
    console.log('Response Laporan Kekerasan:', responseLaporanKekerasan.data);
    
    if (responseLaporanKekerasan.data && Array.isArray(responseLaporanKekerasan.data)) {
      // Log contoh laporan untuk memeriksa struktur
      if (responseLaporanKekerasan.data.length > 0) {
        console.log('Contoh struktur laporan kekerasan:', responseLaporanKekerasan.data[0]);
        
        // Coba deteksi field yang mungkin berisi informasi pelapor
        const sampleLaporan = responseLaporanKekerasan.data[0];
        console.log('Field di laporan kekerasan yang mungkin berisi informasi pelapor:');
        ['nama_pelapor', 'pelapor', 'nama_dosen', 'dosen_nama', 'dosen', 'reporter', 'reported_by', 'nama', 'name'].forEach(field => {
          if (sampleLaporan[field]) {
            console.log(`- ${field}: ${sampleLaporan[field]}`);
          }
        });
      }
      
      // Filter laporan kekerasan berdasarkan nama dosen pelapor
      const filteredLaporanKekerasan = responseLaporanKekerasan.data.filter(laporan => 
        isLaporanMatchingDosen(laporan, dosenName)
      );
      
      console.log(`Filtered Laporan Kekerasan for ${dosenName}: ${filteredLaporanKekerasan.length} dari ${responseLaporanKekerasan.data.length}`);
      jumlahLaporanKekerasan.value = filteredLaporanKekerasan.length;
      
      // Hitung jumlah laporan kekerasan per bulan
      const monthData = Array(12).fill(0);
      filteredLaporanKekerasan.forEach(laporan => {
        try {
          const dateStr = laporan.created_at || laporan.tanggal || laporan.tgl_lapor || laporan.date;
          if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              const month = date.getMonth();
              if (month >= 0 && month < 12) {
                monthData[month]++;
              }
            }
          }
        } catch (e) {
          console.error("Error processing date:", e, laporan);
        }
      });
      
      laporanKekerasanByMonth.value = monthData;
    }
    
    console.log('Total laporan kejadian untuk dosen:', jumlahLaporan.value);
    console.log('Total laporan kekerasan untuk dosen:', jumlahLaporanKekerasan.value);
    
    // Jika tidak ada data, tambahkan log
    if (jumlahLaporan.value === 0 && jumlahLaporanKekerasan.value === 0) {
      console.warn(`Tidak ada laporan yang ditemukan untuk dosen: ${dosenName}`);
      console.log('Kemungkinan penyebab:');
      console.log('1. Dosen belum membuat laporan');
      console.log('2. Nama dosen (pelapor) dalam data tidak cocok dengan nama login');
      console.log('3. Format data tidak konsisten');
    }
    
  } catch (error) {
    console.error("Error fetching laporan data:", error);
    // Jika terjadi error saat fetching data, set nilai default
    jumlahLaporan.value = 0;
    jumlahLaporanKekerasan.value = 0;
  } finally {
    isLoadingLaporan.value = false;
    // Render charts setelah data tersedia
    renderCharts();
  }
};

// Fungsi untuk menggambar charts
const renderCharts = () => {
  // Pastikan DOM elements sudah ada
  if (!doughnutChart.value || !barChart.value) {
    console.error('Chart canvas elements not found');
    return;
  }
  
  // Bersihkan chart lama jika ada
  if (doughnutChartInstance) {
    doughnutChartInstance.destroy();
  }
  
  if (barChartInstance) {
    barChartInstance.destroy();
  }
  
  // Buat doughnut chart
  const doughnutCtx = doughnutChart.value.getContext('2d');
  doughnutChartInstance = new Chart(doughnutCtx, {
    type: 'doughnut',
    data: {
      labels: ['Laporan Kejadian', 'Laporan Kekerasan'],
      datasets: [{
        label: 'Jumlah Laporan',
        data: [jumlahLaporan.value, jumlahLaporanKekerasan.value],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
  
  // Buat bar chart
  const barCtx = barChart.value.getContext('2d');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  
  barChartInstance = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Laporan Kejadian',
          data: laporanUmumByMonth.value,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Laporan Kekerasan',
          data: laporanKekerasanByMonth.value,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Laporan per Bulan'
        }
      }
    }
  });
};

// Inisialisasi
onMounted(() => {
  const encryptedUserData = VueCookies.get("user_session");
  if (encryptedUserData) {
    userData.value = decryptData(encryptedUserData);
    // Panggil fungsi untuk mengambil data laporan setelah user data tersedia
    fetchLaporan();
  } else {
    console.error("User session data not found");
    isLoadingLaporan.value = false;
  }
});

// Bersihkan instans chart saat komponen dihapus
onUnmounted(() => {
  if (doughnutChartInstance) {
    doughnutChartInstance.destroy();
  }
  
  if (barChartInstance) {
    barChartInstance.destroy();
  }
});
</script>