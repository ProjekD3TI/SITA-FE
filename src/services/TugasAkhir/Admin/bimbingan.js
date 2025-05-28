import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

export function useTabelPlottingPembimbing() {
    let abortController = null;
    const router = useRouter();
    const toast = useToast();
    const loadingPlotting = ref(false);
    const errorPlotting = ref(null);
    const dataPlotting = ref(null);
    const fetchData = async () => {
        loadingPlotting.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const response = await axios.get("/api/admin_ta/tugas-akhir/plotting", { headers });
            dataPlotting.value = response.data.data;
        } catch (err) {
            handleError(err);
        } finally {
            loadingPlotting.value = false;
        }
    };
    const handleError = (err) => {
        if (err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/admin/login");
        } else {
            errorPlotting.value = err.response?.data?.message || "Terjadi kesalahan";
            toast.error(errorPlotting.value);
        }
    };
    const submitPlotting = async ({ tugas_akhir_id, dosen_id }) => {
        loadingPlotting.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            const formData = {
                tugas_akhir_id,
                dosen_id
            };
            const response = await axios.post("/api/admin/plotting-pembimbing/plot", formData, { headers });
            toast.success("Plotting pembimbing berhasil dilakukan!");
            await fetchData();
        } catch (err) {
            handleError(err);
        } finally {
            loadingPlotting.value = false;
        }
    };
    onMounted(() => {
        fetchData();
    });
    onUnmounted(() => {
        if (abortController) {
            abortController.abort();
        }
    });
    return {
        loadingPlotting,
        errorPlotting,
        dataPlotting,
        fetchData,
        submitPlotting
    };
}

export function useTabelBimbingan() {
    let abortController = null;
    const router = useRouter();
    const toast = useToast();
    const loadingBimbingan = ref(false);
    const errorBimbingan = ref(null);
    const dataBimbingan = ref(null);

    const fetchData = async () => {
        loadingBimbingan.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const response = await axios.get("/api/admin_ta/tugas-akhir/list-bimbingan", { headers });
            dataBimbingan.value = response.data.data;
        } catch (err) {
            handleError(err);
        } finally {
            loadingBimbingan.value = false;
        }
    };

    const handleError = (err) => {
        if (err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/admin/login");
        } else {
            errorBimbingan.value = err.response?.data?.message || "Terjadi kesalahan";
            toast.error(errorBimbingan.value);
        }
    };

    onMounted(() => {
        fetchData();
    });

    onUnmounted(() => {
        if (abortController) {
            abortController.abort();
        }
    });

    return {
        loadingBimbingan,
        errorBimbingan,
        dataBimbingan,
        fetchData
    };
}

export function useShowPlottingPembimbing() {
    let abortController = null;
    const router = useRouter();
    const toast = useToast();
    const loadingShowPlotting = ref(false);
    const errorShowPlotting = ref(null);
    const dataShowPlotting = ref(null);

    const fetchData = async (id) => {
        loadingShowPlotting.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const response = await axios.get(`/api/admin_ta/tugas-akhir/plotting-pembimbing/${id}`, { headers });
            dataShowPlotting.value = response.data.data;
        } catch (err) {
            handleError(err);
        } finally {
            loadingShowPlotting.value = false;
        }
    };

    const submitPlotting = async ({ tugas_akhir_id, dosen_id }) => {
        loadingShowPlotting.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            const formData = {
                tugas_akhir_id,
                dosen_id
            };
            await axios.post("/api/admin_ta/request-pembimbing/", formData, { headers });
            toast.success("Plotting pembimbing berhasil!");
            await fetchData(tugas_akhir_id); // refresh detail
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            loadingShowPlotting.value = false;
        }
    };

    const updatePlotting = async ({ tugas_akhir_id, dosen_id }) => {
        loadingShowPlotting.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            const formData = {
                tugas_akhir_id,
                dosen_id
            };
            // Ganti URL sesuai endpoint update di backend (misal: PUT atau PATCH)
            await axios.put(`/api/admin_ta/request-pembimbing/${tugas_akhir_id}`, formData, { headers });
            toast.success("Update dosen pembimbing berhasil!");
            await fetchData(tugas_akhir_id); // refresh detail
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            loadingShowPlotting.value = false;
        }
    };

    const handleError = (err) => {
        if (err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/admin/login");
        } else {
            errorShowPlotting.value = err.response?.data?.message || "Terjadi kesalahan";
            toast.error(errorShowPlotting.value);
        }
    };

    onMounted(() => {
    });

    onUnmounted(() => {
        if (abortController) {
            abortController.abort();
        }
    });

    return {
        loadingShowPlotting,
        errorShowPlotting,
        dataShowPlotting,
        fetchData,
        submitPlotting,
        updatePlotting
    };
}

export function useShowBimbingan() {
    let abortController = null;
    const router = useRouter();
    const toast = useToast();
    const loadingShowBimbingan = ref(false);
    const errorShowBimbingan = ref(null);
    const dataShowBimbingan = ref(null);
    const fetchData = async (id) => {
        loadingShowBimbingan.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const response = await axios.get(`/api/admin_ta/tugas-akhir/detail-bimbingan/${id}`, { headers });
            dataShowBimbingan.value = response.data.data;
        } catch (err) {
            handleError(err);
        } finally {
            loadingShowBimbingan.value = false;
        }
    };
    const handleError = (err) => {
        if (err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/admin/login");
        } else {
            errorShowBimbingan.value = err.response?.data?.message || "Terjadi kesalahan";
            toast.error(errorShowBimbingan.value);
        }
    };
    onMounted(() => {
        // fetchData();
    });
    onUnmounted(() => {
        if (abortController) {
            abortController.abort();
        }
    });
    return {
        loadingShowBimbingan,
        errorShowBimbingan,
        dataShowBimbingan,
        fetchData
    };
}

export function useKategori() {
    let abortController = null;
    const router = useRouter();
    const toast = useToast();
    const loadingKategori = ref(false);
    const errorKategori = ref(null);
    const dataKategori = ref(null);

    const fetchData = async () => {
        loadingKategori.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const response = await axios.get("/api/admin_ta/kategori", { headers });
            dataKategori.value = response.data.data;
        } catch (err) {
            handleError(err);
        } finally {
            loadingKategori.value = false;
        }
    };

    const handleError = (err) => {
        if (err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/admin/login");
        } else {
            errorKategori.value = err.response?.data?.message || "Terjadi kesalahan";
            toast.error(errorKategori.value);
        }
    };

    onMounted(() => {
        fetchData();
    });

    onUnmounted(() => {
        if (abortController) {
            abortController.abort();
        }
    });

    return {
        loadingKategori,
        errorKategori,
        dataKategori,
        fetchData
    };
}
