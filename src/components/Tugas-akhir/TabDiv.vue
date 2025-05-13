<template>
  <div class="mx-auto p-4">
    <!-- Tab Navigation -->
    <div class="flex -space-x-1 lg:-space-x-2">
      <button
        v-for="tab in tabItems"
        :key="tab.id"
        class="py-2 lg:py-4 ps-4 lg:ps-6 pe-6 lg:pe-12 body3-bold relative flex gap-2 items-center duration-200 transition-all ease-in-out"
        :class="[
          activeTab === tab.id 
            ? 'text-primary trapezium-tab z-10' 
            : 'hover:opacity-100 trapezium-tab opacity-50'
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
        <span class="hidden lg:inline relative z-20">
          {{ tab.label }} 
          <!-- Counter/Badge (jika ada) -->
          <span 
            v-if="tab.count !== undefined" 
            class="text-sm px-2 py-0.5 ml-1 rounded-full text-white"
            :class="[
              activeTab === tab.id 
                ? 'bg-primary' 
                : 'bg-placeholder',
              tab.countClass || ''
            ]"
          >
            {{ tab.count }}
          </span>
        </span>
      </button>
    </div>
    
    <!-- Tab Content -->
    <div class="rounded-r-[16px] rounded-bl-[16px] bg-white p-4 lg:p-8">
      <slot v-if="!useNamedSlots" :active-tab="activeTab"></slot>
      
      <!-- Named slots for each tab -->
      <template v-else>
        <div v-for="tab in tabItems" :key="tab.id" v-show="activeTab === tab.id">
          <slot :name="tab.id" :tab="tab"></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useSlots } from 'vue';

/**
 * Definisi props dengan TypeScript-like object syntax
 */
const props = defineProps({
  /**
   * Array of tab items with the following structure:
   * {
   *   id: String (unique identifier),
   *   label: String (tab label),
   *   icon: String (optional SVG path),
   *   count: Number|undefined (optional count/notification),
   *   countClass: String (optional CSS classes for count)
   * }
   */
  tabs: {
    type: Array,
    required: true,
    default: () => []
  },
  
  /**
   * ID of the initially active tab
   */
  defaultTab: {
    type: String,
    default: ''
  },

  /**
   * Whether to use named slots for each tab
   */
  useNamedSlots: {
    type: Boolean,
    default: false
  }
});

/**
 * Definisi emits
 */
const emit = defineEmits(['tab-changed']);

/**
 * Access slots to determine if named slots are being used
 */
const slots = useSlots();

/**
 * State for active tab
 */
const activeTab = ref(props.defaultTab || (props.tabs[0]?.id || ''));

/**
 * Processed tab items with defaults applied
 */
const tabItems = computed(() => {
  return props.tabs.map(tab => ({
    id: tab.id || String(Math.random()),
    label: tab.label || 'Tab',
    icon: tab.icon || null,
    count: tab.count,
    countClass: tab.countClass || ''
  }));
});

/**
 * Select a tab and emit change event
 */
function selectTab(tabId) {
  activeTab.value = tabId;
  emit('tab-changed', tabId);
}

/**
 * Expose component name for debugging
 */
defineExpose({
  name: 'TabComponent',
  activeTab
});
</script>

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
</style>