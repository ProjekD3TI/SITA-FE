import { createRouter, createWebHistory } from "vue-router";

import { getUserData } from "../services/authDosen";
import VueCookies from "vue-cookies";
import { useToast } from "vue-toastification";
import UserLayout from "../layout/UserLayout.vue";
import DosenLayout from "../layout/DosenLayout.vue";
import AdminLayout from "../layout/AdminLayout.vue";

//define a routes
const routes = [
  {
    path: "/",
    name: "Landing",
    component: () => import("../views/Landing/Landing.vue"),
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
    path: "/akses-ruang",
    name: "AksesRuang",
    component: () => import("../views/Monitoring/Akses.vue"),
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

  // Mahasiswa
  {
    path: "/mahasiswa",
    component: UserLayout,
    meta: { requiresAuth: true, userType: "mahasiswa" },
    children: [
      {
        path: "dashboard",
        name: "DashboardMahasiswa",
        component: () => import("../views/Mahasiswa/Landing.vue"),
      },
      // {
      //   path: "landing",
      //   name: "Landing",
      //   component: () => import("../views/Mahasiswa/Dashboard.vue"),
      // },
      {
        path: "profile",
        name: "ProfileMahasiswa",
        component: () => import("../views/Mahasiswa/Profile.vue"),
      },
      {
        path: "pinjam",
        name: "PinjamRuangMahasiswa",
        component: () => import("../views/Mahasiswa/Booking/Create.vue"),
      },
      {
        path: "booking-mahasiswa",
        name: "ListBookingMahasiswa",
        component: () => import("../views/Mahasiswa/Booking/Booking.vue"),
      },
      {
        path: "jadwal-mahasiswa",
        name: "JadwalMahasiswa",
        component: () => import("../views/Mahasiswa/Jadwal/List.vue")
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
        component: () => import("../views/Dosen/Landing.vue"),
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
        component: () => import("../views/Dosen/Kalab/Landing.vue"),
      },
      // route yg laen

      {
        path: "list-peminjaman",
        name: "ListPeminjamanKalab",
        component: () => import("../views/Dosen/Kalab/Booking/List.vue"),
      },

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
        component: () => import("../views/Admin/AdminPengelola/Landing.vue"),
      },

      // Kelola
      // Kelas
      {
        path: "kelas",
        name: "ListKelas",
        component: () =>
          import("../views/Admin/AdminPengelola/Clases/Kelas/List.vue"),
      },
      {
        path: "kelas/create",
        name: "CreateKelas",
        component: () =>
          import("../views/Admin/AdminPengelola/Clases/Kelas/Create.vue"),
      },
      {
        path: "kelas/edit/:id",
        name: "EditKelas",
        component: () =>
          import("../views/Admin/AdminPengelola/Clases/Kelas/Edit.vue"),
      },
      //semester
      {
        path: "semester",
        name: "ListSemester",
        component: () =>
          import("../views/Admin/AdminPengelola/Clases/Semester/List.vue"),
      },
      {
        path: "semester/create",
        name: "CreateSemester",
        component: () =>
          import("../views/Admin/AdminPengelola/Clases/Semester/Create.vue"),
      },
      {
        path: "semester/update/:id",
        name: "EditSemester",
        component: () =>
          import("../views/Admin/AdminPengelola/Clases/Semester/Edit.vue"),
      },
      //RFID
      {
        path: "rfid",
        name: "ListRfid",
        component: () =>
          import("../views/Admin/AdminPengelola/Rfid/List.vue"),
      },
      {
        path: "rfid/create",
        name: "CreateRfid",
        component: () =>
          import("../views/Admin/AdminPengelola/Rfid/Create.vue"),
      },
      {
        path: "rfid/edit/:id",
        name: "EditRfid",
        component: () =>
          import("../views/Admin/AdminPengelola/Rfid/Edit.vue"),
      },


      // Jadwal
      //CRUD sesi
      {
        path: "sesi",
        name: "ListSesi",
        component: () =>
          import("../views/Admin/AdminPengelola/Jadwal/Sesi/List.vue"),
      },
      {
        path: "sesi/create",
        name: "CreateSesi",
        component: () =>
          import("../views/Admin/AdminPengelola/Jadwal/Sesi/Create.vue"),
      },
      {
        path: "sesi/edit/:id",
        name: "EditSesi",
        component: () =>
          import("../views/Admin/AdminPengelola/Jadwal/Sesi/Edit.vue"),
      },
      //Jadwal
      {
        path: "jadwal",
        name: "ListJadwal",
        component: () =>
          import("../views/Admin/AdminPengelola/Jadwal/JadwalTetap/List.vue"),
      },
      {
        path: "jadwal/create",
        name: "CreateJadwal",
        component: () =>
          import("../views/Admin/AdminPengelola/Jadwal/JadwalTetap/Create.vue"),
      },
      {
        path: "jadwal/edit/:id",
        name: "EditJadwal",
        component: () =>
          import("../views/Admin/AdminPengelola/Jadwal/JadwalTetap/Edit.vue"),
      },
      {
        path: "jadwal/detail/:id",
        name: "DetailJadwal",
        component: () =>
          import("../views/Admin/AdminPengelola/Jadwal/JadwalTetap/Detail.vue"),
      },

      // CRUD gedung lantai
      {
        path: "gedung-lantai",
        name: "ListGedungLantai",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/LantaiGedung/List.vue"),
      },
      {
        path: "lantaigedung/create",
        name: "CreateLantaiGedung",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/LantaiGedung/Create.vue"),
      },
      {
        path: "lantaigedung/edit/:id",
        name: "EditLantaiGedung",
        component: () =>
          import("../views/Admin/AdminPengelola/Ruang/LantaiGedung/Edit.vue"),
      },
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
