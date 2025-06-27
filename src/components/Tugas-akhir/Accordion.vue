<template>
  <div class="w-full mx-auto">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="mb-3 overflow-hidden card-rounded shadow-custom"
    >
      <!-- Header information -->
      <div class="p-6 bg-white">
        <div class="flex w-full gap-2 mx-auto sm:gap-4">
          <img
            :src="DefaultAvatar"
            alt=""
            class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
          />
          <div
            class="flex flex-wrap items-center self-center justify-between w-full gap-2"
          >
            <div class="">
              <span class="body5 sm:body4-bold text-blackText">{{
                item.headText || headText
              }}</span>
              <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">
                {{ item.bodyText || bodyText }}
              </h5>
            </div>
            <div class="border-blackText lg:border-l-2 lg:pl-4">
              <span class="body5 sm:body4-bold text-blackText">{{
                item.headText2 || headText2
              }}</span>
              <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">
                {{ item.bodyText2 || bodyText2 }}
              </h5>
            </div>
            <div class="border-blackText lg:border-l-2 lg:pl-4">
              <span class="body5 sm:body4-bold text-blackText">{{
                item.headText3 || headText3
              }}</span>
              <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">
                {{ item.bodyText3 || bodyText3 }}
              </h5>
            </div>
            <div>
              <span class="body5 sm:body4-bold text-blackText">{{
                item.tahunLabel || tahunLabel
              }}</span>
              <h5 class="body5-bold sm:body3-bold lg:body2-bold text-secondary">
                {{ item.tahunAjaran || tahunAjaran }}
              </h5>
            </div>
            <div v-if="item.showStatus || showStatus" class="text-center">
              <span class="body5 sm:body4-bold text-blackText">Status</span>
              <div class="mt-1">
                <Label
                  :status="getMappedStatus(item.statusUtama || status)"
                  :label="item.statusLabelUtama || statusLabel || ''"
                  :customLabel="!!(item.statusLabelUtama || statusLabel)"
                  class="hidden w-fit h-fit lg:block"
                  size="md"
                />
                <Label
                  :status="getMappedStatus(item.statusUtama || status)"
                  :label="item.statusLabelUtama || statusLabel || ''"
                  :customLabel="!!(item.statusLabelUtama || statusLabel)"
                  class="block w-fit h-fit lg:hidden"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Buttons row -->
        <div class="flex items-center justify-end gap-2 mt-4">
          <!-- History button - conditionally rendered -->
          <Button
            v-if="shouldShowButton(item.showHistoryButton, showHistoryButton)"
            variant="primary"
            size="md"
            @click="toggleItem(index)"
            >History</Button
          >

          <!-- Daftar button - conditionally rendered -->
          <Button
            v-if="shouldShowButton(item.showDaftarButton, showDaftarButton)"
            variant="primary"
            size="md"
            @click="$emit('daftar', item.id)"
            >Daftar</Button
          >

          <!-- Berkas button - conditionally rendered -->
          <Button
            v-if="shouldShowButton(item.showBerkasButton, showBerkasButton)"
            variant="primary"
            size="md"
            @click="$emit('berkas', item.id)"
            >Berkas</Button
          >

          <!-- Berkas button - conditionally rendered -->
          <!-- Tombol detail di panel utama -->
          <Button
            v-if="shouldShowButton(item.showDetailButton, showDetailButton)"
            variant="outlined-primary"
            size="md"
            right-icon-path="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            @click="$emit('detail', item, item.jumlahUjian === 1 ? 1 : 0)"
            >Detail</Button
          >
        </div>
      </div>

      <!-- Accordion content -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="transform -translate-y-2 opacity-0 max-h-0"
        enter-to-class="transform translate-y-0 opacity-100 max-h-96"
        leave-from-class="transform translate-y-0 opacity-100 max-h-96"
        leave-to-class="transform -translate-y-2 opacity-0 max-h-0"
      >
        <div v-show="isItemOpen(index)" class="border-t border-gray-200">
          <div class="p-6 pt-4 text-gray-600">
            <!-- Item 2 (if it exists) -->
            <div v-if="item.date2" class="pb-4 mb-4 border-b border-gray-200">
              <div class="flex items-center mb-2">
                <p class="body4-bold sm:body2-bold text-primary">
                  {{ item.title2 || "Ujian 2" }}
                </p>
              </div>
              <div class="grid items-center grid-cols-1 gap-4 sm:grid-cols-5">
                <div>
                  <p class="body4-bold sm:body4-bold text-blackText">
                    Hari & Tanggal
                  </p>
                  <p class="body4 sm:body3 text-primary">
                    {{ item.date2 }}
                  </p>
                </div>
                <div>
                  <p class="body4-bold sm:body4-bold text-blackText">Ruang</p>
                  <p class="body4 sm:body3 text-primary">
                    {{ item.room2 || room }}
                  </p>
                </div>
                <div>
                  <p class="body4-bold sm:body4-bold text-blackText">Sesi</p>
                  <p class="body4 sm:body3 text-primary">
                    {{ item.time2 || time }}
                  </p>
                </div>
                <!-- Status (jika ada) -->
                <div
                  v-if="item.showStatus || showStatus"
                  class="flex flex-col justify-center"
                >
                  <p
                    class="text-center body4-bold sm:body4-bold text-blackText"
                  >
                    Status
                  </p>
                  <Label
                    :status="getMappedStatus(item.status2 || status)"
                    :label="item.statusLabel2 || statusLabel || ''"
                    :customLabel="!!(item.statusLabel2 || statusLabel)"
                    size="md"
                    class="self-center w-fit"
                  />
                </div>
                <!-- Button Detail -->
                <div class="flex justify-end mt-4">
                  <Button
                    class="self-center h-fit"
                    variant="outlined-primary"
                    right-icon-path="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    size="md"
                    @click="$emit('detail', item, 0)"
                    >Detail</Button
                  >
                </div>
              </div>
            </div>
            <!-- Item 1 -->
            <div class="">
              <div class="flex items-center mb-2">
                <p class="body4-bold sm:body2-bold text-primary">
                  {{ item.title1 || "Ujian 1" }}
                </p>
              </div>
              <div class="grid items-center grid-cols-1 gap-4 sm:grid-cols-5">
                <div>
                  <p class="body4-bold sm:body4-bold text-blackText">
                    Hari & Tanggal
                  </p>
                  <p class="body4 sm:body3 text-primary">
                    {{ item.date1 || date }}
                  </p>
                </div>
                <div>
                  <p class="body4-bold sm:body4-bold text-blackText">Ruang</p>
                  <p class="body4 sm:body3 text-primary">
                    {{ item.room1 || room }}
                  </p>
                </div>
                <div>
                  <p class="body4-bold sm:body4-bold text-blackText">Sesi</p>
                  <p class="body4 sm:body3 text-primary">
                    {{ item.time1 || time }}
                  </p>
                </div>
                <!-- Status (jika ada) -->
                <div
                  v-if="item.showStatus || showStatus"
                  class="flex flex-col justify-center"
                >
                  <p
                    class="text-center body4-bold sm:body4-bold text-blackText"
                  >
                    Status
                  </p>
                  <Label
                    :status="getMappedStatus(item.status1 || status)"
                    :label="item.statusLabel1 || statusLabel || ''"
                    :customLabel="!!(item.statusLabel1 || statusLabel)"
                    size="md"
                    class="self-center w-fit"
                  />
                </div>
                <!-- Button Detail -->
                <div class="flex justify-end mt-4">
                  <Button
                    class="self-center h-fit"
                    variant="outlined-primary"
                    right-icon-path="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    size="md"
                    @click="$emit('detail', item, 1)"
                    >Detail</Button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DefaultAvatar from "@/assets/images/Profile Avatar.svg";
import Label from "@/components/Tugas-akhir/Label.vue";
import Button from "@/components/Tugas-akhir/Button.vue";

// Define emits untuk event handler
const emit = defineEmits(["detail", "daftar", "berkas"]);

// Mendefinisikan props yang diterima komponen ini
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  // Header props (fallback jika tidak disediakan dalam items)
  headText: { type: String, default: "" },
  bodyText: { type: String, default: "" },
  headText2: { type: String, default: "" },
  bodyText2: { type: String, default: "" },
  headText3: { type: String, default: "" },
  bodyText3: { type: String, default: "" },
  tahunLabel: { type: String, default: "Tahun Ajaran" },
  tahunAjaran: { type: String, default: "" },

  // Detail props (fallback jika tidak disediakan dalam items)
  date: { type: String, default: "" },
  time: { type: String, default: "" },
  room: { type: String, default: "" },

  // Status related props
  showStatus: { type: Boolean, default: false },
  useCustomStatus: { type: Boolean, default: false },
  status: { type: String, default: "" },
  statusLabel: { type: String, default: "" },

  // Button visibility props (now become defaults)
  showHistoryButton: { type: Boolean, default: true },
  showDaftarButton: { type: Boolean, default: true },
  showBerkasButton: { type: Boolean, default: true },
  showDetailButton: { type: Boolean, default: true },

  // Option untuk multiple open
  allowMultiple: { type: Boolean, default: true },
});

// State untuk melacak item yang sedang terbuka (Set untuk multiple open)
const openItems = ref(new Set());

// Fungsi untuk memeriksa apakah item terbuka
const isItemOpen = (index) => {
  return openItems.value.has(index);
};

// Fungsi untuk membuka/menutup item
const toggleItem = (index) => {
  if (isItemOpen(index)) {
    // Jika item sudah terbuka, tutup
    openItems.value.delete(index);
  } else {
    // Jika item tertutup, buka
    if (!props.allowMultiple) {
      // Jika tidak boleh multiple, tutup semua dulu
      openItems.value.clear();
    }
    openItems.value.add(index);
  }
};

// Helper function untuk menentukan apakah tombol harus ditampilkan
const shouldShowButton = (itemConfig, defaultConfig) => {
  // Jika itemConfig adalah boolean, gunakan itu
  if (typeof itemConfig === "boolean") {
    return itemConfig;
  }
  // Jika tidak, fallback ke default global
  return defaultConfig;
};

// Fungsi untuk memetakan nilai status ke className yang sesuai
const getMappedStatus = (status) => {
  if (!status) return "warning";

  switch (status.toLowerCase()) {
    case "approved":
    case "success":
    case "active":
    case "diterima":
    case "disetujui":
      return "success";
    case "rejected":
    case "error":
    case "danger":
    case "ditolak":
      return "danger";
    case "warning":
    case "waiting":
    case "pending":
    case "menunggu":
      return "warning";
    case "warning-outline":
      return "warning-outline";
    case "success-outline":
      return "success-outline";
    case "danger-outline":
      return "danger-outline";
    case "inactive":
    case "nonaktif":
      return "inactive";
    default:
      return "warning";
  }
};
</script>

<style scoped>
/* Class 'max-h-96' pada transisi digunakan untuk memberikan nilai maksimal
   yang cukup besar agar konten bisa tampil sepenuhnya. Anda bisa menyesuaikannya
   jika konten Anda lebih panjang.
*/
</style>
