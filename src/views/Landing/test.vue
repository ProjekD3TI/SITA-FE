<template>
  <div style="padding: 50px">
    <QuillTextEditor id="test" label="Test Editor" v-model="content" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import QuillTextEditor from "@/components/Tugas-akhir/Forms/QuillTextEditor.vue";
const content = ref("");
</script>
