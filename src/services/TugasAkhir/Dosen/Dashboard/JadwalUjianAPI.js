import { ref, computed } from "vue";
const today = new Date().toISOString().slice(0, 10);

const jadwalUjian = ref([
  {
    name: "John Smith el Pikir",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    sesi: "09:00 - 10:00",
    ruang: "Lab. Jaringan",
    tanggal: today,
  },
  {
    name: "Raffael Aldrich",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    sesi: "10:00 - 11:00",
    ruang: "Lab. Jaringan",
    tanggal: today,
  },
  {
    name: "Samuel Aditya",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    sesi: "11:00 - 12:00",
    ruang: "Lab. Jaringan",
    tanggal: today,
  },
  {
    name: "Rehan Sukma",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    sesi: "12:00 - 13:00",
    ruang: "Lab. Mixed Reality",
    tanggal: today,
  },
  {
    name: "Veri Irwandi",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    sesi: "13:00 - 14:00",
    ruang: "Lab. Pemrograman",
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
