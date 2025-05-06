<script setup>
import Button from '@/components/Tugas-akhir/Button.vue';

</script>
<template>
    <div class="flex gap-4">
        <router-link to="/mahasiswa/tugas-akhir" >        
            <Button
            variant="primary"
            size="md"
            >
                TA
            </Button>
        </router-link>
        <router-link to="/mahasiswa/ruang-inventaris" >        
            <Button
            variant="primary"
            size="md"
            >
                Ruang Inventaris
            </Button>
        </router-link>
        <router-link to="/mahasiswa/pelaporan" >        
            <Button
            variant="primary"
            size="md"
            >
                Pelaporan
            </Button>
        </router-link>

    </div>
</template>