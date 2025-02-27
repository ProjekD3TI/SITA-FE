//import vue router
import { createRouter, createWebHistory } from 'vue-router'

//define a routes
const routes = [
    { path: '/', 
        name: 'Landing',
        component: () => import('../views/Landing/Landing.vue')
    },
    {
        path: '/loginmhs',
        name: 'loginmhs',
        component: () => import( /* webpackChunkName: "login" */ '../views/auth/LoginMhs.vue')
    },
    {
        path: '/logindosen',
        name: 'logindosen',
        component: () => import( /* webpackChunkName: "login" */ '../views/auth/LoginDosen.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import( /* webpackChunkName: "login" */ '../views/auth/Register.vue')
    },
    {
        path: '/forgotpassword',
        name: 'forgotpassword',
        component: () => import( /* webpackChunkName: "login" */ '../views/auth/ForgotPassword.vue')
    },
    {
        path: '/resetpassword',
        name: 'resetpassword',
        component: () => import( /* webpackChunkName: "login" */ '../views/auth/ResetPassword.vue')
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