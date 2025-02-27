<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <!-- Judul -->
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Halaman Dummy</h1>
  
        <!-- Deskripsi -->
        <p class="text-gray-600 mb-6">
          Ini adalah halaman dummy yang digunakan sebagai placeholder atau untuk tujuan pengujian.
        </p>
  
        <!-- Gambar Dummy -->
        <img
          src="https://via.placeholder.com/400x200"
          alt="Dummy Image"
          class="w-full h-auto rounded-md mb-6"
        />
  
        <!-- Tombol Aksi -->
        <div class="flex justify-center space-x-4">
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Aksi 1
          </button>
          <button
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
          >
            Aksi 2
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DummyPage',
  };
  </script>
  
  <style scoped>
  /* Styling tambahan jika diperlukan */
  </style>