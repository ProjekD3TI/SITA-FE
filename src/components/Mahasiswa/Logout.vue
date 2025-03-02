<template>
  <button
    @click="handleLogout"
    class="text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
      />
    </svg>
    Logout
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";
import VueCookies from "vue-cookies";
import { useToast } from "vue-toastification";
import { authMahasiswa } from "../../services/authMahasiswa";

const router = useRouter();
const toast = useToast();
const { logout } = authMahasiswa();

const handleLogout = () => {
  try {
    logout();
    toast.success("Berhasil Logout!");
  } catch (error) {
    toast.error("Terjadi kesalahan saat logout.");
  }
};
</script>
