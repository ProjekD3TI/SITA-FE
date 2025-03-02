<template>
  <nav class="bg-indigo-600 shadow-md px-4 py-2 mb-4 sticky top-0 z-10">
    <ul class="flex items-center justify-end">
      <li class="relative mx-1">
        <button
          class="flex items-center text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
          @click="toggleNotifications"
        >
          <i class="fas fa-bell"></i>
          <span
            v-if="unreadNotifications"
            class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full"
          >
            {{ unreadNotifications }}
          </span>
        </button>

        <div
          v-if="notificationsOpen"
          class="absolute right-0 mt-2 w-80 md:w-96 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-lg z-20"
        >
          <div class="p-3 bg-gray-100 border-b border-gray-200">
            <h6 class="font-medium text-gray-700">Notifications Center</h6>
          </div>

          <ul class="divide-y divide-gray-200">
            <li v-for="notification in notifications" :key="notification.id">
              <button
                class="w-full p-3 flex items-start hover:bg-gray-50 transition-colors"
                @click="markAsRead(notification)"
              >
                <div class="flex-shrink-0 mr-3">
                  <div
                    :class="[
                      'w-10 h-10 flex items-center justify-center rounded-full',
                      `bg-${notification.type || 'blue'}-500`,
                    ]"
                  >
                    <i
                      :class="[
                        'fas',
                        notification.icon || 'fa-info-circle',
                        'text-white',
                      ]"
                    ></i>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs text-gray-500">{{ notification.date }}</p>
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-gray-700 truncate">
                    {{ notification.message }}
                  </p>
                </div>
              </button>
            </li>
          </ul>

          <div
            v-if="notifications.length === 0"
            class="p-4 text-center text-gray-600"
          >
            No notifications
          </div>

          <div class="p-2 text-center border-t border-gray-200">
            <button class="text-sm text-indigo-600 hover:text-indigo-800">
              Show All Notifications
            </button>
          </div>
        </div>
      </li>

      <li class="relative">
        <button
          class="flex items-center text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
          @click="toggleUserMenu"
        >
          <span class="mr-2 text-sm hidden sm:block">{{
            truncatedUserName
          }}</span>
          <img
            :src="profileImg"
            class="h-8 w-8 rounded-full object-cover"
            alt="Profile"
          />
        </button>

        <div
          v-if="userMenuOpen"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20"
        >
          <router-link
            :to="{ name: 'ProfileDosen' }"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
            Profile
          </router-link>
          <button
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="showLogoutModal"
          >
            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
            Logout
          </button>
        </div>
      </li>
    </ul>
  </nav>

  <div
    v-if="isLogoutModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
      <div
        class="flex items-center justify-between p-4 border-b border-gray-200"
      >
        <h5 class="text-lg font-medium">Ready to Leave?</h5>
        <button
          @click="isLogoutModalOpen = false"
          class="text-gray-400 hover:text-gray-500"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="p-4">
        <p>
          Select "Logout" below if you are ready to end your current session.
        </p>
      </div>
      <div class="flex justify-end p-4 border-t border-gray-200">
        <button
          @click="isLogoutModalOpen = false"
          class="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import VueCookies from "vue-cookies";
import defaultProfileImg from "../../assets/images/d3ti-logo.png";
import { encryptData, decryptData } from "../../services/encrypt";
import { authDosen } from "../../services/authDosen";

const router = useRouter();
const userName = ref("");
const profileImg = ref(defaultProfileImg);
const notifications = ref([]);
const notificationsOpen = ref(false);
const userMenuOpen = ref(false);
const isLogoutModalOpen = ref(false);
const { logout } = authDosen();

const toggleNotifications = () => {
  notificationsOpen.value = !notificationsOpen.value;
  if (notificationsOpen.value) {
    userMenuOpen.value = false;
  }
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
  if (userMenuOpen.value) {
    notificationsOpen.value = false;
  }
};

const handleClickOutside = (event) => {
  if (notificationsOpen.value || userMenuOpen.value) {
    if (!event.target.closest("nav")) {
      notificationsOpen.value = false;
      userMenuOpen.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  fetchUserData();
});

// const fetchNotifications = async () => {
//   try {
//     const token = VueCookies.get("auth_token");
//     if (!token) return;

//     const response = await axios.get("api/notification", {
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       withCredentials: true,
//     });

//     notifications.value = response.data.map((notification) => ({
//       id: notification.id_notification,
//       type: notification.type || "blue",
//       icon: notification.icon || "fa-info-circle",
//       message: notification.message,
//       title: notification.title,
//       date: notification.date || new Date().toISOString().split("T")[0],
//     }));
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//   }
// };

const unreadNotifications = computed(() => notifications.value.length);

const markAsRead = async (notification) => {
  try {
    const token = VueCookies.get("auth_token");
    if (!token) return;

    await axios.put(
      `/api/notification/read/${notification.id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    notifications.value = notifications.value.filter(
      (n) => n.id !== notification.id
    );
    notificationsOpen.value = false;
  } catch (error) {
    console.error(
      "Error marking notification as read:",
      error.response?.data || error
    );
  }
};

const truncatedUserName = computed(() => {
  return userName.value.trim().split(" ")[0];
});

const fetchUserData = () => {
  try {
    const encryptedUserData = VueCookies.get("user_session");
    if (encryptedUserData) {
      const userData = decryptData(encryptedUserData);
      if (userData && userData.name) {
        userName.value = userData.name.trim();
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    router.push("/");
  }
};

const showLogoutModal = () => {
  isLogoutModalOpen.value = true;
  userMenuOpen.value = false;
};

const handleLogout = () => {
  isLogoutModalOpen.value = false;
  userMenuOpen.value = false;
  logout();
};
</script>
