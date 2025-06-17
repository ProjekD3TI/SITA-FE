<template>
    <DefaultModal :headText="'Set Tahun Ajaran Aktif'" @close="onClose">
        <div class="space-y-4">
            <div>
                <label class="block mb-1 font-semibold">Tahun Ajaran</label>
                <select v-model="tahunAjaran" class="w-full border rounded px-2 py-1">
                    <option v-for="tahun in tahunAjaranList" :key="tahun" :value="tahun">
                        {{ tahun }}
                    </option>
                </select>
            </div>
            <div>
                <label class="block mb-1 font-semibold">Semester</label>
                <div class="flex gap-4">
                    <label>
                        <input type="radio" value="Ganjil" v-model="semester" />
                        Ganjil
                    </label>
                    <label>
                        <input type="radio" value="Genap" v-model="semester" />
                        Genap
                    </label>
                </div>
            </div>
            <div class="flex justify-end gap-2 mt-4">
                <Button variant="danger" @click="onClose">Batal</Button>
                <Button variant="primary" @click="submit">Simpan</Button>
            </div>
        </div>
    </DefaultModal>
</template>

<script setup>
import { ref } from "vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import Button from "@/components/Tugas-akhir/Button.vue";

const props = defineProps({
    tahunAjaranList: {
        type: Array,
        default: () => ["2024/2025", "2025/2026", "2026/2027"],
    },
    modelValue: Object,
});
const emit = defineEmits(["close", "submit"]);

const tahunAjaran = ref(props.tahunAjaranList[0]);
const semester = ref("Ganjil");

function onClose() {
    emit("close");
}
function submit() {
    emit("submit", { tahunAjaran: tahunAjaran.value, semester: semester.value });
    emit("close");
}
</script>