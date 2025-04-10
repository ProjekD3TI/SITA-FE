<template>
    <div class="sidebar-pelaporan" :class="{ 'collapsed': isCollapsed }">
        <div class="sidebar-header">
            <h3>Pelaporan</h3>
            <button class="toggle-btn" @click="toggleSidebar">
                <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
            </button>
        </div>
        <div class="sidebar-menu">
            <router-link to="/pelaporan/kejadian" class="sidebar-item" active-class="active">
                <span class="icon"><i class="fas fa-exclamation-triangle"></i></span>
                <span class="text">Pelaporan Kejadian</span>
            </router-link>
            <router-link to="/pelaporan/kekerasan-seksual" class="sidebar-item" active-class="active">
                <span class="icon"><i class="fas fa-shield-alt"></i></span>
                <span class="text">Pelaporan Kekerasan Seksual</span>
            </router-link>
            
            <div class="separator"></div>
            
            <router-link to="/dashboard" class="sidebar-item" active-class="active">
                <span class="icon"><i class="fas fa-home"></i></span>
                <span class="text">Kembali ke Landing Page</span>
            </router-link>
            <router-link to="/" class="sidebar-item logout" active-class="active">
                <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
                <span class="text">Logout</span>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PelaporanSidebar',
    data() {
        return {
            isCollapsed: false
        }
    },
    methods: {
        toggleSidebar() {
            this.isCollapsed = !this.isCollapsed;
        }
    }
}
</script>

<style scoped>
.sidebar-pelaporan {
    width: 250px;
    height: auto;
    min-height: 100%;
    background-color: #f8f9fa;
    transition: width 0.3s ease;
    border-right: 1px solid #e9ecef;
    padding: 1rem;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
}

.sidebar-pelaporan.collapsed {
    width: 60px;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e9ecef;
}

.toggle-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #555;
    padding: 5px;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.toggle-btn:hover {
    background-color: #e9ecef;
}

.sidebar-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #343a40;
}

.sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.sidebar-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    text-decoration: none;
    color: #495057;
    transition: all 0.2s ease;
}

.sidebar-item:hover {
    background-color: #e9ecef;
    color: #212529;
}

.sidebar-item.active {
    background-color: #0d6efd;
    color: #fff;
}

.sidebar-item .icon {
    margin-right: 0.75rem;
    width: 20px;
    text-align: center;
}

.sidebar-item .text {
    font-weight: 500;
}

.sidebar-pelaporan.collapsed .text {
    display: none;
}

.sidebar-pelaporan.collapsed .sidebar-item {
    justify-content: center;
}

.sidebar-pelaporan.collapsed h3 {
    display: none;
}

.separator {
    height: 1px;
    background-color: #ddd;
    margin: 15px 10px;
}

.logout {
    color: #dc3545;
}

.logout:hover {
    background-color: rgba(220, 53, 69, 0.1);
}
</style>