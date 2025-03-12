<template>
    <header class="header">
        <div class="container">
            <div class="header__content">
                <div class="header__logo">
                    <h1>Pelaporan D3 TI SV UNS</h1>
                </div>
                <div class="header__user">
                    <span class="username">{{ username }}</span>
                    <button @click="logout" class="btn-logout">Keluar</button>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'PelaporanHeader',
    data() {
        return {
            username: 'User'
        }
    },
    methods: {
        logout() {
            // Handle logout logic here
            this.$emit('logout');
            // or use Vuex action or router
            // this.$store.dispatch('auth/logout');
            // this.$router.push('/login');
        }
    }
}
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