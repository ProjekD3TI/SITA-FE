<template>
  <div class="loading-center">
    <div class="spinner-gradient"></div>
    <span class="loading-text">
      Loading
      <span class="dot dot1">.</span>
      <span class="dot dot2">.</span>
      <span class="dot dot3">.</span>
    </span>
  </div>
</template>

<style>
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

.spinner-gradient {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  position: relative;
  animation: spin 1.8s linear infinite;
}

.spinner-gradient::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(from 0deg,
      transparent 0%,
      #00A2EA 100%);
  mask: radial-gradient(transparent 62%, black 65%);
  -webkit-mask: radial-gradient(transparent 62%, black 65%);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.loading-text .dot {
  opacity: 0;
  animation: blink 1.8s infinite;
}

.loading-text .dot1 {
  margin-left: 2px;
  margin-right: 2px;
  animation-delay: 0.2s;
}

.loading-text .dot2 {
  margin-right: 2px;
  animation-delay: 0.4s;
}

.loading-text .dot3 {
  margin-right: 2px;
  animation-delay: 0.6s;
}

@keyframes blink {

  0%,
  80%,
  100% {
    opacity: 0;
  }

  20%,
  60% {
    opacity: 1;
  }
}
</style>