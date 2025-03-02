<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Edit Profile</h2>

    <div
      v-if="successMessage"
      class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
    >
      {{ successMessage }}
    </div>

    <form @submit.prevent="updateProfile">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
          Nama
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Nama Lengkap"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="no_telp">
          Nomor Telepon
        </label>
        <input
          id="no_telp"
          v-model="form.no_telp"
          type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Nomor Telepon"
        />
      </div>

      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="password"
        >
          Change Password
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Password"
        />
        <small class="text-red-500"
          >*Kosongkan Password jika tidak ingin merubah</small
        >
      </div>

      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Menyimpan..." : "Simpan Perubahan" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import VueCookies from "vue-cookies";
import { useToast } from "vue-toastification";
import { encryptData, decryptData } from "../../services/encrypt";

const form = ref({
  name: "",
  no_telp: "",
  password: "",
});

const successMessage = ref("");
const isSubmitting = ref(false);
const toast = useToast();

onMounted(() => {
  fetchUserData();
});

const fetchUserData = () => {
  try {
    const encryptedUserData = VueCookies.get("user_session");
    if (encryptedUserData) {
      const userData = decryptData(encryptedUserData);
      if (userData) {
        form.value.name = userData.name || "";
        form.value.no_telp = userData.no_telp || "";
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const updateProfile = async () => {
  isSubmitting.value = true;

  try {
    const updateData = {};
    if (form.value.name) updateData.name = form.value.name;
    if (form.value.no_telp) updateData.no_telp = form.value.no_telp;
    if (form.value.password) updateData.password = form.value.password;

    const token = VueCookies.get("auth_token");

    const response = await axios.put(
      "/api/mahasiswa/profile/edit",
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      toast.success(response.data.message || "Profile berhasil diperbarui");

      if (form.value.name) {
        updateUserSession(form.value.name);
      }

      form.value.password = "";
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error(
      error.response?.data?.message ||
        "Terjadi kesalahan saat memperbarui profile"
    );
  } finally {
    isSubmitting.value = false;
  }
};

const updateUserSession = (newName) => {
  try {
    const encryptedUserData = VueCookies.get("user_session");
    if (encryptedUserData) {
      const userData = decryptData(encryptedUserData);
      if (userData) {
        userData.name = newName.trim();
        userData.timestamp = new Date().getTime();

        const updatedEncryptedData = encryptData(userData);
        VueCookies.set("user_session", updatedEncryptedData, "4h");
      }
    }
  } catch (error) {
    console.error("Error updating user session:", error);
  }
};
</script>
