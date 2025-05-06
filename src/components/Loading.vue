<template>
    <div class="flex justify-center my-8">
      <div class="spinner-gradient"></div>
    </div>
</template>
<style>
/* Loading Spinner dengan Border Gradient */
.spinner-gradient {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  position: relative;
  animation: spin 1s linear infinite;
}

.spinner-gradient::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    #00A2EA 100%
  );
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
</style>