import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

export function general() {
    const router = useRouter();
    const toast = useToast();

    const loading = ref(false);
    const tahunAjaran = ref(null);
    const dosens = ref([]);
    const error = ref(null);

    const getDefaultTahunAjaran = async () => {
        loading.value = true;
        try {
          const response = await axios.get("/api/tahun-ajaran/default");
          tahunAjaran.value = response.data.data;
        } catch (err) {
          handleError(err);
        } finally {
          loading.value = false;
        }
    }

    const getAllDosen = async () => {
        loading.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            };
            
            const response = await axios.get("/api/all-dosen", { headers });
            dosens.value = response.data.data;
          } catch (err) {
            handleError(err);
          } finally {
            loading.value = false;
          }
    }
    return {
        getDefaultTahunAjaran,
        getAllDosen,
        dosens,
        tahunAjaran
      };
}