import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import { encryptData, decryptData } from "./encrypt";

export function authMahasiswa() {
  const user = ref(null);
  const token = ref(null);
  const router = useRouter();
  const toast = useToast();

  const loginMahasiswa = async (email, password) => {
    try {
      const response = await axios.post(
        "/api/login/mahasiswa",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.status) {
        user.value = response.data.data?.user || { email };
        token.value = response.data.data?.token;

        if (!token.value) {
          throw new Error("Token tidak ditemukan dalam response");
        }
        VueCookies.set("auth_token", token.value, "4h");

        const userData = {
          type: "mahasiswa",
          email: email,
          name: response.data.data?.user?.name,
          nim: response.data.data?.user?.nim,
          no_telp: response.data.data?.user?.no_telp,
          timestamp: new Date().getTime(),
        };

        const encryptedUserData = encryptData(userData);
        VueCookies.set("user_session", encryptedUserData, "4h");

        toast.success(response.data.message || "Login Mahasiswa berhasil!");
        router.push("/mahasiswa/dashboard");
      } else {
        toast.error(response.data.message || "Login gagal");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        const errMessage = error.response?.data?.message;

        if (errMessage) {
          toast.error(errMessage);
        } else {
          toast.error("Email atau password salah");
        }
      } else {
        toast.error(
          error.response?.data?.message ||
            "Gagal melakukan login. Silakan coba lagi."
        );
      }
      console.error("Login error:", error.response?.data);
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;

    VueCookies.remove("auth_token");
    VueCookies.remove("user_session");

    router.push({ name: "loginmhs" });
  };

  return { user, token, loginMahasiswa, logout };
}
