import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import { encryptData, decryptData } from "./encrypt";

// Set the base URL for all axios requests
axios.defaults.baseURL = 'http://pelaporan-d3ti.my.id';
axios.defaults.withCredentials = true;

export function authDosen() {
  const user = ref(null);
  const token = ref(null);
  const currentJabatan = ref(null);
  const availableJabatan = ref([]);
  const router = useRouter();
  const toast = useToast();
  const isLoading = ref(false);

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
          console.log("[Interceptor] Added auth token to request");
        } else {
          console.log("[Interceptor] No auth token found for request");
        }
        
        // Ensure every request uses the correct baseURL
        config.baseURL = 'http://pelaporan-d3ti.my.id';
        
        // Add common headers
        config.headers["Accept"] = "application/json";
        config.headers["Content-Type"] = "application/json";
        
        return config;
      },
      (error) => {
        console.error("[Interceptor] Request error:", error);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error("[Interceptor] Response error:", error.response?.status, error.message);
        if (error.response?.status === 401) {
          console.log("[Interceptor] 401 Unauthorized - clearing auth tokens");
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
    
    console.log("[Auth] Interceptors setup complete");
  };

  const loginDosen = async (email, password) => {
    try {
      isLoading.value = true;
      console.log("[Auth] Attempting login with API:", axios.defaults.baseURL);
      
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

      console.log("[Auth] Login response received:", response.status);

      if (response.data.status) {
        user.value = response.data.data.dosen;
        token.value = response.data.data.token;
        currentJabatan.value = response.data.data.jabatan_sekarang;
        availableJabatan.value = response.data.data.punya_jabatan;

        console.log("[Auth] Login successful - current jabatan:", currentJabatan.value?.name);
        console.log("[Auth] Available jabatan:", availableJabatan.value.map(j => j.name));

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

        // Set token for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
        console.log("[Auth] Auth token set in headers:", token.value ? "Yes" : "No");

        toast.success(response.data.message || "Login Dosen berhasil!");

        return redirectByJabatan(currentJabatan.value.name);
      } else {
        console.error("[Auth] Login failed:", response.data.message);
        toast.error(response.data.message || "Login gagal");
        return false;
      }
    } catch (error) {
      console.error("[Auth] Login error details:", {
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
    } finally {
      isLoading.value = false;
    }
  };

  // FIXED VERSION
  const switchJabatan = async (jabatanId) => {
    try {
      isLoading.value = true;
      
      console.log("[switchJabatan] Starting jabatan switch to ID:", jabatanId);
      console.log("[switchJabatan] Current jabatan before switch:", currentJabatan.value?.name);
  
      const response = await axios.post(
        "/api/dosen/switch_jabatan",
        { jabatan_id: jabatanId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token.value || VueCookies.get("auth_token")}`,
          },
        }
      );
  
      console.log("[switchJabatan] API Response:", response.data);
  
      if (response.data.status) {
        const newJabatan = response.data.data.jabatan_sekarang;
        const existingUserData = getUserData();
        
        console.log("[switchJabatan] New jabatan from API:", newJabatan);
        console.log("[switchJabatan] Existing user data:", existingUserData);
  
        if (existingUserData?.jabatanId === newJabatan.id) {
          console.log("[switchJabatan] Already in this role - no change needed");
          toast.info("Anda sudah berada di jabatan ini");
          return false;
        }
        
        // CRITICAL FIX: Create completely new user data object to avoid stale references
        const userData = {
          ...existingUserData,
          type: "dosen",
          jabatan: newJabatan.name,
          jabatanId: newJabatan.id,
          timestamp: new Date().getTime(),
        };
        
        console.log("[switchJabatan] Updating user data to:", userData);
  
        // CRITICAL FIX: Clear cookies before setting new ones
        VueCookies.remove("user_session");
        
        storeAuthData({
          token: token.value || VueCookies.get("auth_token"),
          userData: userData,
        });
        
        console.log("[switchJabatan] User data stored in cookies - verifying...");
        const verifyData = getUserData();
        console.log("[switchJabatan] Verification of stored data:", verifyData);
  
        // CRITICAL FIX: Create new object for reactive state to avoid reference issues
        currentJabatan.value = { ...newJabatan };
        console.log("[switchJabatan] Updated currentJabatan.value to:", currentJabatan.value);
        
        // CRITICAL FIX: Properly mark active jabatan
        if (response.data.data.punya_jabatan) {
          console.log("[switchJabatan] Updating available jabatan");
          
          availableJabatan.value = response.data.data.punya_jabatan.map(j => ({
            ...j,
            is_active: j.id === newJabatan.id
          }));
          
          console.log("[switchJabatan] Updated availableJabatan:", 
            availableJabatan.value.map(j => `${j.name}(${j.is_active ? "active" : "inactive"})`));
        }
  
        toast.success(response.data.message || "Berhasil mengganti jabatan");
        console.log("[switchJabatan] Switch completed successfully ✅");
        
        // Return true to signal success
        return true;
      }
  
      console.log("[switchJabatan] Failed - API returned status false");
      return false;
    } catch (error) {
      console.error("[switchJabatan] Error:", error);
      toast.error("Gagal mengganti jabatan: " + (error.response?.data?.message || error.message));
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const storeAuthData = ({ token: authToken, userData }) => {
    console.log("[storeAuthData] Storing auth data");
    
    // CRITICAL FIX: Clear cookies first to ensure clean state
    VueCookies.remove("auth_token");
    VueCookies.remove("user_session");
    
    // Store token with better options
    VueCookies.set("auth_token", authToken, {
      expires: "4h",
      secure: window.location.protocol === "https:",
      sameSite: "Lax"
    });

    const dataWithTimestamp = {
      ...userData,
      timestamp: new Date().getTime(),
    };

    const encryptedUserData = encryptData(dataWithTimestamp);
    VueCookies.set("user_session", encryptedUserData, {
      expires: "4h",
      secure: window.location.protocol === "https:",
      sameSite: "Lax"
    });
    
    console.log("[storeAuthData] Auth data stored with jabatan:", userData.jabatan);
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
    console.log(`[redirectByJabatan] Redirecting to ${route} for role ${jabatanName}`);

    router.push(route).catch((err) => {
      if (err.name !== "NavigationDuplicated") {
        console.error("[redirectByJabatan] Navigation error:", err.message);
        window.location.href = route;
      }
    });

    return true;
  };

  const getUserJabatan = async () => {
    try {
      isLoading.value = true;
      console.log("[getUserJabatan] Fetching user jabatan data...");

      const authToken = token.value || VueCookies.get("auth_token");
      if (!authToken) {
        console.error("[getUserJabatan] No auth token available");
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

      console.log("[getUserJabatan] Responses received");

      if (currentResponse.data.status) {
        const serverJabatan = currentResponse.data.data.jabatan_sekarang;
        console.log("[getUserJabatan] Server current jabatan:", serverJabatan);
        
        // CRITICAL FIX: Create new object to break references
        currentJabatan.value = { ...serverJabatan };

        const existingData = getUserData();
        console.log("[getUserJabatan] Existing user data:", existingData);
        
        if (
          existingData?.type === "dosen" &&
          (existingData.jabatan !== serverJabatan.name ||
            existingData.jabatanId !== serverJabatan.id)
        ) {
          console.log("[getUserJabatan] Jabatan mismatch detected - updating cookie data");
          
          const userData = {
            ...existingData,
            jabatan: serverJabatan.name,
            jabatanId: serverJabatan.id,
          };

          storeAuthData({
            token: authToken,
            userData: userData,
          });
          
          console.log("[getUserJabatan] Cookie data updated to match server data");
        }
      }

      if (availableResponse.data.status) {
        user.value = availableResponse.data.data.dosen;
        
        // CRITICAL FIX: Mark active jabatan
        const currentId = currentJabatan.value?.id;
        availableJabatan.value = availableResponse.data.data.punya_jabatan.map(j => ({
          ...j,
          is_active: j.id === currentId
        }));
        
        console.log("[getUserJabatan] Available jabatan:", 
          availableJabatan.value.map(j => `${j.name}(${j.is_active ? "active" : "inactive"})`));
      }

      console.log("[getUserJabatan] Fetch complete");
      return {
        currentJabatan: currentJabatan.value,
        availableJabatan: availableJabatan.value,
      };
    } catch (error) {
      console.error("[getUserJabatan] Error:", error);
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
      console.log("[logout] Starting logout process");
      // Get current token
      const currentToken = VueCookies.get("auth_token");
      
      if (currentToken) {
        await axios.post("/api/logout", null, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        console.log("[logout] Logout API call successful");
      }
    } catch (error) {
      console.error("[logout] Error:", error);
    } finally {
      user.value = null;
      token.value = null;
      currentJabatan.value = null;
      availableJabatan.value = [];

      // Clear cookies
      VueCookies.remove("auth_token");
      VueCookies.remove("user_session");
      console.log("[logout] Cookies and state cleared");

      // Clear authorization header
      delete axios.defaults.headers.common["Authorization"];

      router.push({ name: "logindosen" });
      console.log("[logout] Redirected to login page");
    }
  };

  const checkAuth = () => {
    console.log("[checkAuth] Checking authentication status");
    const storedToken = VueCookies.get("auth_token");
    const userData = getUserData();

    console.log("[checkAuth] Token exists:", !!storedToken);
    console.log("[checkAuth] User data exists:", !!userData);
    
    if (userData) {
      console.log("[checkAuth] User type:", userData.type);
      console.log("[checkAuth] User jabatan:", userData.jabatan);
    }

    if (storedToken && userData && userData.type === "dosen") {
      token.value = storedToken;
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      console.log("[checkAuth] Authorization header set");

      if (userData.jabatan) {
        currentJabatan.value = {
          id: userData.jabatanId || 0,
          name: userData.jabatan,
        };
        console.log("[checkAuth] Current jabatan set from cookie:", currentJabatan.value.name);
      }

      return true;
    }
    
    console.log("[checkAuth] Authentication check failed");
    return false;
  };

  const initializeFromCookies = async () => {
    console.log("[initializeFromCookies] Initializing from cookies");
    const savedToken = VueCookies.get("auth_token");
    const userData = getUserData();

    if (savedToken && userData && userData.type === "dosen") {
      console.log("[initializeFromCookies] Valid cookie data found");
      token.value = savedToken;
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

      if (userData.jabatan) {
        currentJabatan.value = {
          id: userData.jabatanId || 0,
          name: userData.jabatan,
        };
        console.log("[initializeFromCookies] Set current jabatan from cookie:", userData.jabatan);
        
        if (userData.availableJabatan) {
          availableJabatan.value = userData.availableJabatan;
          console.log("[initializeFromCookies] Set available jabatan from cookie");
        }
      }

      VueCookies.remove("jabatan_sekarang");
      VueCookies.remove("punya_jabatan");

      console.log("[initializeFromCookies] Fetching latest data from server");
      await getUserJabatan();
    } else {
      console.log("[initializeFromCookies] No valid cookie data found");
    }
  };

  const initializeAuth = () => {
    console.log("[initializeAuth] Starting auth initialization");
    setupAxiosInterceptors();
    initializeFromCookies();
    const result = checkAuth();
    console.log("[initializeAuth] Auth initialization complete:", result);
    return result;
  };

  onMounted(() => {
    console.log("[authDosen] Component mounted - initializing auth");
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
  console.log("[getUserData] Getting user data from cookie");
  const encryptedUserData = VueCookies.get("user_session");
  if (encryptedUserData) {
    try {
      const userData = decryptData(encryptedUserData);
      console.log("[getUserData] User data retrieved:", {
        type: userData?.type,
        jabatan: userData?.jabatan,
        jabatanId: userData?.jabatanId
      });
      return userData;
    } catch (error) {
      console.error("[getUserData] Error decrypting user data:", error);
      VueCookies.remove("auth_token");
      VueCookies.remove("user_session");
      return null;
    }
  } else {
    console.log("[getUserData] No user_session cookie found");
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
    console.error("[validateToken] Error:", e);
    return false;
  }
}