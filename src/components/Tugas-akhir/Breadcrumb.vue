<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Optional prop for manually provided items (as fallback)
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  homeIcon: {
    type: Boolean,
    default: true
  }
});

const breadcrumbItems = computed(() => {
  // If items are provided explicitly, use them
  if (props.items && props.items.length > 0) {
    return props.items;
  }

  // Otherwise, build from route
  const routeMatched = route.matched;
  return routeMatched
    .filter(item => item.meta && item.meta.breadcrumb)
    .map((item, index) => {
      const isLast = index === routeMatched.filter(route => route.meta && route.meta.breadcrumb).length - 1;
      return {
        label: item.meta.breadcrumb,
        path: isLast ? null : item.path,
        active: isLast
      };
    });
});
</script>

<template>
  <div class="pb-6">
    <div class="flex gap-2 sm:gap-4 items-center">
      <svg 
        v-if="homeIcon" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke-width="2" 
        stroke="currentColor" 
        class="sm:w-5 sm:h-5 w-4 h-4 text-black"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" 
        />
      </svg>

      <nav class="flex" aria-label="Breadcrumb">
        <ol class="flex items-center gap-2 sm:gap-4">
          <li v-for="(item, index) in breadcrumbItems" :key="index" class="inline-flex items-center">
            <template v-if="index !== 0">
              <svg 
                class="w-3 h-3 me-2 sm:me-4 text-black" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="2" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="m8.25 4.5 7.5 7.5-7.5 7.5" 
                />
              </svg>
            </template>
            <router-link 
              v-if="item.path && !item.active" 
              :to="item.path" 
              class="body5-bold sm:body4-bold text-placeholder hover:text-primary"
            >
              {{ item.label }}
            </router-link>

            <span 
              v-else
              :class="[
                'body5-bold sm:body4-bold', 
                item.active ? 'text-primary' : 'text-placholder'
              ]"
            >
              {{ item.label }}
            </span>
          </li>
        </ol>
      </nav>
    </div>
  </div>
</template>