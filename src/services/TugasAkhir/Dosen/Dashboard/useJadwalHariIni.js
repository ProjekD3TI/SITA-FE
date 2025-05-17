import { ref, computed } from "vue";
const today = new Date().toISOString().slice(0, 10);

const jadwalUjian = ref([
  {
    name: "John Smith el Pikir",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    sesi: "09:00 ",
    ruang: "A101",
    tanggal: today,
  },
  {
    name: "Raffael Aldrich",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    sesi: "11:00",
    ruang: "B202",
    tanggal: today,
  },
  {
    name: "Samuel Aditya",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    sesi: "11:00",
    ruang: "B202",
    tanggal: today,
  },
  {
    name: "Rehan Sukma",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    sesi: "11:00",
    ruang: "B202",
    tanggal: today,
  },
  {
    name: "Veri Irwandi",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    sesi: "13:00",
    ruang: "B202",
    tanggal: today,
  },
  // ...data lainnya
]);

const JadwalHariIni = computed(() =>
  jadwalUjian.value.filter((item) => item.tanggal === today)
);

export function useJadwalUjian() {
  return { jadwalUjian, JadwalHariIni };
}
