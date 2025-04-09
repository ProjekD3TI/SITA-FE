<template>
    <header class="header">
        <div class="container">
            <div class="header__content">
                <div class="header__logo">
                    <h1>Pelaporan D3 TI SV UNS</h1>
                </div>
                <div class="header__user">
                    <span class="username">{{ userData?.name || "Mahasiswa" }}</span>
                    <button @click="logout" class="btn-logout">Keluar</button>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import VueCookies from 'vue-cookies';
import { decryptData } from '../../../../services/encrypt'; // Adjust path as needed

export default {
  name: 'PelaporanHeader',
  props: {
    // Accept userData as a prop from parent
    userData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // Local userData if not provided by parent
      localUserData: null
    };
  },
  computed: {
    // Use either prop userData or local userData
    user() {
      return this.userData || this.localUserData || {};
    },
    
    // Computed properties for user information
    userName() {
      if (this.user && (this.user.name || this.user.username)) {
        return this.user.name || this.user.username;
      }
      return 'User';
    }
  },
  methods: {
    // Get user data from cookie
    getUserData() {
      try {
        // First try localStorage
        const userInfo = JSON.parse(localStorage.getItem('user'));
        if (userInfo) {
          this.localUserData = userInfo;
          return;
        }
        
        // Then try cookies
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          this.localUserData = decryptData(encryptedUserData);
        }
      } catch (error) {
        console.error("Error getting user data:", error);
      }
    }
  },
  created() {
    // Get user data if not provided by parent
    if (!this.userData) {
      this.getUserData();
    }
  }
};
</script>

<style scoped>
.header {
    background-color: #f8f9fa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.header__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header__logo h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
}

.header__nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

.header__nav li {
    margin-left: 1.5rem;
}

.header__nav a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s ease;
}

.header__nav a:hover,
.header__nav a.router-link-active {
    color: #007bff;
}

.header__user {
    display: flex;
    align-items: center;
}

.username {
    margin-right: 1rem;
    font-weight: 500;
}

.btn-logout {
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-logout:hover {
    background-color: #c82333;
}
</style>