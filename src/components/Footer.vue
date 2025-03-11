<template>
  <footer class="bg-custom-footer">
    <div class="container mx-auto px-4 py-12 border-t border-b border-black-200">
      <div class="flex flex-wrap justify-between">
        <!-- Logo -->
        <div>
          <img
            src="/src/assets/images/d3ti-logo.png"
            alt="D3TI UNS Logo"
            class="h-24 w-auto"
          />
        </div>
        <!-- Website Links -->
        <div class="flex flex-col space-y-2 text-left">
          <p class="font-bold text-gray-800">Website Lain</p>
          <!-- Your social media links here -->
          <a
            href="https://d3ti.vokasi.uns.ac.id"
            class="text-gray-600 hover:text-blue-500 text-sm"
            >D3 TI UNS</a
          >
          <a
            href="https://vokasi.uns.ac.id"
            class="text-gray-600 hover:text-blue-500 text-sm"
            >SV UNS</a
          >
          <a
            href="https://uns.ac.id"
            class="text-gray-600 hover:text-blue-500 text-sm"
            >Universitas Sebelas Maret</a
          >
        </div>

        <!-- Website Links -->
        <div class="flex flex-col space-y-2 text-left">
          <p class="font-bold text-gray-800">Sosial Media</p>
          <!-- Your social media links here -->
          <a
            href="https://d3ti.vokasi.uns.ac.id"
            class="text-gray-600 hover:text-blue-500 text-sm"
            >Instagram</a
          >
          <a
            href="https://vokasi.uns.ac.id"
            class="text-gray-600 hover:text-blue-500 text-sm"
            >TikTok</a
          >
          <a
            href="https://uns.ac.id"
            class="text-gray-600 hover:text-blue-500 text-sm"
            >X</a
          >
        </div>
      </div>
    </div>
    <div>
      <div class="bg-custom-cp py-3">
        <div class="container mx-auto px-4 text-center text-black">
          <p class="text-sm">© {{ new Date().getFullYear() }} D3 Teknik Informatika UNS. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.bg-custom-footer {
  background-color: #F780521F;
}
.bg-custom-cp {
  background-color: white;
}
</style>