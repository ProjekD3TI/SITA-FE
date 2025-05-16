<template>
  <div class="grid">
    <img :src="icon" alt="eki" />
    <h1>{{ value }}</h1>
    <p class="">{{ judul }}</p>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  judul: {
    type: String,
    required: true,
  },
});
</script>
