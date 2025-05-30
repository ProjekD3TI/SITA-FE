import { ref, onMounted, onUnmounted, computed, handleError } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

export function useTabelProposal() {
    let abortController = null;
    const router = useRouter();
    const toast = useToast();
    const dataTabelProposal = ref([]);
    const loadingTabelProposal = ref(false);
    const errorTabelProposal = ref(null);
    const fetchData = async () => {
        loadingTabelProposal.value = true;
        try {
            const auth_token = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${auth_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const response = await axios.get('/api/admin_ta/proposal', { headers });
            dataTabelProposal.value = response.data.data;
        } catch (err) {
            handleError(err);
        } finally {
            loadingTabelProposal.value = false;
        }
    };

    const handleError = (err) => {
        if (err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/admin/login");
        } else {
            errorTabelProposal.value = err.response?.data?.message || "Terjadi kesalahan.";
            toast.error(errorTabelProposal.value);
        }
    };

    const updateStatusForm = async (isOpen) => {
        try {
            const auth_token = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${auth_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            const formData = {
                is_open: isOpen // pastikan boolean (0/1)
            };
            await axios.put(`/api/admin_ta/status-form/1`, formData, { headers });
        } catch (err) {
            handleError(err);
            throw err;
        }
    }

    onMounted(() => {
        fetchData();
    })

    onUnmounted(() => {
        if (abortController) {
            abortController.abort();
        }
    });
    return {
        dataTabelProposal,
        loadingTabelProposal,
        errorTabelProposal,
        fetchData,
        updateStatusForm
    };
}

export function useShowProposal() {
    let abortController = null;
    const router = useRouter();
    const toast = useToast();
    const dataProposal = ref(null);
    const loadingProposal = ref(false);
    const errorProposal = ref(null);
    const fetchData = async (id) => {
        loadingProposal.value = true;
        try {
            const auth_token = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${auth_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            const response = await axios.get(`/api/admin_ta/proposal/show/${id}`, { headers });
            dataProposal.value = response.data.data;
        } catch (err) {
            handleError(err);
        } finally {
            loadingProposal.value = false;
        }
    };

    const validateProposal = async (id, statusValidBerkas, catatanPerbaikan = '') => {
        loadingProposal.value = true;
        try {
            const auth_token = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${auth_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            const formData = {
                status_valid_berkas: statusValidBerkas, // array, misal: [1,2] atau [1,1]
                catatan_perbaikan: catatanPerbaikan     // <-- tambahkan ini
            };
    
            await axios.put(`/api/admin_ta/proposal/${id}/status`, formData, { headers });
            toast.success("Proposal berhasil divalidasi.");
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            loadingProposal.value = false;
        }
    };

    const getSecureFileBlobUrl = async (url) => {
        loadingProposal.value = true;
        try {
            const auth_token = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${auth_token}`,
                'Accept': 'application/pdf'
            };
            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error("Gagal mengakses file");
            const blob = await response.blob();
            return window.URL.createObjectURL(blob);
        } catch (err) {
            return null;
        } finally {
            loadingProposal.value = false;
        }
    };

    const inputNilaiProposal = async (id, nilaiProposal, catatanProposal) => {
        loadingProposal.value = true;
        try {
            const auth_token = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${auth_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            const formData = {
                nilai_proposal: nilaiProposal,
                catatan_proposal: catatanProposal
            };
            await axios.put(`/api/admin_ta/proposal/${id}/nilai-catatan`, formData, { headers });
            // toast.success("Nilai proposal berhasil disimpan.");
    } catch (err) {
            handleError(err);
            throw err;
        } finally {
            loadingProposal.value = false;
        }
    }

    const handleError = (err) => {
        if (err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/admin/login");
        } else {
            errorProposal.value = err.response?.data?.message || "Terjadi kesalahan.";
            toast.error(errorProposal.value);
        }
    };

    onMounted(() => {
        // fetchData();
    }
    );

    onUnmounted(() => {
        if (abortController) {
            abortController.abort();
        }
    });

    return {
        dataProposal,
        loadingProposal,
        errorProposal,
        fetchData,
        validateProposal,
        getSecureFileBlobUrl,
        inputNilaiProposal
    };
}