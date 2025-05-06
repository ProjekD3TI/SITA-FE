
<script setup>
import { ref } from 'vue';
import InputDate from '@/components/Tugas-akhir/Forms/InputDate.vue';
import InputDropdown from '@/components/Tugas-akhir/Forms/InputDropdown.vue';
import InputTextArea from '@/components/Tugas-akhir/Forms/InputTextarea.vue';
import Button from '@/components/Tugas-akhir/Button.vue';

const today = ref(new Date().toISOString().split('T')[0]);
const bimbinganDate = ref(today.value);
// Define reactive variables
const selectedValue = ref('');

// Handle form submission
const handleSubmit = () => {
  console.log('Form submitted with values:', {
    selectedDosen: selectedValue.value,
    tahunAjaran: TahunAjaran.value
  });
  // Add your form submission logic here
};
</script>
<template>
      <!-- tambah data bimbingan  -->
   <div class="card-rounded bg-white p-4 lg:p-8 mt-4">
    <div class="flex flex-col gap-4 max-w-screen-2xl mx-auto">
      <h5 class="body2-bold font-bold sm:font-bold sm:body1-bold lg:heading5 xl:heading4 ">Tambah Bimbingan</h5>
      <form action="" class="flex flex-col gap-4 ">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputDate
            id="date-input"
            label="Tanggal"
            placeholder="Tanggal"
            :value="bimbinganDate"
          />
          <InputDropdown
            id="bab-dropdown"
            label="BAB"
            :options="[
              { value: '1', label: 'BAB I' },
              { value: '2', label: 'BAB II' },
              { value: '3', label: 'BAB III' },
              { value: '4', label: 'BAB IV' },
              { value: '5', label: 'BAB V' }
            ]"
            placeholder="Pilih BAB"
            :value="selectedValue"
            @update:value="selectedValue = $event"
          />
          <InputTextArea
            class="sm:col-span-2"
            id="catatan-input"
            label="Catatan"
            placeholder="Masukkan catatan"
            :value="TahunAjaran"
          />
        </div>

        <Button
          class="w-fit self-end"
          type="submit"
          variant="primary"
          size="lg"
          @click.prevent="handleSubmit"
        >Kirim</Button>
      </form>
    </div>
   </div>
</template>