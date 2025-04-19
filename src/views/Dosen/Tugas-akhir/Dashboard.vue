<script setup>
import { ref,computed } from 'vue'


const students = ref([
  { name: 'John Smith el Pikir',
    nim: '1234567890',
    ujian: true,
    jadwal: '2023-10-01 09:00 - 11:00'
  },
  { name: 'Raffael Aldrich',
    nim: '1234567891',
    ujian: false,
    jadwal: '2023-10-02 09:00 - 11:00'
   },
  { name: 'Rehan Pangaribuan',
    nim: '1234567892',
    ujian: true,
    jadwal: '2023-10-03 09:00 - 11:00'
   },
  { name: 'Veri Ariyanto',
    nim: '1234567893',
    ujian: false,
    jadwal: '2023-10-04 09:00 - 11:00'
   },
  { name: 'Riki Prasetyo',
    nim: '1234567894',
    ujian: true,
    jadwal: '2023-10-05 09:00 - 11:00'
   },
  { name: 'Andri Jaya Wijawa',
    nim: '1234567895',
    ujian: false,
    jadwal: '2023-10-06 09:00 - 11:00'
   }
])
const sortedStudents = computed(() => {
  return students.value.sort((a, b) => b.ujian - a.ujian)
})

const studentsWithUjian = computed(() => {
  return students.value.filter(student => student.ujian)
})
const studentsWithoutUjian = computed(() => {
  return students.value.filter(student => !student.ujian)
})
</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
    <div class="bg-white rounded-lg shadow-md overflow-hidden col-span-1 md:col-span-2 xl:col-span-3 relative">
        <img :src="HeroAsset" alt="" class="z-10 -left-1/4 md:top-0 md:right-0 md:left-0 absolute max-w-xs md:max-w-none md:w-auto">
        <div class="flex flex-col md:flex-row items-center duration-200">
          <div class="p-6 md:w-1/2">
            <h2 class="text-sky-500 text-4xl font-bold max-w-xs xl:max-w-md mx-auto duration-200">Welcome Back!</h2>
            <h3 class="text-gray-800 text-2xl font-bold mt-2 max-w-xs xl:max-w-md mx-auto duration-200">Dosen 1</h3>
          </div>
          <div class="md:w-1/2 flex justify-center p-4">
            <img src="/src/assets/images/header-dashboard-dosen.svg" alt="Student working on computer" class="h-52 md:h-64" />
          </div>
        </div>
      </div>

    <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold mb-4">Daftar Bimbingan</h3>
            <div class="space-y-3">
              <button v-for="(student, index) in sortedStudents.slice(0,4)" :key="index" class="flex items-center p-2 border-b border-gray-100 hover:bg-gray-50 w-full rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ student.name }} - {{ student.nim }}</span>
              </button>
            </div>
          </div>

          <!-- Recent Students -->
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold mb-4">Ujian Berlangsung</h3>
            <div class="space-y-3">
              <div v-for="(student, index) in studentsWithUjian" :key="index" class="flex items-center py-2 border-b border-gray-100 justify-between">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ student.name }} - {{ student.nim }}</span>
                </div>
                <button class="p-2 bg-primary rounded text-white hover:bg-primary">Detail</button>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold mb-4">Ujian Mendatang</h3>
            <div class="space-y-3">
              <div v-for="(student, index) in studentsWithoutUjian" :key="index" class="flex items-center py-2 border-b border-gray-100 justify-between">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ student.name }} - {{ student.nim }}</span>
                  <span>{{ student.jadwal }}</span>
                </div>
              </div>
            </div>
          </div>
  </div>


</template>