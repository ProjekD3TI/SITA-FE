//import vue router
import { createRouter, createWebHistory } from 'vue-router'

//define a routes
const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import( /* webpackChunkName: "login" */ '../views/auth/Login.vue')
    },
    {
        path: '/404',
        name: '404',
        component: () => import( /* webpackChunkName: "login" */ '../views/404/404.vue')
    },
    {
        path: '/laporks',
        name: 'laporks',
        component: () => import( /* webpackChunkName: "login" */ '../views/Pelaporan/LaporKekerasanSeksual.vue')
    },
]

//create router
const router = createRouter({
    history: createWebHistory(),
    routes // <-- routes,
})

export default router