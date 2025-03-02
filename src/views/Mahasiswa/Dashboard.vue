<template>
  <div class="p-4">
    <div class="bg-white shadow rounded-lg p-6 mb-4">
      <h1 class="text-2xl font-semibold text-gray-800">Dashboard Mahasiswa</h1>
      <div class="text-gray-600 mt-2 space-y-1">
        <p class="font-medium">{{ userData?.nim || "NIM tidak tersedia" }}</p>
        <p class="font-medium">{{ userData?.email }}</p>
        <p>Selamat datang, {{ userData?.name || "Mahasiswa" }}</p>
      </div>
    </div>
    <Logout />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Logout from "../../components/Mahasiswa/Logout.vue";
import { decryptData } from "../../services/encrypt";
import VueCookies from "vue-cookies";

const userData = ref(null);

onMounted(() => {
  const encryptedUserData = VueCookies.get("user_session");
  if (encryptedUserData) {
    userData.value = decryptData(encryptedUserData);
  }
});
</script>
