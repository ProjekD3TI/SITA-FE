<template>
  <div class="loading-center">
  <div class="loader5"><br>
    <!-- <span class="flex justify-center mt-1 text-center body3 loading-text">Loading</span> -->
  </div>
    <!-- <div class="spinner-gradient"></div>
    <span class="loading-text">
      Loading
      <span class="dot dot1">.</span>
      <span class="dot dot2">.</span>
      <span class="dot dot3">.</span>
    </span> -->
  </div>
</template>


<style>
.loader5 {
  height: 30px;
  aspect-ratio: 2.5;
  /* Ubah gradien untuk menggunakan warna biru dan oranye */
  --_g1: no-repeat radial-gradient(farthest-side,#00A2EA 90%,#0000);
  --_g2: no-repeat radial-gradient(farthest-side,#F78052 90%,#0000);
  /* Alternatif gradient untuk dot 1 & 3 biru dan dot 2 & 4 oranye */
  background:
    var(--_g1), /* Dot 1: Biru */
    var(--_g2), /* Dot 2: Oranye */
    var(--_g1), /* Dot 3: Biru */
    var(--_g2); /* Dot 4: Oranye */
  background-size: 20% 50%;
  animation: l43 1s infinite linear; 
}

@keyframes l43 {
  0%     {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 50% ,calc(2*100%/3) 50% ,calc(3*100%/3) 50% }
  16.67% {background-position: calc(0*100%/3) 0   ,calc(1*100%/3) 50% ,calc(2*100%/3) 50% ,calc(3*100%/3) 50% }
  33.33% {background-position: calc(0*100%/3) 100%,calc(1*100%/3) 0   ,calc(2*100%/3) 50% ,calc(3*100%/3) 50% }
  50%    {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 100%,calc(2*100%/3) 0   ,calc(3*100%/3) 50% }
  66.67% {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 50% ,calc(2*100%/3) 100%,calc(3*100%/3) 0   }
  83.33% {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 50% ,calc(2*100%/3) 50% ,calc(3*100%/3) 100%}
  100%   {background-position: calc(0*100%/3) 50% ,calc(1*100%/3) 50% ,calc(2*100%/3) 50% ,calc(3*100%/3) 50% }
}

.loader {
  width: 120px;
  height: 20px;
  -webkit-mask: linear-gradient(90deg, #000 70%, #0000 0) left/20% 100%;
  background:
    linear-gradient(#F78052 0 0) left -25% top 0 /20% 100% no-repeat
    #00A2EA; /* Warna oranye sebagai background */
  animation: l7 1s infinite steps(6);
}

@keyframes l7 {
  100% {background-position: right -25% top 0}
}

.loading-center {
  /* Hapus position: fixed dan inset: 0 */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  /* background: rgba(255,255,255,0.7); jika ingin overlay di parent, aktifkan ini */
}

/* Teks Loading dengan efek breathing */
.loading-text {
  display: block;
  text-align: center;
  animation: textBlinking 1s infinite ease-in-out;
}

/* Animasi efek breathing untuk teks */
/* @keyframes textBreathing {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
} */

/* Efek alternatif: efek blinking teks */
@keyframes textBlinking {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}
</style>