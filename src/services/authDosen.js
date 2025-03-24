import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import { encryptData, decryptData } from "./encrypt";

export function authDosen() {
  const user = ref(null);
  const token = ref(null);
  const currentJabatan = ref(null);
  const availableJabatan = ref([]);
  const router = useRouter();
  const toast = useToast();
  const isLoading = ref(false);

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
            router.push("/dosen/login");
          }
        }
        return Promise.reject(error);
      }
    );
  };

  const loginDosen = async (email, password) => {
    try {
      isLoading.value = true;
      const response = await axios.post(
        "/api/login/dosen",
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
        user.value = response.data.data.dosen;
        token.value = response.data.data.token;
        currentJabatan.value = response.data.data.jabatan_sekarang;
        availableJabatan.value = response.data.data.punya_jabatan;

        storeAuthData({
          token: token.value,
          userData: {
            type: "dosen",
            jabatan: currentJabatan.value.name,
            jabatanId: currentJabatan.value.id,
            name: response.data.data.dosen.name,
            nik: response.data.data.dosen.nik,
            email: email,
            dosenId: user.value.id,
            no_telp: response.data.data.dosen.no_telp,
          },
        });

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token.value}`;

        toast.success(response.data.message || "Login Dosen berhasil!");

        return redirectByJabatan(currentJabatan.value.name);
      } else {
        toast.error(response.data.message || "Login gagal");
        return false;
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
    } finally {
      isLoading.value = false;
    }
  };

  const switchJabatan = async (jabatanId) => {
    try {
      isLoading.value = true;

      const response = await axios.post(
        "/api/dosen/switch_jabatan",
        { jabatan_id: jabatanId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${
              token.value || VueCookies.get("auth_token")
            }`,
          },
        }
      );

      if (response.data.status) {
        const newJabatan = response.data.data.jabatan_sekarang;
        const existingUserData = getUserData();

        if (existingUserData.jabatanId === newJabatan.id) {
          toast.info("Anda sudah berada di jabatan ini");
          return false;
        }

        const userData = {
          ...existingUserData,
          type: "dosen",
          jabatan: newJabatan.name,
          jabatanId: newJabatan.id,
          timestamp: new Date().getTime(),
          availableJabatan: response.data.data.punya_jabatan,
        };

        storeAuthData({
          token: token.value || VueCookies.get("auth_token"),
          userData: userData,
        });

        currentJabatan.value = newJabatan;
        availableJabatan.value = response.data.data.punya_jabatan;

        const targetRoute = `/${newJabatan.name.toLowerCase()}/dashboard`;

        setTimeout(() => {
          window.location = targetRoute;
          window.location.reload(true);
        }, 100);
        toast.success(response.data.message || "Berhasil mengganti jabatan");

        // console.log("Switched to jabatan:", newJabatan);
        // console.log(userData);
        return true;
      }

      return false;
    } catch (error) {
      // console.error("Switch jabatan error:", error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const storeAuthData = ({ token: authToken, userData }) => {
    VueCookies.set("auth_token", authToken, "4h");

    const dataWithTimestamp = {
      ...userData,
      timestamp: new Date().getTime(),
    };

    const encryptedUserData = encryptData(dataWithTimestamp);
    VueCookies.set("user_session", encryptedUserData, "4h");
  };

  const jabatanRoute = (jabatanName) => {
    switch (jabatanName) {
      case "Dosen":
        return "/dosen/dashboard";
      case "Kalab":
        return "/kalab/dashboard";
      case "Kaprodi":
        return "/kaprodi/dashboard";
      case "Petugas":
        return "/petugas/dashboard";
      default:
        return "/dosen/dashboard";
    }
  };

  const redirectByJabatan = (jabatanName) => {
    const route = jabatanRoute(jabatanName);

    router.push(route).catch((err) => {
      if (err.name !== "NavigationDuplicated") {
        // console.error("Navigation error:", err);
        window.location.href = route;
      }
    });

    return true;
  };

  const getUserJabatan = async () => {
    try {
      isLoading.value = true;

      const authToken = token.value || VueCookies.get("auth_token");
      if (!authToken) {
        throw new Error("No auth token available");
      }

      const [currentResponse, availableResponse] = await Promise.all([
        axios.get("/api/dosen/current_jabatan", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
        axios.get("/api/dosen/jabatan", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      ]);

      if (currentResponse.data.status) {
        const serverJabatan = currentResponse.data.data.jabatan_sekarang;
        currentJabatan.value = serverJabatan;

        const existingData = getUserData();
        if (
          existingData?.type === "dosen" &&
          (existingData.jabatan !== serverJabatan.name ||
            existingData.jabatanId !== serverJabatan.id)
        ) {
          const userData = {
            ...existingData,
            jabatan: serverJabatan.name,
            jabatanId: serverJabatan.id,
          };

          storeAuthData({
            token: authToken,
            userData: userData,
          });
        }
      }

      if (availableResponse.data.status) {
        user.value = availableResponse.data.data.dosen;
        availableJabatan.value = availableResponse.data.data.punya_jabatan;
      }

      return {
        currentJabatan: currentJabatan.value,
        availableJabatan: availableJabatan.value,
      };
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    } finally {
      isLoading.value = false;
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
      currentJabatan.value = null;
      availableJabatan.value = [];

      VueCookies.remove("auth_token");
      VueCookies.remove("user_session");

      delete axios.defaults.headers.common["Authorization"];

      router.push({ name: "logindosen" });
    }
  };

  const checkAuth = () => {
    const storedToken = VueCookies.get("auth_token");
    const userData = getUserData();

    if (storedToken && userData && userData.type === "dosen") {
      token.value = storedToken;
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

      if (userData.jabatan) {
        currentJabatan.value = {
          id: userData.jabatanId || 0,
          name: userData.jabatan,
        };
      }

      return true;
    }
    return false;
  };

  const initializeFromCookies = async () => {
    const savedToken = VueCookies.get("auth_token");
    const userData = getUserData();

    if (savedToken && userData && userData.type === "dosen") {
      token.value = savedToken;
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

      if (userData.jabatan) {
        currentJabatan.value = {
          id: userData.jabatanId || 0,
          name: userData.jabatan,
        };
        if (userData.availableJabatan) {
          availableJabatan.value = userData.availableJabatan;
        }
      }

      VueCookies.remove("jabatan_sekarang");
      VueCookies.remove("punya_jabatan");

      await getUserJabatan();
    }
  };

  const initializeAuth = () => {
    setupAxiosInterceptors();
    initializeFromCookies();
    return checkAuth();
  };

  onMounted(() => {
    initializeAuth();
  });

  return {
    user,
    token,
    currentJabatan,
    availableJabatan,
    isLoading,
    loginDosen,
    switchJabatan,
    getUserJabatan,
    logout,
    redirectByJabatan,
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
