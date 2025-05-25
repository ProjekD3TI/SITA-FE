<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
});
</script>
<template>
  <div class="relative px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
    {{ msg }}
  </div>
</template>
