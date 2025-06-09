<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// Optional prop for manually provided items (as fallback)
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  homeIcon: {
    type: Boolean,
    default: true,
  },
});

// Function to resolve route parameters in path
const resolveRoutePath = (path) => {
  if (!path) return path;

  // Get current route params
  const params = route.params;
  let resolvedPath = path;

  // Replace all dynamic segments with actual parameter values
  Object.keys(params).forEach((param) => {
    const paramPlaceholder = `:${param}`;
    if (resolvedPath.includes(paramPlaceholder)) {
      resolvedPath = resolvedPath.replace(paramPlaceholder, params[param]);
    }
  });

  return resolvedPath;
};

const breadcrumbItems = computed(() => {
  // Jika props.items ada, pakai itu
  if (props.items && props.items.length > 0) {
    return props.items.map((item) => ({
      ...item,
      path: item.path ? resolveRoutePath(item.path) : null,
    }));
  }

  // Jika tidak, generate otomatis dari route meta
  const routeMatched = route.matched;
  return routeMatched
    .filter((item) => item.meta && item.meta.breadcrumb)
    .map((item, index) => {
      const isLast =
        index ===
        routeMatched.filter((route) => route.meta && route.meta.breadcrumb)
          .length -
          1;
      return {
        label: item.meta.breadcrumb,
        path: isLast ? null : resolveRoutePath(item.path),
        active: isLast,
      };
    });
});
</script>

<template>
  <div class="pb-2 sm:pb-4">
    <div class="flex items-center gap-2 align-middle">
      <svg
        v-if="homeIcon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-4 h-4 text-[#384551] bg-transparent sm:w-5 sm:h-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>

      <ol class="flex items-center gap-2 pt-0.5 sm:pt-1">
        <li
          v-for="(item, index) in breadcrumbItems"
          :key="index"
          class="inline-flex items-center"
        >
          <template v-if="index !== 0">
            <svg
              class="w-3.5 h-3.5 me-2 text-[#384551]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
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
            class="text-[#384551] body5 sm:text-[13px] hover:text-primary"
          >
            {{ item.label }}
          </router-link>

          <span
            v-else
            :class="[
              '',
              item.active
                ? 'text-primary body5-bold sm:text-[13px]'
                : 'text-placholder body5 sm:text-[13px]',
            ]"
          >
            {{ item.label }}
          </span>
        </li>
      </ol>
    </div>
  </div>
</template>
