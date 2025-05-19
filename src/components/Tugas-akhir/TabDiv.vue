<script setup>
import { computed, ref, useSlots, watch } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => []
  },
  defaultTab: {
    type: String,
    default: ''
  },
  useNamedSlots: {
    type: Boolean,
    default: false
  },
  activeTab: { 
    type: String, 
    default: '' 
  },
});

const emit = defineEmits(['tab-changed','update:activeTab']);
const slots = useSlots();
const internalActiveTab = ref(props.activeTab || props.defaultTab || (props.tabs[0]?.id || ''));

const tabItems = computed(() => {
  return props.tabs.map(tab => ({
    id: tab.id || String(Math.random()),
    label: tab.label || 'Tab',
    icon: tab.icon || null,
    count: tab.count,
    countClass: tab.countClass || ''
  }));
});

watch(() => props.activeTab, (val) => {
  if (val && val !== internalActiveTab.value) {
    internalActiveTab.value = val;
  }
});
function selectTab(tabId) {
  internalActiveTab.value = tabId;
  emit('tab-changed', tabId);
  emit('update:activeTab', tabId);
}

defineExpose({
  name: 'TabComponent',
  activeTab: internalActiveTab
});
</script>

<template>
  <div class="mx-auto">
    <!-- Tab Navigation -->
    <div class="flex -space-x-1 2xl:-space-x-2">
      <button
        v-for="tab in tabItems"
        :key="tab.id"
        class="py-3 xl:py-4 body3-bold flex gap-2 items-center duration-200 transition-all ease-in-out"
        :class="[
          internalActiveTab === tab.id 
            ? 'text-primary trapezium-tab z-10 pe-8 lg:pe-12 ps-4 lg:ps-6' 
            : 'hover:opacity-100 trapezium-tab opacity-50 pe-5 xl:pe-8 2xl:pe-12 ps-4 xl:ps-6'
        ]"
        @click="selectTab(tab.id)"
      >
        <!-- Icon Tab (jika ada) -->
        <svg 
          v-if="tab.icon" 
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-6 h-6 relative z-20"
        >
          <path :d="tab.icon" />
        </svg>

        <!-- Teks Tab -->
        <span class="2xl:inline relative z-20" 
            :class="[
            internalActiveTab === tab.id 
              ? 'hidden sm:inline' 
              : 'hidden'
          ]">
          {{ tab.label }} 
          <!-- Counter/Badge (jika ada) -->
          <span 
            v-if="tab.count !== undefined" 
            class="text-sm px-2 py-0.5 ml-1 rounded-full text-white"
            :class="[
              internalActiveTab === tab.id 
                ? 'bg-secondary' 
                : 'bg-placeholder',
              tab.countClass || ''
            ]"
          >
            {{ tab.count }}
          </span>
        </span>
        <div v-if="tab.count !== undefined && internalActiveTab != tab.id" class="2xl:hidden absolute top-2 right-4 xl:top-4 xl:right-4 w-3 h-3 bg-secondary rounded-full border-2 border-white z-20 duration-200"></div>
      </button>
    </div>
    
    <!-- Tab Content - Animated -->
    <div class="rounded-r-[16px] rounded-bl-[16px] bg-white p-4 lg:p-8 overflow-x-auto">
      <slot v-if="!useNamedSlots" :active-tab="internalActiveTab"></slot>
      <template v-else>
        <transition name="fade-slide" mode="out-in">
          <div v-if="internalActiveTab" :key="internalActiveTab">
            <slot :name="internalActiveTab" :tab="tabItems.find(t => t.id === internalActiveTab)"></slot>
          </div>
        </transition>
      </template>
    </div>
  </div>
</template>

<style scoped>
.trapezium-tab {
  position: relative;
}

/* Shadow Shape - slightly offset and below */
.trapezium-tab::after {
  content: '';
  position: absolute;
  top: 4px;
  left: -4px;
  right: -2px;
  bottom: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  clip-path: polygon(0% 28.07%,0% 28.07%,0.078% 23.517%,0.303% 19.198%,0.664% 15.17%,1.148% 11.492%,1.742% 8.222%,2.435% 5.416%,3.215% 3.133%,4.068% 1.431%,4.983% 0.367%,5.948% 0%,83.447% 0%,83.447% 0%,84.057% 0.148%,84.654% 0.584%,85.234% 1.297%,85.794% 2.278%,86.329% 3.515%,86.835% 4.999%,87.308% 6.718%,87.744% 8.661%,88.139% 10.819%,88.489% 13.181%,100% 100%,0% 100%,0% 28.07%);
  z-index: -1;
  filter: blur(100px);
}

.trapezium-tab::before {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  clip-path: polygon(0% 28.07%,0% 28.07%,0.078% 23.517%,0.303% 19.198%,0.664% 15.17%,1.148% 11.492%,1.742% 8.222%,2.435% 5.416%,3.215% 3.133%,4.068% 1.431%,4.983% 0.367%,5.948% 0%,83.447% 0%,83.447% 0%,84.057% 0.148%,84.654% 0.584%,85.234% 1.297%,85.794% 2.278%,86.329% 3.515%,86.835% 4.999%,87.308% 6.718%,87.744% 8.661%,88.139% 10.819%,88.489% 13.181%,100% 100%,0% 100%,0% 28.07%);
  z-index: 0;
}

/* Fade-slide transition for tab content */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>