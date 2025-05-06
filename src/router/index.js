import { createRouter, createWebHistory } from "vue-router";

import { getUserData } from "../services/authDosen";
import VueCookies from "vue-cookies";
import { useToast } from "vue-toastification";
import UserLayout from "../layout/Tugas-akhir/UserLayout.vue";
import DosenLayout from "../layout/Tugas-akhir/DosenLayout.vue";
import AdminLayout from "../layout/Tugas-akhir/AdminLayout.vue";

// Route Admin TA
import DashboardTAAdmin from "../views/Admin/AdminTa/Dashboard.vue";
import BimbinganforAdmin from "../views/Admin/AdminTa/Bimbingan.vue";
import ProposalforAdmin from "../views/Admin/AdminTa/Proposal.vue";
import TugasAkhirforAdmin from "../views/Admin/AdminTa/TugasAkhir.vue";
// Route Mhs TA
import DashboardTAMhs from "../views/Mahasiswa/Tugas-akhir/Dashboard.vue";
import BimbinganforMhs from "../views/Mahasiswa/Tugas-akhir/Bimbingan/Index.vue";
import TambahBimbinganforMhs from "../views/Mahasiswa/Tugas-akhir/Bimbingan/Create.vue";
import ProposalforMhs from "../views/Mahasiswa/Tugas-akhir/Proposal.vue";
import TugasAkhirforMhs from "../views/Mahasiswa/Tugas-akhir/Ujian.vue";
// Route Dosen TA 
import DashboardTADosen from "../views/Dosen/Tugas-akhir/Dashboard.vue";
import BimbinganforDosen from "../views/Dosen/Tugas-akhir/Bimbingan.vue";
import SeminarProposalforDosen from "../views/Dosen/Tugas-akhir/SeminarProposal.vue";
import SeminarHasilforDosen from "../views/Dosen/Tugas-akhir/SeminarHasil.vue";
import UjianTAforDosen from "../views/Dosen/Tugas-akhir/UjianTA.vue";
import path from "path";

//define a routes
const routes = [
  {
    path: '/dosen/tugas-akhir',
    component: DosenLayout, // Gunakan AdminLayout sebagai layout
    meta: {
      breadcrumb: 'Tugas Akhir'
    },
    children: [
      {
        path: '',
        component: DashboardTADosen,
        meta: {
          breadcrumb: 'Dashboard'
        } 
      },
      {
        path: 'bimbingan',
        component: BimbinganforDosen, 
        meta: {
          breadcrumb: 'Bimbingan'
        },
        // children: [
        //   {
        //     path: 'bimbingan/:id',
        //     component: DetailBimbinganforDosen,
        //     meta:{
        //       breadcrumb: 'Detail Bimbingan'
        //     }
        //   }
        // ]
      },
      {
        path: 'seminar-proposal',
        component: SeminarProposalforDosen ,
        meta: {
          breadcrumb: 'Seminar Proposal'
        }
      },
      {
        path: 'seminar-hasil',
        component: SeminarHasilforDosen, 
        meta: {
          breadcrumb: 'Seminar Hasil'
        }
      },
      {
        path: 'ujian-ta',
        component: UjianTAforDosen, 
        meta: {
          breadcrumb: 'Ujian Tugas Akhir'
        }
      },

    ],
  },
  {
    path:'/testcok',
    component: () => import('../views/Mahasiswa/Tugas-akhir/Test.vue'),
  },
  {
    path: '/admin/tugas-akhir',
    component: AdminLayout, // Gunakan AdminLayout sebagai layout
    meta: {
      breadcrumb: 'Tugas Akhir'
    },
    children: [
      {
        path: '',
        component: DashboardTAAdmin,
        meta: {
          breadcrumb: 'Dashboard'
        } 
      },
      {
        path: 'bimbingan',
        component: BimbinganforAdmin,
        meta: {
          breadcrumb: 'Bimbingan'
        } 
      },
      {
        path: 'proposal',
        component: ProposalforAdmin,
        meta: {
          breadcrumb: 'Proposal'
        } 
      },
      {
        path: 'tugas-akhir',
        component: TugasAkhirforAdmin,
        meta: {
          breadcrumb: 'tugas-akhir'
        } 
      },
    ],
  },
  
  {
    path: "/",
    name: "Landing",
    component: () => import("../views/Landing/Landing.vue"),
  },
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



  // Mahasiswa
  {
    path: "/mahasiswa",
    // meta: { requiresAuth: true, userType: "mahasiswa" },
    children: [
      {
        path: "",
        name: "PortalMahasiswa",
        component: () => import("../views/Mahasiswa/Portal.vue"),
      },
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
        path: 'tugas-akhir',
        component: UserLayout, // Gunakan AdminLayout sebagai layout
        meta: {
          breadcrumb: 'Tugas Akhir'
        },
        name: 'DashboardTugasAkhirMhs',
        children: [
          {
            path: '',
            component: DashboardTAMhs,         
            meta: {
              breadcrumb: 'Dashboard'
            }
          },
          {
            path: 'bimbingan',
            component: BimbinganforMhs,         
            meta: {
              breadcrumb: 'Bimbingan'
            },
          },
          {
            path: 'tambah-bimbingan',
            component : TambahBimbinganforMhs,
            meta: {
              breadcrumb: 'Tambah Bimbingan'
            }
          },
          {
            path: 'proposal',
            component: ProposalforMhs,         
            meta: {
              breadcrumb: 'Proposal'
            }
          },
          {
            path: 'tugas-akhir',
            component: TugasAkhirforMhs,         
            meta: {
              breadcrumb: 'Tugas Akhir'
            }
          },
        ],
      },
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
          next({ name: "DashboardTugasAkhirMhs" });
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
