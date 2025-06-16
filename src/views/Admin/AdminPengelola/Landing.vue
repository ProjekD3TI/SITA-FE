<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Dashboard Pengelola</h1>
      </div>
      <div class="text-sm text-gray-600">
        <p>📅 Senin, 2 Juni 2025</p>
        <p>⏰ 10:45 WIB</p>
      </div>
    </header>

    <main class="p-6 space-y-6">
      <!-- Stats -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Ruang</p>
              <p class="text-3xl font-bold">48</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3"
                  stroke-width="2" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Ruang Tersedia</p>
              <p class="text-3xl font-bold text-green-600">32</p>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke-width="2" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Ruang Terpakai</p>
              <p class="text-3xl font-bold text-orange-600">14</p>
            </div>
            <div class="bg-orange-100 p-3 rounded-full">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17 9V7a4 4 0 00-8 0v2M5 12h14l-1 9H6l-1-9z" stroke-width="2" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Jadwal Hari Ini</p>
              <p class="text-3xl font-bold text-purple-600">28</p>
              <p class="text-xs text-gray-500">8 sedang berlangsung</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 7V3M16 7V3M3 11h18M5 19h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z" stroke-width="2" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Room Usage Chart -->
      <section class="bg-white p-6 rounded-2xl shadow border">
        <h2 class="text-lg font-semibold mb-4">Penggunaan Ruang (7 Hari)</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-sm">
            <span>Sen</span>
            <div class="w-full h-3 bg-gray-200 mx-3 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full w-4/5"></div>
            </div>
            <span>85%</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span>Sel</span>
            <div class="w-full h-3 bg-gray-200 mx-3 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full w-[92%]"></div>
            </div>
            <span>92%</span>
          </div>
          <!-- ...tambahkan Rabu sampai Minggu serupa -->
        </div>
      </section>

      <!-- Real-time Room Status -->
      <section class="bg-white p-6 rounded-2xl shadow border">
        <h2 class="text-lg font-semibold mb-4">Status Ruang</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <span class="w-3 h-3 bg-green-500 rounded-full"></span>
              <div>
                <p class="font-medium">Ruang A101</p>
                <p class="text-xs text-gray-500">Gedung A - Lantai 1</p>
              </div>
            </div>
            <div class="text-sm text-green-600">Tersedia</div>
          </div>
          <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <span class="w-3 h-3 bg-red-500 rounded-full"></span>
              <div>
                <p class="font-medium">Ruang B205</p>
                <p class="text-xs text-gray-500">Gedung B - Lantai 2</p>
              </div>
            </div>
            <div class="text-sm text-red-600">Terpakai</div>
          </div>
          <!-- ...tambahkan ruang lainnya jika diperlukan -->
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button class="p-5 bg-blue-50 hover:bg-blue-100 rounded-xl shadow flex flex-col items-start">
          <p class="text-blue-700 font-semibold">+ Tambah Ruang</p>
          <p class="text-xs text-gray-500">Daftarkan ruang baru</p>
        </button>
        <button class="p-5 bg-green-50 hover:bg-green-100 rounded-xl shadow flex flex-col items-start">
          <p class="text-green-700 font-semibold">📅 Buat Jadwal</p>
          <p class="text-xs text-gray-500">Atur jadwal penggunaan</p>
        </button>
        <button class="p-5 bg-purple-50 hover:bg-purple-100 rounded-xl shadow flex flex-col items-start">
          <p class="text-purple-700 font-semibold">🔐 Kelola RFID</p>
          <p class="text-xs text-gray-500">Atur akses pengguna</p>
        </button>
        <button class="p-5 bg-orange-50 hover:bg-orange-100 rounded-xl shadow flex flex-col items-start">
          <p class="text-orange-700 font-semibold">📊 Laporan</p>
          <p class="text-xs text-gray-500">Lihat statistik</p>
        </button>
      </section>
    </main>
  </div>
</template>
