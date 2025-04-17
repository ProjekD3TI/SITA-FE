import { createRouter, createWebHistory } from "vue-router";

import { getUserData } from "../services/authDosen";
import VueCookies from "vue-cookies";
import { useToast } from "vue-toastification";
import UserLayout from "../layout/UserLayout.vue";
import DosenLayout from "../layout/DosenLayout.vue";
import AdminLayout from "../layout/AdminLayout.vue";
import Dashboard from "../views/Mahasiswa/Tugas-akhir/Dashboard.vue";
import Request from "../views/Mahasiswa/Tugas-akhir/Request.vue";
import Daftar from "../views/Mahasiswa/Tugas-akhir/Daftar.vue";

//define a routes
const routes = [
  {
    path: '/dosen/tugas-akhir',
    component: DosenLayout, // Gunakan AdminLayout sebagai layout
    children: [
      {
        path: '',
        component: Dashboard, // Konten halaman akan dirender di <router-view> dalam AdminLayout
      },
      {
        path: 'request-pembimbing',
        component: Request, // Konten halaman akan dirender di <router-view> dalam AdminLayout
      },
      {
        path: 'daftar-bimbingan',
        component: Daftar, // Konten halaman akan dirender di <router-view> dalam AdminLayout
      },
      {
        path: 'seminar-proposal',
        component: Daftar, // Konten halaman akan dirender di <router-view> dalam AdminLayout
      },
      {
        path: 'seminar-hasil',
        component: Daftar, // Konten halaman akan dirender di <router-view> dalam AdminLayout
      },
      {
        path: 'jadwal-menguji',
        component: Daftar, // Konten halaman akan dirender di <router-view> dalam AdminLayout
      },
      {
        path: 'input-nilai-ujian',
        component: Daftar, // Konten halaman akan dirender di <router-view> dalam AdminLayout
      },
      {
        path: 'revisi-ujian',
        component: Daftar, // Konten halaman akan dirender di <router-view> dalam AdminLayout
      },
      {
        path: 'jadwal-sempro',
        component: Daftar, // Konten halaman akan dirender di <router-view> dalam AdminLayout
      },
      {
        path: 'daftar-bimbingan',
        component: Daftar, // Konten halaman akan dirender di <router-view> dalam AdminLayout
      },
    ],
  },
  {
    path: '/admin/tugas-akhir',
    component: AdminLayout, // Gunakan AdminLayout sebagai layout
    children: [
      {
        path: '',
        component: Dashboard, // Konten halaman akan dirender di <router-view> dalam AdminLayout
      },
    ],
  },
  {
    path: '/mahasiswa/tugas-akhir',
    component: UserLayout, // Gunakan AdminLayout sebagai layout
    children: [
      {
        path: '',
        component: Dashboard, // Konten halaman akan dirender di <router-view> dalam AdminLayout
      },
    ],
  },
  // {
  //   path: "/",
  //   name: "Landing",
  //   component: () => import("../views/Landing/Landing.vue"),
  // },
  {
    path: "/informasi-ta",
    name: "InformasiTA",
    component: () => import("../views/Landing/TA.vue"),
  },
  {
    path: "/informasi-inventaris-peminjaman",
    name: "InformasiInvPin",
    component: () => import("../views/Landing/InvPin.vue"),
  },
  {
    path: "/informasi-lapor-kejadian",
    name: "InformasiLaKej",
    component: () => import("../views/Landing/LaKej.vue"),
  },
  {
    path: "/mahasiswa/forgot-password",
    name: "ForgotPasswordMahasiswa",
    component: () =>
      import(
        /* webpackChunkName: "login" */ "../views/auth/Mahasiswa/ForgotPassword.vue"
      ),
  },
  {
    path: "/mahasiswa/reset-password/:token",
    name: "ResetPasswordMahasiswa",
    component: () =>
      import(
        /* webpackChunkName: "login" */ "../views/auth/Mahasiswa/ResetPassword.vue"
      ),
  },
  {
    path: "/dosen/forgot-password",
    name: "ForgotPasswordDosen",
    component: () =>
      import(
        /* webpackChunkName: "login" */ "../views/auth/Dosen/ForgotPassword.vue"
      ),
  },
  {
    path: "/dosen/reset-password/:token",
    name: "ResetPasswordDosen",
    component: () =>
      import(
        /* webpackChunkName: "login" */ "../views/auth/Dosen/ResetPassword.vue"
      ),
  },
  {
    path: "/admin/forgot-password",
    name: "ForgotPasswordAdmin",
    component: () =>
      import(
        /* webpackChunkName: "login" */ "../views/auth/Admin/ForgotPassword.vue"
      ),
  },
  {
    path: "/admin/reset-password/:token",
    name: "ResetPasswordAdmin",
    component: () =>
      import(
        /* webpackChunkName: "login" */ "../views/auth/Admin/ResetPassword.vue"
      ),
  },
  {
    path: "/mahasiswa/login",
    name: "loginmhs",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/auth/LoginMhs.vue"),
  },
  {
    path: "/dosen/login",
    name: "logindosen",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/auth/LoginDosen.vue"),
  },
  {
    path: "/login-admin",
    name: "LoginAdmin",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/auth/LoginAdmin.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/auth/Register.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/404/404.vue"),
  },
  {
    path: "/laporks",
    name: "laporks",
    component: () =>
      import(
        /* webpackChunkName: "login" */ "../views/Pelaporan/LaporKekerasanSeksual.vue"
      ),
  },
  {
    path: "/dashboard",
    name: "dashboard-login",
    component: () => import("../views/Landing/LandingLogin.vue"),
    meta: { requiresAuth: true },
  },


  // Mahasiswa
  {
    path: "/mahasiswa",
    component: UserLayout,
    meta: { requiresAuth: true, userType: "mahasiswa" },
    children: [
      {
        path: "dashboard",
        name: "DashboardMahasiswa",
        component: () => import("../views/Mahasiswa/Dashboard.vue"),
      },
      {
        path: "profile",
        name: "ProfileMahasiswa",
        component: () => import("../views/Mahasiswa/Profile.vue"),
      },
      {
        path: "dashboardpkmhs",
        name: "DashboardPKMhs",
        component: () => import("../views/Mahasiswa/Pelaporan/Kejadian/DashboardPKMhs.vue"),
      },
      {
        path: "addpkmhs",
        name: "AddPKMhs",
        component: () => import("../views/Mahasiswa/Pelaporan/Kejadian/AddPKMhs.vue"),
      },
      {
        path: "/laporan/:id",
        name: "DetailPKMhs",
        component: () => import("../views/Mahasiswa/Pelaporan/Kejadian/DetailPKMhs.vue"),
      },
      {
        path: "dashboardksmhs",
        name: "DashboardKSMhs",
        component: () => import("../views/Mahasiswa/Pelaporan/KekerasanSeksual/DashboardKSMhs.vue"),
      },
      {
        path: "addpelaporanksmhs",
        name: "AddPelaporanKSMhs",
        component: () => import("../views/Mahasiswa/Pelaporan/KekerasanSeksual/AddKSMhs.vue"),
      },
      {
        path: "/laporan_kekerasan/:id",
        name: "DetailKSMhs",
        component: () => import("../views/Mahasiswa/Pelaporan/KekerasanSeksual/DetailKSMhs.vue"),
      },
      // route mahasiswa yg laenya
    ],
  },

  //Dosen
  {
    path: "/dosen",
    component: DosenLayout,
    meta: { requiresAuth: true, userType: "dosen" },
    children: [
      {
        path: "profile",
        name: "ProfileDosen",
        component: () => import("../views/Dosen/Profile.vue"),
      },
      // route yg laen
    ],
  },

  // jabatan dosen
  {
    path: "/dosen",
    component: DosenLayout,
    meta: { requiresAuth: true, userType: "dosen", requiredJabatan: "Dosen" },
    children: [
      {
        path: "dashboard",
        name: "DashboardDosen",
        component: () => import("../views/Dosen/Dashboard.vue"),
      },
      {
        path: "dashboardpkdosen",
        name: "DashboardPKDosen",
        component: () => import("../views/Dosen/Pelaporan/Kejadian/DashboardPKDosen.vue"),
      },
      {
        path: "addpkdosen",
        name: "AddPKDosen",
        component: () => import("../views/Dosen/Pelaporan/Kejadian/AddPKDosen.vue"),
      },
      {
        path: "/laporan/:id",
        name: "DetailPKDosen",
        component: () => import("../views/Dosen/Pelaporan/Kejadian/DetailPKDosen.vue"),
      },
      {
        path: "dashboardksdosen",
        name: "DashboardKSDosen",
        component: () => import("../views/Dosen/Pelaporan/KekerasanSeksual/DashboardKSDosen.vue"),
      },
      {
        path: "addpelaporanksdosen",
        name: "AddPelaporanKSDosen",
        component: () => import("../views/Dosen/Pelaporan/KekerasanSeksual/AddKSDosen.vue"),
      },
      {
        path: "/laporan_kekerasan/:id",
        name: "DetailKSDosen",
        component: () => import("../views/Dosen/Pelaporan/KekerasanSeksual/DetailKSDosen.vue"),
      },
      // route yg laen
    ],
  },

  // jabatan kalab
  {
    path: "/kalab",
    component: DosenLayout,
    meta: { requiresAuth: true, userType: "dosen", requiredJabatan: "Kalab" },
    children: [
      {
        path: "dashboard",
        name: "DashboardKalab",
        component: () => import("../views/Dosen/Kalab/Dashboard.vue"),
      },
      {
        path: "kategoripelaporan",
        name: "KatPelaporan",
        component: () => import("../views/Dosen/Kalab/Pelaporan/Kategori/DashboardCategory.vue"),
      },
      {
        path: "addkategoripelaporan",
        name: "AddKatPelaporan",
        component: () => import("../views/Dosen/Kalab/Pelaporan/Kategori/AddKategori.vue"),
      },
      {
        path: "editkategoripelaporan",
        name: "EditKatPelaporan",
        component: () => import("../views/Dosen/Kalab/Pelaporan/Kategori/EditKategori.vue"),
      },
      {
        path: "pelaporankejadiankalab",
        name: "PelaporanKejadianKalab",
        component: () => import("../views/Dosen/Kalab/Pelaporan/PelaporanKejadian/DashboardPK.vue"),
      },
      {
        path: "addpelaporankejadiankalab",
        name: "AddPelaporanKejadianKalab",
        component: () => import("../views/Dosen/Kalab/Pelaporan/PelaporanKejadian/AddPK.vue"),
      },
      {
        path: "/laporan/:id",
        name: "DetailPK",
        component: () => import("../views/Dosen/Kalab/Pelaporan/PelaporanKejadian/DetailPK.vue"),
      },
      {
        path: "pelaporankekerasanseksual",
        name: "PelaporanKekerasanSeksual",
        component: () => import("../views/Dosen/Kalab/Pelaporan/KekerasanSeksual/DashboardKS.vue"),
      },
      {
        path: "addpelaporankskalab",
        name: "AddPelaporanKSKalab",
        component: () => import("../views/Dosen/Kalab/Pelaporan/KekerasanSeksual/AddKS.vue"),
      },
      {
        path: "/laporan_kekerasan/:id",
        name: "DetailKS",
        component: () => import("../views/Dosen/Kalab/Pelaporan/KekerasanSeksual/DetailKS.vue"),
      },
      // route yg laen
    ],
  },

  // jabatan kaprodi
  {
    path: "/kaprodi",
    component: DosenLayout,
    meta: { requiresAuth: true, userType: "dosen", requiredJabatan: "Kaprodi" },
    children: [
      {
        path: "dashboard",
        name: "DashboardKaprodi",
        component: () => import("../views/Dosen/Kaprodi/Dashboard.vue"),
      },
      // route yg laen
    ],
  },

  // jabatan petugas
  {
    path: "/petugas",
    component: DosenLayout,
    meta: { requiresAuth: true, userType: "dosen", requiredJabatan: "Petugas" },
    children: [
      {
        path: "dashboard",
        name: "DashboardPetugas",
        component: () => import("../views/Dosen/Petugas/Dashboard.vue"),
      },
      // route yg laen
    ],
  },

  //Admin
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, userType: "admin" },
    children: [
      {
        path: "dashboard",
        name: "DashboardAdmin",
        component: () => import("../views/Admin/Dashboard.vue"),
      },
      // route yg laen
    ],
  },

  // superadmin
  {
    path: "/superadmin",
    component: AdminLayout,
    meta: { requiresAuth: true, userType: "admin", requiredRole: "superadmin" },
    children: [
      {
        path: "dashboard",
        name: "DashboardSuperadmin",
        component: () => import("../views/Admin/Superadmin/Dashboard.vue"),
      },
      // route yg laen
    ],
  },

  // admin ta
  {
    path: "/admin-ta",
    component: AdminLayout,
    meta: { requiresAuth: true, userType: "admin", requiredRole: "admin_ta" },
    children: [
      {
        path: "dashboard",
        name: "DashboardAdminTa",
        component: () => import("../views/Admin/AdminTa/Dashboard.vue"),
      },
      // route yg laen
    ],
  },

  // admin pengelola
  {
    path: "/admin-pengelola",
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      userType: "admin",
      requiredRole: "admin_pengelola",
    },
    children: [
      {
        path: "dashboard",
        name: "DashboardAdminPengelola",
        component: () => import("../views/Admin/AdminPengelola/Dashboard.vue"),
      },
    ],
  },

  //Pelaporan
  {
    path: "/pelaporan",
    meta: { requiresAuth: true, userType: "mahasiswa" },
    children: [
      {
        path: "dashboard",
        name: "DashboardPelaporan",
        component: () => import("../views/Pelaporan/Dashboard.vue"),
      },
      {
        path: "pelaporan-kejadian",
        name: "PelaporanKejadian",
        component: () => import("../views/Pelaporan/Kejadian/PelaporanKejadian.vue"),
      },
      {
        path: "add-pelaporan-kejadian",
        name: "AddPelaporanKejadian",
        component: () => import("../views/Pelaporan/Kejadian/AddPelaporanKejadian.vue"),
      },
      {
        path: "detail-pelaporan-kejadian",
        name: "DetailPelaporanKejadian",
        component: () => import("../views/Pelaporan/Kejadian/DetailPelaporanKejadian.vue"),
      },
      {
        path: "kekerasan-seksual",
        name: "KekekerasanSeksual",
        component: () => import("../views/Pelaporan/KekerasanSeksual/KekerasanSeksual.vue"),
      },
      {
        path: "add-kekerasan-seksual",
        name: "AddKekekerasanSeksual",
        component: () => import("../views/Pelaporan/KekerasanSeksual/AddKekerasanSeksual.vue"),
      },
      {
        path: "detail-kekerasan-seksual",
        name: "DetailKekekerasanSeksual",
        component: () => import("../views/Pelaporan/KekerasanSeksual/DetailKekerasanSeksual.vue"),
      },
    ],
  },

  // {
  //   path: "/admin-pengelola/dashboard",
  //   name: "DashboardAdminPengelola",
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "login" */ "../views/Admin/AdminPengelola/Dashboard.vue"
  //     ),
  //   meta: {
  //     requiresAuth: true,
  //     userType: "admin",
  //     requiredRole: "admin_pengelola",
  //   },
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
const toast = useToast();

router.beforeEach(async (to, from, next) => {
  const userData = getUserData();
  const authToken = VueCookies.get("auth_token");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!userData || !authToken) {
      next({ name: "Landing" });
      return;
    }

    if (to.meta.userType && userData.type !== to.meta.userType) {
      // toast.error("Anda tidak memiliki akses ke halaman ini");
      // gausa di pake biar lebh aman?

      switch (userData.type) {
        case "dosen":
          redirectTo(next, userData.jabatan);
          return;
        case "admin":
          next({ name: "DashboardAdmin" });
          return;
        case "mahasiswa":
          next({ name: "DashboardMahasiswa" });
          return;
        default:
          next({ name: "Landing" });
          return;
      }
    }

    if (userData.type === "dosen" && to.meta.requiredJabatan) {
      try {
        const currentUserData = getUserData();
        if (!currentUserData) {
          next({ name: "Landing" });
          return;
        }

        const currentJabatan = currentUserData.jabatan;
        const targetJabatan = to.meta.requiredJabatan;

        if (currentJabatan !== targetJabatan) {
          redirectTo(next, currentJabatan);
          return;
        }

        next();
      } catch (error) {
        console.error("Error checking jabatan:", error);
        window.location.href = "/dosen/dashboard";
        return;
      }
    }

    if (userData.type === "admin" && to.meta.requiredRole) {
      if (!userData.role || userData.role !== to.meta.requiredRole) {
        toast.error(`Anda tidak memiliki akses ke halaman ini `);

        switch (userData.role) {
          case "superadmin":
            next({ name: "DashboardSuperadmin" });
            break;
          case "admin_ta":
            next({ name: "DashboardAdminTa" });
            break;
          case "admin_pengelola":
            next({ name: "DashboardAdminPengelola" });
            break;
          default:
            next({ name: "DashboardAdmin" });
        }
        return;
      }
    }

    next();
  } else {
    if (
      userData &&
      authToken &&
      ["Login", "LoginDosen", "LoginAdmin", "LoginMahasiswa"].includes(to.name)
    ) {
      switch (userData.type) {
        case "dosen":
          redirectTo(next, userData.jabatan);
          break;
        case "admin":
          next({ name: "DashboardAdmin" });
          break;
        case "mahasiswa":
          next({ name: "DashboardMahasiswa" });
          break;
        default:
          next();
      }
      return;
    }

    next();
  }
});

function redirectTo(next, jabatan) {
  switch (jabatan) {
    case "Dosen":
      next({ name: "DashboardDosen" });
      break;
    case "Kalab":
      next({ name: "DashboardKalab" });
      break;
    case "Kaprodi":
      next({ name: "DashboardKaprodi" });
      break;
    case "Petugas":
      next({ name: "DashboardPetugas" });
      break;
    default:
      next({ name: "DashboardDosen" });
  }
}

export default router;
