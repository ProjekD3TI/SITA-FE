<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Edit Profile</h2>

    <div
      v-if="successMessage"
      class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
    >
      {{ successMessage }}
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
      ></div>
    </div>

    <form v-else @submit.prevent="updateProfile">
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
          required
        />
        <p v-if="errors.name" class="text-sm text-red-500">
          {{ errors.name[0] }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Email"
          required
        />
        <p v-if="errors.email" class="text-sm text-red-500">
          {{ errors.email[0] }}
        </p>
      </div>

      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="password"
        >
          Password Baru
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Password"
        />
        <p v-if="errors.password" class="text-sm text-red-500">
          {{ errors.password[0] }}
        </p>
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
          <span v-if="isSubmitting" class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Menyimpan...
          </span>
          <span v-else>Simpan Perubahan</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import VueCookies from "vue-cookies";
import { useToast } from "vue-toastification";
import { encryptData, decryptData } from "../../services/encrypt";

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const successMessage = ref("");
const isSubmitting = ref(false);
const loading = ref(true);
const errors = reactive({});
const toast = useToast();

onMounted(() => {
  fetchUserData();
});

const fetchUserData = async () => {
  try {
    loading.value = true;

    const token = VueCookies.get("auth_token");
    if (!token) {
      throw new Error("Token not found");
    }

    const response = await axios.get("/api/admin/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.data) {
      form.name = response.data.data.name || "";
      form.email = response.data.data.email || "";
    }
  } catch (error) {
    toast.error("Gagal memuat data profil");

    try {
      const encryptedUserData = VueCookies.get("user_session");
      if (encryptedUserData) {
        const userData = decryptData(encryptedUserData);
        if (userData) {
          form.name = userData.name || "";
          form.email = userData.email || "";
        }
      }
    } catch (cookieError) {
      console.error("Error reading from cookie:", cookieError);
    }
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  try {
    isSubmitting.value = true;
    successMessage.value = "";

    Object.keys(errors).forEach((key) => delete errors[key]);

    const updateData = {
      name: form.name,
      email: form.email,
    };

    if (form.password) {
      updateData.password = form.password;
    }

    const token = VueCookies.get("auth_token");

    const response = await axios.put("/api/admin/profile/edit", updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.data.status) {
      successMessage.value =
        response.data.message || "Profile berhasil diperbarui";

      toast.success(successMessage.value);

      updateUserSession(form.name, form.email);

      form.password = "";
      form.password_confirmation = "";
    } else {
      toast.error(response.data.message || "Gagal memperbarui profil");
    }
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error.response?.status === 422 && error.response.data.errors) {
      Object.assign(errors, error.response.data.errors);
      toast.error(error.response.data.message || "Validasi gagal");
    } else {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui profile"
      );
    }
  } finally {
    isSubmitting.value = false;
  }
};

const updateUserSession = (name, email) => {
  try {
    const encryptedUserData = VueCookies.get("user_session");
    if (encryptedUserData) {
      const userData = decryptData(encryptedUserData);
      if (userData) {
        userData.name = name;
        userData.email = email;
        userData.timestamp = new Date().getTime();

        const updatedEncryptedData = encryptData(userData);
        VueCookies.set("user_session", updatedEncryptedData, "4h");

        window.dispatchEvent(
          new CustomEvent("admin-profile-updated", {
            detail: { name, email },
          })
        );
      }
    }
  } catch (error) {
    console.error("Error updating user session:", error);
  }
};
</script>
