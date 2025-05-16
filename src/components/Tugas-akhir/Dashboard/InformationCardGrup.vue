<script setup>
import InformationCard from "@/components/Tugas-akhir/Dashboard/InformationCard.vue";

// Import gambar SVG
import RedIcon from "@/assets/images/Red.svg";
import GreenIcon from "@/assets/images/Green.svg";
import YellowIcon from "@/assets/images/Yellow.svg";

// Props
defineProps({   
  cards: {
    type: Array,
    required: false, // Tidak wajib karena kita akan memberikan nilai default
    default: () => [
      { icon: RedIcon, value: 10, judul: "Card 1" },
      { icon: GreenIcon, value: 20, judul: "Card 2" },
      { icon: YellowIcon, value: 30, judul: "Card 3" },
    ],
  },
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <InformationCard
      v-for="(card, index) in cards"
      :key="index"
      :icon="card.icon"
      :value="card.value"
      :judul="card.judul"
    />
  </div>
</template>
