<script setup>
import { ref } from 'vue'


const students = ref([
  { name: 'John Smith el Pikir' },
  { name: 'John Smith el Pikir' },
  { name: 'John Smith el Pikir' },
  { name: 'John Smith el Pikir' },
  { name: 'John Smith el Pikir' },
  { name: 'John Smith el Pikir' }
])
</script>
<template>
        <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 class="text-3xl font-semibold text-blue-500">Request Bimbingan</h1>
              <h2 class="text-2xl font-semibold mt-2">Dosen 1</h2>
            </div>
            <div class="mt-4 md:mt-0">
              <img src="https://via.placeholder.com/200x150" alt="Teacher illustration" class="max-w-full h-auto" />
            </div>
          </div>
        </div>


</template>