<template>
  <div
    class="p-4 sm:p-6 bg-white card-rounded border w-full max-w-[200px] sm:max-w-[250px] h-[220px] sm:h-[300px] flex flex-col gap-y-3 sm:gap-y-5"
  >
    <div class="flex justify-between">
      <div class="body5-bold sm:body4-bold">{{ role }}</div>
      <button v-if="showButton">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="duration-200 size-4 text-secondary hover:text-primary active:scale-90"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>
    </div>
    <div
      class="flex flex-col items-center justify-center flex-grow gap-y-1 sm:gap-y-2"
    >
      <div
        :class="[
          'flex items-center justify-center size-24 sm:size-32 rounded-full',
          randomBgClass,
        ]"
      >
        <span class="text-blackText body2-bold sm:heading5">{{ inisial }}</span>
      </div>
      <div class="text-center body5 sm:body4 text-primary">{{ name }}</div>
      <div class="text-center body5 sm:body4 text-primary">NIP.{{ nip }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";

const props = defineProps({
  role: {
    type: String,
    default: "Pembimbing",
  },
  name: {
    type: String,
    default: "Nama S.Kom M.Tech",
  },
  nip: {
    type: String,
    default: "90909909",
  },
  showButton: {
    type: Boolean,
    default: false,
  },
});

const inisial = computed(() =>
  props.name ? props.name.charAt(0).toUpperCase() : ""
);

// Array warna Tailwind yang diinginkan
const bgColors = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-indigo-200",
  "bg-teal-200",
  "bg-orange-200",
  "bg-cyan-200",
];

const randomBgClass = ref(bgColors[0]);
onMounted(() => {
  const idx = Math.floor(Math.random() * bgColors.length);
  randomBgClass.value = bgColors[idx];
});
</script>
