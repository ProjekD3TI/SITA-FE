<template>
  <div class="h-screen flex flex-col bg-cover bg-center relative" style="background-image: url('/src/assets/images/background.jpg');">
    <!-- Overlay untuk meningkatkan kontras -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Header -->
    <Header />

    <!-- Landing Page Content -->
    <div class="flex-grow flex items-center justify-center">
      <div class="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
        <!-- Teks di sebelah kiri -->
        <div class="md:w-1/2 text-left mb-8 md:mb-0">
          <h1 class="text-4xl font-bold mb-4 text-white">Portal D3 Teknik Informatika UNS</h1>
          <p class="text-lg text-white">
            Selamat datang di portal resmi program studi D3 Teknik Informatika Universitas Sebelas Maret.
          </p>
        </div>

        <!-- Gambar di sebelah kanan dengan animasi -->
        <div class="md:w-1/2 relative">
          <img
            src="/src/assets/images/5514.jpg"
            alt="D3 Teknik Informatika UNS"
            class="w-full rounded-lg shadow-lg animate-fade-in"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'AppComponent',
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
/* Animasi fade-in */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-in-out;
}

/* Styling tambahan */
.container {
  max-width: 1200px;
}

/* Pastikan overlay berada di atas background */
.relative {
  position: relative;
}
</style>