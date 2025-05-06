import { ref, onMounted } from "vue";
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
            router.push("/mahasiswa/login");
          }
        }
        return Promise.reject(error);
      }
    );
  };

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

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token.value}`;

        toast.success(response.data.message || "Login Mahasiswa berhasil!");
        router.push("/");
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
      // console.error("Login error:", error.response?.data);
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

      VueCookies.remove("auth_token");
      VueCookies.remove("user_session");

      delete axios.defaults.headers.common["Authorization"];

      router.push({ name: "loginmhs" });
    }
  };

  const checkAuth = () => {
    const storedToken = VueCookies.get("auth_token");
    const userData = getUserData();

    if (storedToken && userData && userData.type === "mahasiswa") {
      token.value = storedToken;
      user.value = {
        name: userData.name,
        email: userData.email,
        nim: userData.nim,
        no_telp: userData.no_telp,
      };
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      return true;
    }
    return false;
  };

  const getUserData = () => {
    const encryptedUserData = VueCookies.get("user_session");
    if (encryptedUserData) {
      try {
        const userData = decryptData(encryptedUserData);
        return userData;
      } catch (error) {
        // console.error("Error decrypting user data:", error);
        VueCookies.remove("auth_token");
        VueCookies.remove("user_session");
        return null;
      }
    }
    return null;
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
    loginMahasiswa,
    logout,
    checkAuth,
    initializeAuth,
  };
}

export function getUserData() {
  const encryptedUserData = VueCookies.get("user_session");
  if (encryptedUserData) {
    try {
      const userData = decryptData(encryptedUserData);
      return userData;
    } catch (error) {
      // console.error("Error decrypting user data:", error);
      VueCookies.remove("auth_token");
      VueCookies.remove("user_session");
      return null;
    }
  }
  return null;
}
