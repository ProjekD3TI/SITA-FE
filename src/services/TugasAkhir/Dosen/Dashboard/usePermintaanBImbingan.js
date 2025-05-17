import { ref } from "vue";

const permintaanBimbingan = ref([
  {
    nim: "V3423890",
    nama: "John Smith el Pikir",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    kategori: "Internet of Things",
  },
  {
    nim: "V3423890",
    nama: "leonardo DiCaprio",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    kategori: "Sistem Informasi",
  },
  {
    nim: "V3423890",
    nama: "ikhsan skuter",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    kategori: "Game Development",
  },
  {
    nim: "V3423890",
    nama: "christian Bale",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    kategori: "Artificial Intelligence",
  },
  {
    nim: "V3423890",
    nama: "Lionel Ronaldo",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    kategori: "Internet of Things",
  },
]);

export function usePermintaanBimbingan() {
  return { permintaanBimbingan };
}
