import { createRouter, createWebHistory } from "vue-router";

import { getUserData } from "../services/authDosen";
import VueCookies from "vue-cookies";
import { useToast } from "vue-toastification";
import UserLayout from "../layout/UserLayout.vue";
import DosenLayout from "../layout/DosenLayout.vue";
import AdminLayout from "../layout/AdminLayout.vue";
// import { describe } from "node:test";

//define a routes
const routes = [
  {
    path: "/",
    name: "Landing",
    component: () => import("../views/Landing/Landing.vue"),
    meta: {
      title: "Landing Portal D3TI UNS",
      description: "Selamat datang di portal D3TI UNS",
      keywords: "landing, home, utama",
    },
  },
  {
    path: "/mahasiswa/forgot-password",
    name: "ForgotPasswordMahasiswa",
    component: () =>
      import(
        /* webpackChunkName: "login" */ "../views/auth/Mahasiswa/ForgotPassword.vue"
      ),
    meta: {
      title: "Lupa Password",
      description: "Halaman lupa password mahasiswa",
      keywords: "lupa password, mahasiswa, reset password",
    },
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
    meta: {
      title: "Lupa Password",
      description: "Halaman lupa password dosen",
      keywords: "lupa password, dosen, reset password",
    },
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
    meta: {
      title: "Login Mahasiswa",
      description: "Halaman login mahasiswa",
      keywords: "login, mahasiswa",
    },
  },
  {
    path: "/dosen/login",
    name: "logindosen",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/auth/LoginDosen.vue"),
    meta: {
      title: "Login Dosen",
      description: "Halaman login dosen",
      keywords: "login, dosen",
    },
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
    name: "LandingLogin",
    component: () => import("../views/Landing/Landing.vue"),
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
        path: "peminjaman/inventaris",
        name: "PeminjamanInventarisMahasiswa",
        component: () =>
          import("../views/Mahasiswa/Peminjaman/ListInventaris.vue"),
      },
      {
        path: "peminjaman/bhp",
        name: "PeminjamanBhpMahasiswa",
        component: () => import("../views/Mahasiswa/Peminjaman/ListBhp.vue"),
      },
      {
        path: "peminjaman/inventaris/detail/:id",
        name: "DetailPeminjamanInventarisMahasiswa",
        component: () =>
          import("../views/Mahasiswa/Peminjaman/DetailInventaris.vue"),
      },
      {
        path: "peminjaman/bhp/detail/:id",
        name: "DetailPeminjamanBhpMahasiswa",
        component: () => import("../views/Mahasiswa/Peminjaman/DetailBhp.vue"),
      },
      {
        path: "profile",
        name: "ProfileMahasiswa",
        component: () => import("../views/Mahasiswa/Profile.vue"),
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
      // BHP
      //CRUD BHP
      {
        path: "bhp",
        name: "ListBhp",
        component: () => import("../views/Admin/AdminPengelola/Bhp/List.vue"),
      },
      {
        path: "bhp/create",
        name: "CreateBhp",
        component: () => import("../views/Admin/AdminPengelola/Bhp/Create.vue"),
      },
      {
        path: "bhp/detail/:id",
        name: "DetailBhp",
        component: () => import("../views/Admin/AdminPengelola/Bhp/Detail.vue"),
      },
      {
        path: "bhp/edit/:id",
        name: "EditBhp",
        component: () => import("../views/Admin/AdminPengelola/Bhp/Edit.vue"),
      },

      // INVENTARIS
      //CRUD Tipe
      {
        path: "tipe",
        name: "ListTipe",
        component: () =>
          import("../views/Admin/AdminPengelola/Inventaris/Tipe/List.vue"),
      },
      {
        path: "tipe/create",
        name: "CreateTipe",
        component: () =>
          import("../views/Admin/AdminPengelola/Inventaris/Tipe/Create.vue"),
      },
      {
        path: "tipe/edit/:id",
        name: "EditTipe",
        component: () =>
          import("../views/Admin/AdminPengelola/Inventaris/Tipe/Edit.vue"),
      },
      //CRUD merk
      {
        path: "merk",
        name: "ListMerk",
        component: () =>
          import("../views/Admin/AdminPengelola/Inventaris/Merk/List.vue"),
      },
      {
        path: "merk/create",
        name: "CreateMerk",
        component: () =>
          import("../views/Admin/AdminPengelola/Inventaris/Merk/Create.vue"),
      },
      {
        path: "merk/edit/:id",
        name: "EditMerk",
        component: () =>
          import("../views/Admin/AdminPengelola/Inventaris/Merk/Edit.vue"),
      },
      //CRUD Jenis Inventaris
      {
        path: "jenis-inventaris",
        name: "ListJenisInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Inventaris/JenisInventaris/List.vue"
          ),
      },
      {
        path: "jenis-inventaris/create",
        name: "CreateJenisInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Inventaris/JenisInventaris/Create.vue"
          ),
      },
      {
        path: "jenis-inventaris/edit/:id",
        name: "EditJenisInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Inventaris/JenisInventaris/Edit.vue"
          ),
      },
      {
        path: "jenis-inventaris/detail/:id",
        name: "DetailJenisInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Inventaris/JenisInventaris/Detail.vue"
          ),
      },
      //CRUD  Inventaris
      {
        path: "inventaris",
        name: "ListInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Inventaris/Inventaris/List.vue"
          ),
      },
      {
        path: "inventaris/create",
        name: "CreateInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Inventaris/Inventaris/Create.vue"
          ),
      },
      {
        path: "inventaris/edit/:id",
        name: "EditInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Inventaris/Inventaris/Edit.vue"
          ),
      },
      {
        path: "inventaris/detail/:id",
        name: "DetailInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Inventaris/Inventaris/Detail.vue"
          ),
      },
      // RUANG
      // CRUD Lantai
      {
        path: "lantai",
        name: "ListLantai",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/Lantai/List.vue"),
      },
      {
        path: "lantai/create",
        name: "CreateLantai",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/Lantai/Create.vue"),
      },
      {
        path: "lantai/edit/:id",
        name: "EditLantai",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/Lantai/Edit.vue"),
      },
      // CRUD Gedung
      {
        path: "gedung",
        name: "ListGedung",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/Gedung/List.vue"),
      },
      {
        path: "gedung/create",
        name: "CreateGedung",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/Gedung/Create.vue"),
      },
      {
        path: "gedung/edit/:id",
        name: "EditGedung",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/Gedung/Edit.vue"),
      },
      // CRUD Ruang
      {
        path: "ruang",
        name: "ListRuang",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/Ruang/List.vue"),
      },
      {
        path: "ruang/create",
        name: "CreateRuang",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/Ruang/Create.vue"),
      },
      {
        path: "ruang/edit/:id",
        name: "EditRuang",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/Ruang/Edit.vue"),
      },
      {
        path: "ruang/detail/:id",
        name: "DetailRuang",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/Ruang/Detail.vue"),
      },
      //peminjaman bhp
      {
        path: "peminjaman-bhp",
        name: "ListPeminjamanBhp",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Peminjaman/Bhp/ListPeminjaman.vue"
          ),
      },
      {
        path: "peminjaman-bhp/create",
        name: "CreatePeminjamanBhp",
        component: () =>
          import("../views/Admin/AdminPengelola/Peminjaman/Bhp/Peminjaman.vue"),
      },
      {
        path: "peminjaman-bhp/detail/:id",
        name: "DetailPeminjamanBhp",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Peminjaman/Bhp/DetailPeminjaman.vue"
          ),
      },
      {
        path: "peminjaman-bhp/edit/:id",
        name: "EditPeminjamanBhp",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Peminjaman/Bhp/EditPeminjaman.vue"
          ),
      },
      {
        path: "peminjaman-bhp/kembalikan/:id",
        name: "KembalikanPeminjamanBhp",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Peminjaman/Bhp/KembalikanPeminjaman.vue"
          ),
      },
      //peminjaman inventaris
      {
        path: "peminjaman-inventaris/create",
        name: "CreatePeminjamanInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Peminjaman/Inventaris/Peminjaman.vue"
          ),
      },
      {
        path: "peminjaman-inventaris",
        name: "ListPeminjamanInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Peminjaman/Inventaris/ListPeminjaman.vue"
          ),
      },
      {
        path: "peminjaman-inventaris/edit/:id",
        name: "EditPeminjamanInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Peminjaman/Inventaris/EditPeminjaman.vue"
          ),
      },
      {
        path: "peminjaman-inventaris/detail/:id",
        name: "DetailPeminjamanInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Peminjaman/Inventaris/DetailPeminjaman.vue"
          ),
      },
      {
        path: "peminjaman-inventaris/kembalikan/:id",
        name: "KembalikanPeminjamanInventaris",
        component: () =>
          import(
            "../views/Admin/AdminPengelola/Peminjaman/Inventaris/KembalikanPeminjaman.vue"
          ),
      },
      //semester
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
