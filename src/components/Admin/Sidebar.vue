<template>
  <div>
    <button
      class="fixed top-2 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md text-gray-800 focus:outline-none"
      @click="toggleSidebar"
      v-if="isCollapsed && isMobile"
    >
      <i class="fas fa-bars text-xl"></i>
    </button>

    <aside
      class="fixed left-0 top-0 h-screen bg-indigo-600 text-white transition-all duration-300 z-40"
      :class="{
        'w-64': !isCollapsed,
        'w-16': isCollapsed && !isMobile,
        'w-64 -translate-x-full': isCollapsed && isMobile,
      }"
    >
      <div
        class="flex items-center justify-between h-16 px-4 border-b border-indigo-700"
      >
        <router-link
          to="/admin/dashboard"
          class="font-bold text-xl truncate"
          v-if="!isCollapsed || isMobile"
        >
          Admin Panel
        </router-link>
        <button
          class="p-1 hover:bg-indigo-700 rounded-md transition-colors"
          @click="toggleSidebar"
        >
          <i
            :class="[
              'fas',
              isCollapsed && !isMobile ? 'fa-chevron-right' : 'fa-chevron-left',
            ]"
          ></i>
        </button>
      </div>

      <nav class="flex flex-col p-2 overflow-y-auto h-[calc(100vh-4rem)]">
        <router-link
          :to="getDashboardRoute()"
          class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          @click="closeSidebar"
        >
          <i class="fas fa-tachometer-alt text-xl"></i>
          <span class="ml-3" :class="{ hidden: isCollapsed && !isMobile }"
            >Dashboard</span
          >
        </router-link>

        <template v-if="userRole === 'superadmin'">
          <div class="mt-2">
            <button
              class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors group"
              @click="handleDropdownClick('users')"
            >
              <div class="flex items-center min-w-0 flex-1">
                <i class="fas fa-users text-xl flex-shrink-0"></i>
                <span
                  class="ml-3 truncate"
                  :class="{ hidden: isCollapsed && !isMobile }"
                >
                  User Management
                </span>
              </div>
              <i
                class="fas flex-shrink-0 ml-2 transition-transform"
                :class="[
                  dropdownStates.users ? 'fa-chevron-up' : 'fa-chevron-down',
                  { hidden: isCollapsed && !isMobile },
                ]"
              ></i>
            </button>

            <div
              v-if="dropdownStates.users"
              class="pl-4 mt-1 space-y-1"
              :class="{ hidden: isCollapsed && !isMobile }"
            >
              <router-link
                to="/superadmin/users"
                class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors min-w-0"
                @click="closeSidebar"
              >
                <span class="truncate">Create Dosen</span>
              </router-link>
              <router-link
                to="/superadmin/create-user"
                class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                @click="closeSidebar"
              >
                <span>Create Admin</span>
              </router-link>
            </div>
          </div>
        </template>

        <template v-if="['superadmin', 'admin_ta'].includes(userRole)">
          <div class="mt-2">
            <button
              class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors group"
              @click="handleDropdownClick('test')"
            >
              <div class="flex items-center min-w-0 flex-1">
                <i class="fas fa-graduation-cap text-xl flex-shrink-0"></i>
                <span
                  class="ml-3 truncate"
                  :class="{ hidden: isCollapsed && !isMobile }"
                >
                  test
                </span>
              </div>
              <i
                class="fas flex-shrink-0 ml-2 transition-transform"
                :class="[
                  dropdownStates.test ? 'fa-chevron-up' : 'fa-chevron-down',
                  { hidden: isCollapsed && !isMobile },
                ]"
              ></i>
            </button>

            <div
              v-if="dropdownStates.test"
              class="pl-4 mt-1 space-y-1"
              :class="{ hidden: isCollapsed && !isMobile }"
            >
              <router-link
                :to="getRouteByRole('test')"
                class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                @click="closeSidebar"
              >
                <span>test1</span>
              </router-link>
              <router-link
                :to="getRouteByRole('test-schedules')"
                class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                @click="closeSidebar"
              >
                <span>test2</span>
              </router-link>
            </div>
          </div>
        </template>

        <template v-if="['superadmin', 'admin_pengelola'].includes(userRole)">
          <div class="mt-2">
            <button
              class="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors group"
              @click="handleDropdownClick('test2')"
            >
              <div class="flex items-center min-w-0 flex-1">
                <i class="fas fa-cogs text-xl flex-shrink-0"></i>
                <span
                  class="ml-3 truncate"
                  :class="{ hidden: isCollapsed && !isMobile }"
                >
                  test2
                </span>
              </div>
              <i
                class="fas flex-shrink-0 ml-2 transition-transform"
                :class="[
                  dropdownStates.test2 ? 'fa-chevron-up' : 'fa-chevron-down',
                  { hidden: isCollapsed && !isMobile },
                ]"
              ></i>
            </button>

            <div
              v-if="dropdownStates.test2"
              class="pl-4 mt-1 space-y-1"
              :class="{ hidden: isCollapsed && !isMobile }"
            >
              <router-link
                :to="getRouteByRole('inventory')"
                class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                @click="closeSidebar"
              >
                <span>test1</span>
              </router-link>
              <router-link
                :to="getRouteByRole('maintenance')"
                class="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                @click="closeSidebar"
              >
                <span>test2</span>
              </router-link>
            </div>
          </div>
        </template>
      </nav>
    </aside>

    <div
      v-if="!isCollapsed && isMobile"
      class="fixed inset-0 bg-black bg-opacity-50 z-30"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { authAdmin } from "../../services/authAdmin";

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle-sidebar"]);

const isCollapsed = ref(props.isCollapsed);
const isMobile = ref(props.isMobile);
const dropdownStates = ref({
  users: false,
  test: false,
  test2: false,
});
const router = useRouter();

const { user, role } = authAdmin();
const userRole = computed(() => role.value);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  emit("toggle-sidebar", isCollapsed.value);
};

const handleDropdownClick = (key) => {
  if (isCollapsed.value && !isMobile.value) {
    isCollapsed.value = false;
    emit("toggle-sidebar", isCollapsed.value);
  } else {
    dropdownStates.value[key] = !dropdownStates.value[key];
  }
};

const closeSidebar = () => {
  if (isMobile.value) {
    isCollapsed.value = true;
    emit("toggle-sidebar", isCollapsed.value);
  }
};

watch(
  () => props.isCollapsed,
  (newVal) => {
    isCollapsed.value = newVal;
    if (!newVal && !isMobile.value) {
      Object.keys(dropdownStates.value).forEach((key) => {
        dropdownStates.value[key] = false;
      });
    }
  }
);

const handleResize = () => {
  isMobile.value = window.innerWidth <= 991.98;
};

const getDashboardRoute = () => {
  if (!userRole.value) return { name: "DashboardAdmin" };

  switch (userRole.value) {
    case "superadmin":
      return { name: "DashboardSuperadmin" };
    case "admin_ta":
      return { name: "DashboardAdminTa" };
    case "admin_pengelola":
      return { name: "DashboardAdminPengelola" };
    default:
      return { name: "DashboardAdmin" };
  }
};

const getRouteByRole = (routeName) => {
  if (!userRole.value) return "/admin/" + routeName;

  switch (userRole.value) {
    case "superadmin":
      return `/superadmin/${routeName}`;
    case "admin_ta":
      return `/admin-ta/${routeName}`;
    case "admin_pengelola":
      return `/admin-pengelola/${routeName}`;
    default:
      return `/admin/${routeName}`;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.w-16 .flex.items-center {
  justify-content: center;
}

.w-16 .flex.items-center i {
  margin: 0;
}

.w-16 span:not(.hidden) {
  display: none;
}

.truncate {
  max-width: 150px;
}
</style>
