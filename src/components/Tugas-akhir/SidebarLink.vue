<script setup>
defineProps({
  to: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div class="py-1 ms-4 me-4">
    <router-link
      :to="to"
      :class="
        active
          ? 'border-l-[6px]  border-primary bg-primary-bg text-primary hover:bg-primary-bg body4-bold'
          : 'hover:text-primary text-[#242C3A] body4 hover:bg-primary-bg'
      "
      class="flex items-center justify-start px-3 py-2 capitalize duration-100 ease-in-out rounded-md active:scale-95"
    >
      <div class="py-1 mr-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          v-html="icon"
        ></svg>
      </div>
      <span :class="{ inline: showLabel, hidden: !showLabel }">{{
        label
      }}</span>
    </router-link>
  </div>
</template>
