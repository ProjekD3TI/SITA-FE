import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import { encryptData, decryptData } from "./encrypt";

export function authAdmin() {
  const user = ref(null);
  const token = ref(null);
  const role = ref(null);
  const router = useRouter();
  const toast = useToast();

  const loginAdmin = async (email, password) => {
    try {
      const response = await axios.post(
        "/api/login/admin",
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
        user.value = response.data.data.admin || { email };
        token.value = response.data.data.token;
        role.value = response.data.data.role;

        VueCookies.set("auth_token", token.value, "4h");

        const userData = {
          type: "admin",
          role: role.value,
          email: email,
          name: response.data.data.admin.name,
          timestamp: new Date().getTime(),
        };

        const encryptedUserData = encryptData(userData);
        VueCookies.set("user_session", encryptedUserData, "4h");

        toast.success(response.data.message || "Login Admin berhasil!");
        router.push("/admin/dashboard");
      } else {
        toast.error(response.data.message || "Login gagal");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Email atau password salah");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Gagal melakukan login. Silakan coba lagi."
        );
      }
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    role.value = null;

    VueCookies.remove("auth_token");
    VueCookies.remove("user_session");

    router.push({ name: "LoginAdmin" });
  };

  const getUserRole = () => {
    const encryptedUserData = VueCookies.get("user_session");
    if (encryptedUserData) {
      const userData = decryptData(encryptedUserData);
      if (userData && userData.role) {
        role.value = userData.role;
        return userData.role;
      }
    }
    return null;
  };

  const initializeAuth = () => {
    const storedToken = VueCookies.get("auth_token");
    if (storedToken) {
      token.value = storedToken;
      getUserRole();
    }
  };
  onMounted(() => {
    initializeAuth();
  });

  return { user, token, role, loginAdmin, logout, getUserRole };
}
