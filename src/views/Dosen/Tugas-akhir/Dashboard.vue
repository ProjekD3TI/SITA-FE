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
              <h1 class="text-3xl font-semibold text-blue-500">Welcome Back!</h1>
              <h2 class="text-2xl font-semibold mt-2">Dosen 1</h2>
            </div>
            <div class="mt-4 md:mt-0">
              <img src="https://via.placeholder.com/200x150" alt="Teacher illustration" class="max-w-full h-auto" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Daftar Bimbingan -->
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold mb-4">Daftar Bimbingan</h3>
            <div class="space-y-3">
              <div v-for="(student, index) in students" :key="index" class="flex items-center py-2 border-b border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ student.name }}</span>
              </div>
            </div>
          </div>

          <!-- Recent Students -->
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold mb-4">Students</h3>
            <div class="space-y-3">
              <div v-for="(student, index) in students.slice(0, 4)" :key="index" class="flex items-center py-2 border-b border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ student.name }}</span>
              </div>
            </div>
          </div>
        </div>

</template>