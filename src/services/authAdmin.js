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

  const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(
      (config) => {
        const authToken = VueCookies.get("auth_token");
        if (authToken) {
          config.headers["Authorization"] = `Bearer ${authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          VueCookies.remove("auth_token");
          VueCookies.remove("user_session");

          const currentPath = router.currentRoute.value.path;
          if (!currentPath.includes("/login")) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/admin/login");
          }
        }
        return Promise.reject(error);
      }
    );
  };

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

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token.value}`;

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

  const logout = async () => {
    try {
      await axios.post("/api/logout", null, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
    } catch (error) {
      // console.error("Logout error:", error);
    } finally {
      user.value = null;
      token.value = null;
      role.value = null;

      VueCookies.remove("auth_token");
      VueCookies.remove("user_session");

      delete axios.defaults.headers.common["Authorization"];

      router.push({ name: "LoginAdmin" });
    }
  };

  const getUserRole = () => {
    const encryptedUserData = VueCookies.get("user_session");
    if (encryptedUserData) {
      try {
        const userData = decryptData(encryptedUserData);
        if (userData && userData.role) {
          role.value = userData.role;
          return userData.role;
        }
      } catch (error) {
        // console.error("Error decrypting user data:", error);
        VueCookies.remove("auth_token");
        VueCookies.remove("user_session");
        return null;
      }
    }
    return null;
  };

  const checkAuth = () => {
    const storedToken = VueCookies.get("auth_token");
    if (storedToken) {
      token.value = storedToken;
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      return getUserRole() !== null;
    }
    return false;
  };

  const initializeAuth = () => {
    setupAxiosInterceptors();
    return checkAuth();
  };

  onMounted(() => {
    initializeAuth();
  });

  return {
    user,
    token,
    role,
    loginAdmin,
    logout,
    getUserRole,
    checkAuth,
    initializeAuth,
  };
}
