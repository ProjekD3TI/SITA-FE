<script setup>
import { defineProps } from 'vue';
defineProps({
  msg: {
    type: String,
    required: true
  }
});
</script>
<template>
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      {{ msg }}
    </div>
</template>
