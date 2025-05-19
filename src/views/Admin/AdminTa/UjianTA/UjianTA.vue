<script setup>
import TabDiv from '@/components/Tugas-akhir/TabDiv.vue';
import { ref, computed, onMounted, watch } from 'vue';
import SearchBar from '@/components/Tugas-akhir/Forms/SearchBar.vue';
import ModalFilter from '@/components/Tugas-akhir/Modals/ModalFilter.vue';
import StatusLabel from '@/components/Tugas-akhir/Label.vue';
import Slider from '@/components/Tugas-akhir/Slider.vue';
import Table from '@/components/Tugas-akhir/Table.vue';
import DefaultAvatar from '@/assets/images/Profile Avatar.svg';
import Loading from '@/components/Loading.vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import DefaultModal from '@/components/Tugas-akhir/Modals/DefaultModal.vue';
import JadwalUjian from '@/components/Tugas-akhir/JadwalUjian.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import ErrorMsg from '@/components/ErrorMsg.vue';
import router from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute();

onMounted(() => {
  if (route.query.tab && tabs.some(t => t.id === route.query.tab)) {
    selectedTab.value = route.query.tab;
    // Hapus query 'tab' dari URL setelah tab aktif
    router.replace({ query: { ...route.query, tab: undefined } });
  }
});
const modalRef = ref(false);
const modalRef1 = ref(false);
const statusForm = ref(0);
// debug 
watch(statusForm, (val) => {
  if (val == 1) {
    console.log('Form Dibuka');
  } else {
    console.log('Form Ditutup');
  }
});
const isDataLoaded = ref(false);
onMounted(async () => {
  try {
    await Promise.all([]);
    isDataLoaded.value = true;
  } catch (error) {
    console.error('Error saat memuat komponen:', error);
  }
});

const statuses = [
  { value: '1', label: 'Disetujui' },
  { value: '0', label: 'Menunggu' },
  { value: '2', label: 'Ditolak' },
];

const examiners = [
  { name: 'John Batubara, A. Xioo, M. Si, A. Cer', role: 'Ketua' },
  { name: 'Dr. Sinta Wijaya, M.Kom', role: 'Anggota' },
  { name: 'Prof. Ahmad Rizal, Ph.D', role: 'Anggota' }
];

const schedule = {
  date: 'Rabu, 32 Maret 2025',
  time: '09:00 - 10:00',
  room: 'Lab. Jaringan'
};
const countPlottingDitolak = computed(() =>
  plottingPenguji.value.filter(item => item.status === '2').length
);
// Hitung jumlah pendaftar ujian dengan status '0' (Menunggu)
const countPendaftarMenunggu = computed(() =>
  pendaftarUjian.value.filter(item => item.status === '0').length
);
// Hitung jumlah penjadwalan dengan status menunggu (status === '1' dan jadwal null)
const countPenjadwalanMenunggu = computed(() =>
  pendaftarUjian.value.filter(item => item.status === '1' && !item.jadwal).length
);

const tabs = [
  {
    id: 'tab1',
    label: 'Plotting Penguji',
    icon: 'm16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10',
    count: countPlottingDitolak,
  },
  {
    id: 'tab2',
    label: 'Pendaftar',
    icon: 'm20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z',
    count: countPendaftarMenunggu,
  },
  {
    id: 'tab3',
    label: 'Penjadwalan',
    icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1-2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
    count: countPenjadwalanMenunggu,
  },
  {
    id: 'tab4',
    label: 'Berita Acara',
    icon: 'M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z',

  },
];
const jadwalUjian=ref ([

]);

const plottingPenguji = ref([
  {
    nim: '12345678',
    nama: 'John Doe',
    img: DefaultAvatar,
    judul_proposal_ta: 'Sistem Informasi Akademik',
    dosen_pembimbing: 'Dr. Budi Santoso',
    status: '1',
  },
  {
    nim: '87654321',
    nama: 'Jane Smith',
    img: DefaultAvatar,
    judul_proposal_ta: 'Pengembangan Aplikasi Mobile',
    dosen_pembimbing: 'Prof. Andi Wijaya',
    status: '0',
  },
  {
    nim: '11223344',
    nama: 'Alice Johnson',
    img: DefaultAvatar,
    judul_proposal_ta: 'Analisis Data Big Data',
    dosen_pembimbing: 'Dr. Clara Susanti',
    status: '2',
  },
]);

const pendaftarUjian = ref([
  {
    nim: '13579246',
    nama: 'Budi Prasetyo',
    img: DefaultAvatar,
    judul_ta: 'Optimasi Algoritma Genetika',
    tanggal: '2025-05-10',
    status: '1',
    jadwal: '2025-05-20',
  },
  {
    nim: '12345678',
    nama: 'John Doe',
    img: DefaultAvatar,
    judul_ta: 'Sistem Informasi Akademik',
    tanggal: '2025-05-12',
    status: '1',
    jadwal: null,
  },
  {
    nim: '24681357',
    nama: 'Siti Aminah',
    img: DefaultAvatar,
    judul_ta: 'Penerapan Machine Learning pada Prediksi Cuaca',
    tanggal: '2025-05-12',
    status: '0',
    jadwal: null,
  },
  {
    nim: '19283746',
    nama: 'Rizky Ramadhan',
    img: DefaultAvatar,
    judul_ta: 'Analisis Sistem Informasi Rumah Sakit',
    tanggal: '2025-05-15',
    status: '2',
    jadwal: null,
  },
]);

// State untuk search & filter tiap tab
const searchQueryTab1 = ref('');
const searchQueryTab2 = ref('');
const searchQueryTab3 = ref('');
const searchQueryTab4 = ref('');
const selectedStatusesTab1 = ref([]);
const selectedStatusesTab2 = ref([]);
const selectedStatusesTab3 = ref([]);
const selectedStatusesTab4 = ref([]);

// Filter & search computed mirip proposal/bimbingan
const filteredPlottingPenguji = computed(() => {
  let data = plottingPenguji.value;
  if (selectedStatusesTab1.value.length > 0) {
    data = data.filter(item =>
      selectedStatusesTab1.value.includes(item.status)
    );
  }
  const q = typeof searchQueryTab1.value === 'string'
    ? searchQueryTab1.value.toLowerCase()
    : '';
  if (!q) return data;
  return data.filter(item =>
    item.nim.toLowerCase().includes(q) ||
    item.nama.toLowerCase().includes(q) ||
    (item.judul_proposal_ta && item.judul_proposal_ta.toLowerCase().includes(q)) ||
    (item.dosen_pembimbing && item.dosen_pembimbing.toLowerCase().includes(q))
  );
});

const filteredPendaftarUjian = computed(() => {
  let data = pendaftarUjian.value;
  if (selectedStatusesTab2.value.length > 0) {
    data = data.filter(item =>
      selectedStatusesTab2.value.includes(item.status)
    );
  }
  const q = typeof searchQueryTab2.value === 'string'
    ? searchQueryTab2.value.toLowerCase()
    : '';
  if (!q) return data;
  return data.filter(item =>
    item.nim.toLowerCase().includes(q) ||
    item.nama.toLowerCase().includes(q) ||
    (item.judul_ta && item.judul_ta.toLowerCase().includes(q))
  );
});

const filteredPendaftarUjianDisetujui = computed(() => {
  let data = pendaftarUjian.value.filter(item => item.status === '1');
  if (selectedStatusesTab3.value.length > 0) {
    data = data.filter(item =>
      selectedStatusesTab3.value.includes(item.status)
    );
  }
  const q = typeof searchQueryTab3.value === 'string'
    ? searchQueryTab3.value.toLowerCase()
    : '';
  if (!q) return data;
  return data.filter(item =>
    item.nim.toLowerCase().includes(q) ||
    item.nama.toLowerCase().includes(q) ||
    (item.judul_ta && item.judul_ta.toLowerCase().includes(q))
  );
});

const filteredPendaftarUjianDisetujuiTab4 = computed(() => {
  let data = pendaftarUjian.value.filter(item => item.status === '1');
  if (selectedStatusesTab4.value.length > 0) {
    data = data.filter(item =>
      selectedStatusesTab4.value.includes(item.status)
    );
  }
  const q = typeof searchQueryTab4.value === 'string'
    ? searchQueryTab4.value.toLowerCase()
    : '';
  if (!q) return data;
  return data.filter(item =>
    item.nim.toLowerCase().includes(q) ||
    item.nama.toLowerCase().includes(q) ||
    (item.judul_ta && item.judul_ta.toLowerCase().includes(q))
  );
});

const filteredPenjadwalan = computed(() => {
  let data = pendaftarUjian.value.filter(item => item.status === '1');
  if (selectedStatusesTab3.value.length > 0) {
    data = data.filter(item =>
      selectedStatusesTab3.value.includes(item.status)
    );
  }
  const q = typeof searchQueryTab3.value === 'string'
    ? searchQueryTab3.value.toLowerCase()
    : '';
  if (!q) return data;
  return data.filter(item =>
    item.nim.toLowerCase().includes(q) ||
    item.nama.toLowerCase().includes(q) ||
    (item.judul_ta && item.judul_ta.toLowerCase().includes(q))
  );
});

// Handler filter & search tiap tab
function handleFilterTab1({ values }) {
  selectedStatusesTab1.value = values;
}
function handleFilterTab2({ values }) {
  selectedStatusesTab2.value = values;
}
function handleFilterTab3({ values }) {
  selectedStatusesTab3.value = values;
}
function handleFilterTab4({ values }) {
  selectedStatusesTab4.value = values;
}

// Handler tab change: reset search & filter tiap tab
const selectedTab = ref('tab1');
function handleTabChange(tabId) {
  selectedTab.value = tabId;
  searchQueryTab1.value = '';
  searchQueryTab2.value = '';
  searchQueryTab3.value = '';
  searchQueryTab4.value = '';
  selectedStatusesTab1.value = [];
  selectedStatusesTab2.value = [];
  selectedStatusesTab3.value = [];
  selectedStatusesTab4.value = [];
}

const formatTanggal = (tanggal) => {
  const bulan = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const [year, month, day] = tanggal.split('-');
  return `${day} ${bulan[parseInt(month, 10) - 1]} ${year}`;
};

const getStatusClass = (status) => {
  switch (status) {
    case '1':
      return 'success';
    case '0':
      return 'warning';
    case '2':
      return 'danger';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case '1':
      return 'Disetujui';
    case '0':
      return 'Menunggu';
    case '2':
      return 'Ditolak';
    default:
      return 'Tidak Diketahui';
  }
};

const handleRowClickPlot = (item) => {
  router.push({
    name: 'PlottingPengujiForAdmin',
    params: { nim: item.nim },
  });
};
const handleRowClickDaftar = (item) => {
  router.push({
    name: 'DetailPendaftarForAdmin',
    params: { nim: item.nim },
  });
};
const selectedJadwalNim = ref(null);
const handleRowClickJadwal = (item) => {
  if (item.jadwal) {
    modalRef1.value = true;
    selectedJadwalNim.value = item.nim; // simpan nim yang dipilih
  } else {
    router.push({
      name: 'PenjadwalanForAdmin',
      params: { nim: item.nim },
    });
  }
};
const handleRowClickBeritaAcara = (item) => {
  modalRef.value = true;
};
const handleEditJadwal = () => {
  modalRef1.value = false;
  router.push({ name: 'PenjadwalanForAdmin', params: { nim: selectedJadwalNim.value } });
}
</script>

<template>
  <div v-if="!isDataLoaded" class="">
    <Loading/>
  </div>

  <div>
    <router-view v-if="$route.path.includes('plotting-penguji')"></router-view>
    <router-view v-else-if="$route.path.includes('detail-pendaftar')"></router-view>
    <router-view v-else-if="$route.path.includes('penjadwalan')"></router-view>
    
    <div v-else>
      <Breadcrumb :items="breadcrumbItems" />

      <TabDiv
        :tabs="tabs"
        :use-named-slots="true"
        v-model:activeTab="selectedTab"
        @tab-changed="handleTabChange"
      >
        <template #tab1>
            <div class="flex gap-2 lg:gap-4 justify-between items-center mb-4">
              <ModalFilter
                class=""
                title="Status"
                :items="statuses"
                filterType="status"
                @apply="handleFilterTab1"
                triggerText="Status"
                :preselectedValues="selectedStatusesTab1"
              />
              <SearchBar
                v-model="searchQueryTab1"
              />
            </div>
            
              <Table
                :headers="['NIM', 'Nama','Judul Proposal Tugas Akhir', 'Dosen Pembimbing' , 'Status']"
                :items="filteredPlottingPenguji"
                @rowClick="handleRowClickPlot"
              >
                <template #row="{ item }">
                  <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-l-lg border-r border-white">
                    {{ item.nim }}
                  </td>
                  <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
                    <div class="flex items-center gap-2">
                      <img
                        v-if="item.img"
                        :src="item.img"
                        alt="Profile Image"
                        class="w-8 h-8 rounded-full"
                      />
                      {{ item.nama }}
                    </div>
                  </td>
                  <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
                    {{ item.judul_proposal_ta }}
                  </td>
                  <td class="py-3 px-3 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-3 sm:px-6 border-r border-white">
                    {{ item.dosen_pembimbing }}
                  </td>
                  <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-r-lg border-r border-white">
                    <StatusLabel
                      class="w-fit hidden lg:block "
                      :status="getStatusClass(item.status)"
                      size="md"
                      :label="getStatusLabel(item.status)"
                    />
                    <StatusLabel
                      class="w-fit lg:hidden block "
                      :status="getStatusClass(item.status)"
                      size="sm"
                      :label="getStatusLabel(item.status)"
                    />
                  </td>
                </template>
              </Table>
        </template>

        <template #tab2>
            <div class="flex flex-wrap gap-2 lg:gap-4 justify-between items-center mb-4">
              <ModalFilter
                class="flex-grow md:flex-none"
                title="Status"
                :items="statuses"
                filterType="status"
                @apply="handleFilterTab2"
                triggerText="Status"
                :preselectedValues="selectedStatusesTab2"
              />
              <SearchBar
                class="order-last md:order-none"
                v-model="searchQueryTab2"
              />
              <Slider v-model="statusForm"/>
            </div>
            
              <Table
                :headers="['NIM', 'Nama','Judul Tugas Akhir', 'Tanggal' , 'Status']"
                :items="filteredPendaftarUjian"
                @rowClick="handleRowClickDaftar"
              >
                <template #row="{ item }">
                  <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-l-lg border-r border-white">
                    {{ item.nim }}
                  </td>
                  <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
                    <div class="flex items-center gap-2">
                      <img
                        v-if="item.img"
                        :src="item.img"
                        alt="Profile Image"
                        class="w-8 h-8 rounded-full"
                      />
                      {{ item.nama }}
                    </div>
                  </td>
                  <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
                    {{ item.judul_ta }}
                  </td>
                  <td class="py-3 px-3 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-3 sm:px-6">
                    {{ formatTanggal(item.tanggal) }}
                  </td>
                  <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-r-lg border-r border-white">
                    <StatusLabel
                      class="w-fit hidden lg:block "
                      :status="getStatusClass(item.status)"
                      size="md"
                      :label="getStatusLabel(item.status)"
                    />
                    <StatusLabel
                      class="w-fit lg:hidden block "
                      :status="getStatusClass(item.status)"
                      size="sm"
                      :label="getStatusLabel(item.status)"
                    />
                  </td>
                </template>
              </Table>
        </template>

        <template #tab3>
            <div class="flex gap-2 lg:gap-4 justify-between items-center mb-4">
              <ModalFilter
                title="Status"
                :items="statuses"
                filterType="status"
                @apply="handleFilterTab3"
                triggerText="Status"
                :preselectedValues="selectedStatusesTab3"
              />
              <SearchBar
                v-model="searchQueryTab3"
              />
            </div>
            
              <Table
                :headers="['NIM', 'Nama','Judul Tugas Akhir', 'Tanggal' , 'Status']"
                :items="filteredPenjadwalan"
                @rowClick="handleRowClickJadwal"
              >
                <template #row="{ item }">
                  <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-l-lg border-r border-white">
                    {{ item.nim }}
                  </td>
                  <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
                    <div class="flex items-center gap-2">
                      <img
                        v-if="item.img"
                        :src="item.img"
                        alt="Profile Image"
                        class="w-8 h-8 rounded-full"
                      />
                      {{ item.nama }}
                    </div>
                  </td>
                  <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
                    {{ item.judul_ta }}
                  </td>
                  <td class="py-3 px-3 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-3 sm:px-6 border-r border-white">
                    {{ formatTanggal(item.tanggal) }}
                  </td>
                  <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-r-lg border-r border-white">
                    <StatusLabel
                      class="w-fit hidden lg:block"
                      :status="item.jadwal ? 'success' : 'warning'"
                      size="md"
                      :label="item.jadwal ? 'Terjadwal' : 'Menunggu'"
                    />
                    <StatusLabel
                      class="w-fit lg:hidden block"
                      :status="item.jadwal ? 'success' : 'warning'"
                      size="sm"
                      :label="item.jadwal ? 'Terjadwal' : 'Menunggu'"
                    />
                  </td>
                </template>
              </Table>
        </template>

        <template #tab4>
            <div class="flex gap-2 lg:gap-4 justify-between items-center mb-4">
              <ModalFilter
                title="Status"
                :items="statuses"
                filterType="status"
                @apply="handleFilterTab4"
                triggerText="Status"
                :preselectedValues="selectedStatusesTab4"
              />
              <SearchBar
                v-model="searchQueryTab4"
              />
            </div>
            
              <Table
                :headers="['NIM', 'Nama','Judul Tugas Akhir', 'Tanggal' , 'Status']"
                :items="filteredPendaftarUjianDisetujuiTab4"
                @rowClick="handleRowClickBeritaAcara"
              >
                <template #row="{ item }">
                  <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-l-lg border-r border-white">
                    {{ item.nim }}
                  </td>
                  <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
                    <div class="flex items-center gap-2">
                      <img
                        v-if="item.img"
                        :src="item.img"
                        alt="Profile Image"
                        class="w-8 h-8 rounded-full"
                      />
                      {{ item.nama }}
                    </div>
                  </td>
                  <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
                    {{ item.judul_ta }}
                  </td>
                  <td class="py-3 px-3 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-3 sm:px-6 border-r border-white">
                    {{ formatTanggal(item.tanggal) }}
                  </td>
                  <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-r-lg border-r border-white">
                    <StatusLabel
                      class="w-fit hidden lg:block "
                      :status="getStatusClass(item.status)"
                      size="md"
                      :label="getStatusLabel(item.status)"
                    />
                    <StatusLabel
                      class="w-fit lg:hidden block "
                      :status="getStatusClass(item.status)"
                      size="sm"
                      :label="getStatusLabel(item.status)"
                    />
                  </td>
                </template>
              </Table>
        </template>
      </TabDiv>
    </div>

    <!-- Jadwal Ujian Modal -->
    <DefaultModal
      v-if="modalRef1"
      @close="modalRef1 = false"
      headText="Jadwal Ujian Tugas Akhir"
      bodyText="Nama Mahasiswa | V3423999 | Judul Tugas Akhir"
    >
    <div class="flex flex-col gap-4">
      <JadwalUjian
        class="w-full"
        :examiners="examiners"
        :jadwal="schedule"
      />
      <div class="flex gap-4 justify-end">
        <Button
          variant="secondary"
          size="lg"
          class="w-fit"
          leftIconPath="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          @click="handleEditJadwal"
        >
          Edit
        </Button>
      </div>
    </div>
    </DefaultModal>

    <!-- Berita Acara Modal -->
    <DefaultModal
      v-if="modalRef"
      @close="modalRef = false"
      headText="Jadwal Ujian Tugas Akhir"
      bodyText="Nama Mahasiswa | V3423999 | Judul Tugas Akhir"
    >
    <div class="flex flex-col gap-4">
      <JadwalUjian
        class="w-full"
        :examiners="examiners"
        :jadwal="schedule"
      />
      <div class="flex gap-4 justify-end">
        <Button
          variant="primary"
          size="lg"
          class="w-fit"
          leftIconPath="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0-2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
        >
          Cetak Berita Acara
        </Button>
        <Button
          variant="primary"
          size="lg"
          class="w-fit"
          leftIconPath="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        >
          Cetak Lembar Revisi
        </Button>
      </div>
    </div>
    </DefaultModal>
  </div>
</template>
