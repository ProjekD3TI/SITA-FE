<script setup>
import { ref,computed } from 'vue'
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue'
import FlowBar from '@/components/Tugas-akhir/FlowBar.vue'

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
  <Breadcrumb :items="breadcrumbItems" />


</template>