import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import { encryptData, decryptData } from "./encrypt";

// Set the base URL for all axios requests
axios.defaults.baseURL = 'https://v3422040.mhs.d3tiuns.com';
axios.defaults.withCredentials = true;

export function authMahasiswa() {
  const user = ref(null);
  const token = ref(null);
  const router = useRouter();
  const toast = useToast();

  const setupAxiosInterceptors = () => {
    // Clear any existing interceptors to avoid duplicates
    if (axios.interceptors.request.handlers && axios.interceptors.request.handlers.length > 0) {
      axios.interceptors.request.handlers = [];
    }
    if (axios.interceptors.response.handlers && axios.interceptors.response.handlers.length > 0) {
      axios.interceptors.response.handlers = [];
    }

    axios.interceptors.request.use(
      (config) => {
        const authToken = VueCookies.get("auth_token");
        if (authToken) {
          config.headers["Authorization"] = `Bearer ${authToken}`;
        }
        
        // Ensure every request uses the correct baseURL
        config.baseURL = 'https://v3422040.mhs.d3tiuns.com';
        
        // Add common headers
        config.headers["Accept"] = "application/json";
        config.headers["Content-Type"] = "application/json";
        
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

        // Store token with better options
        VueCookies.set("auth_token", token.value, {
          expires: "4h",
          secure: window.location.protocol === "https:",
          sameSite: "Lax"
        });

        const userData = {
          type: "mahasiswa",
          email: email,
          name: response.data.data?.user?.name,
          nim: response.data.data?.user?.nim,
          no_telp: response.data.data?.user?.no_telp,
          timestamp: new Date().getTime(),
        };

        const encryptedUserData = encryptData(userData);
        VueCookies.set("user_session", encryptedUserData, {
          expires: "4h",
          secure: window.location.protocol === "https:",
          sameSite: "Lax"
        });

        // Set token for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
        
        toast.success(response.data.message || "Login Mahasiswa berhasil!");
        router.push("/dashboard");
      } else {
        toast.error(response.data.message || "Login gagal");
      }
    } catch (error) {
      console.error("Login error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.message
      });
      
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
    }
  };

  const logout = async () => {
    try {
      // Get current token
      const currentToken = VueCookies.get("auth_token");
      
      if (currentToken) {
        await axios.post("/api/logout", null, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error.message);
    } finally {
      user.value = null;
      token.value = null;

      // Clear cookies
      VueCookies.remove("auth_token");
      VueCookies.remove("user_session");

      // Clear authorization header
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
      
      // Set the authorization header
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
        console.error("Error decrypting user data:", error.message);
        VueCookies.remove("auth_token");
        VueCookies.remove("user_session");
        return null;
      }
    }
    return null;
  };

  const initializeAuth = () => {
    setupAxiosInterceptors();
    const result = checkAuth();
    return result;
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
    getUserData
  };
}

export function getUserData() {
  const encryptedUserData = VueCookies.get("user_session");
  if (encryptedUserData) {
    try {
      const userData = decryptData(encryptedUserData);
      return userData;
    } catch (error) {
      console.error("Error decrypting user data:", error.message);
      VueCookies.remove("auth_token");
      VueCookies.remove("user_session");
      return null;
    }
  }
  return null;
}

// Helper function to validate token
export function validateToken(token) {
  if (!token) return false;
  
  try {
    // Simple validation - check if token is a non-empty string
    return typeof token === 'string' && token.length > 0;
  } catch (e) {
    return false;
  }
}