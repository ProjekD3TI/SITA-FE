import { createRouter, createWebHistory } from "vue-router";

import { getUserData } from "../services/authDosen";
import VueCookies from "vue-cookies";
import { useToast } from "vue-toastification";
import UserLayoutTA from "../layout/Tugas-akhir/UserLayout.vue";
import DosenLayout from "../layout/Tugas-akhir/DosenLayout.vue";
import AdminLayoutTA from "../layout/Tugas-akhir/AdminLayout.vue";

import AdminLayout from "../layout/AdminLayout.vue";

// Route Admin TA
import DashboardTAAdmin from "../views/Admin/AdminTa/Dashboard.vue";
import BimbinganforAdmin from "../views/Admin/AdminTa/Bimbingan/Bimbingan.vue";
import ProposalforAdmin from "../views/Admin/AdminTa/Proposal/Proposal.vue";
import TugasAkhirforAdmin from "../views/Admin/AdminTa/UjianTA/UjianTA.vue";
import RuangSesiforAdmin from "../views/Admin/AdminTa/RuangSesi.vue";
import KategoriforAdmin from "../views/Admin/AdminTa/Kategori.vue";
import PlottingPengujiForAdmin from "../views/Admin/AdminTa//UjianTA/PlottingPenguji.vue";
import DetailPendaftarForAdmin from "../views/Admin/AdminTa/UjianTA/DetailPendaftar.vue";
import PenjadwalanForAdmin from "../views/Admin/AdminTa/UjianTA/Penjadwalan.vue";
import DetailPengajuanForAdmin from "../views/Admin/AdminTa/Proposal/DetailPengajuan.vue";
import DetailProposalForAdmin from "../views/Admin/AdminTa/Proposal/DetailProposal.vue";
import InputNilaiProposalForAdmin from "../views/Admin/AdminTa/Proposal/InputNilai.vue";
import DetailBimbinganForAdmin from "../views/Admin/AdminTa/Bimbingan/DetailBimbingan.vue";
import PlotPembimbingForAdmin from "../views/Admin/AdminTa/Bimbingan/PlotPembimbing.vue";
import MahasiswaDosenForAdmin from "../views/Admin/AdminTa/MahasiswaDosen.vue";
import TahunAjaranForAdmin from "../views/Admin/AdminTa/TahunAjaran.vue";
import TugasAkhirforAdminTa from "../views/Admin/AdminTa/TugasAkhir.vue";
// Route Mhs TA
import DashboardTAMhs from "../views/Mahasiswa/Tugas-akhir/Dashboard.vue";
import BimbinganforMhs from "../views/Mahasiswa/Tugas-akhir/Bimbingan/Bimbingan.vue";
import TambahBimbinganforMhs from "../views/Mahasiswa/Tugas-akhir/Bimbingan/Tambah.vue";
import ProposalforMhs from "../views/Mahasiswa/Tugas-akhir/Proposal.vue";
import TugasAkhirforMhs from "../views/Mahasiswa/Tugas-akhir/UjianTA/UjianTA.vue";
import detailUjianTAforMhs from "../views/Mahasiswa/Tugas-akhir/UjianTA/Detail.vue";
// Route Dosen TA
import DashboardTADosen from "../views/Dosen/Tugas-akhir/Dashboard.vue";
import BimbinganforDosen from "../views/Dosen/Tugas-akhir/Bimbingan/Bimbingan.vue";
import DetailBimbinganforDosen from "../views/Dosen/Tugas-akhir/Bimbingan/DetailBimbingan.vue";
import InputNilaiBimbinganforDosen from "@/views/Dosen/Tugas-akhir/Bimbingan/InputNilaiBimbingan.vue";
import UjianTAforDosen from "../views/Dosen/Tugas-akhir/UjianTA/UjianTA.vue";
import detailUjianTAforDosen from "../views/Dosen/Tugas-akhir/UjianTA/DetailUjianTA.vue";
import InputNilaiUjianTAforDosen from "@/views/Dosen/Tugas-akhir/UjianTA/InputNilaiUjianTA.vue";
import path from "path";

//define a routes
const routes = [
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
    meta: { requiresAuth: true, userType: "mahasiswa" },
    children: [
      {
        path: "",
        redirect: "/",
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
        path: "tugas-akhir",
        component: UserLayoutTA, // Gunakan AdminLayout sebagai layout
        meta: {
          breadcrumb: "Tugas Akhir",
          requiresAksesTA: true, // Tambahkan meta untuk akses TA
        },
        children: [
          {
            path: "",
            name: "DashboardTugasAkhirMhs",
            component: DashboardTAMhs,
            meta: {
              breadcrumb: "Dashboard",
            },
          },
          {
            path: "bimbingan",
            component: BimbinganforMhs,
            meta: {
              breadcrumb: "Bimbingan",
            },
            children: [
              {
                path: "tambah-bimbingan",
                component: TambahBimbinganforMhs,
                meta: {
                  breadcrumb: "Tambah",
                },
              },
            ],
          },
          {
            path: "proposal",
            component: ProposalforMhs,
            meta: {
              breadcrumb: "Proposal",
            },
          },
          {
            path: "ujian-ta",
            component: TugasAkhirforMhs,
            meta: {
              breadcrumb: "Ujian",
            },
            children: [
              {
                path: "detail-ujian-ta",
                component: detailUjianTAforMhs,
                meta: {
                  breadcrumb: "Detail",
                },
              },
            ],
          },
        ],
      },
    ],
  },

  //Dosen
  {
    path: "/dosen",
    // component: DosenLayout,
    meta: { requiresAuth: true, userType: "dosen" },
    children: [
      {
        path: "",
        redirect: "/",
      },
      {
        path: "profile",
        name: "ProfileDosen",
        component: () => import("../views/Dosen/Profile.vue"),
      },
      {
        path: "tugas-akhir",
        component: DosenLayout, // Gunakan AdminLayout sebagai layout
        meta: {
          breadcrumb: "Tugas Akhir",
        },
        children: [
          {
            path: "",
            component: DashboardTADosen,
            meta: {
              breadcrumb: "Dashboard",
            },
          },
          {
            path: "bimbingan",
            name: "BimbinganforDosen",
            component: BimbinganforDosen,
            meta: {
              breadcrumb: "Bimbingan",
            },
            children: [
              {
                path: "detail-bimbingan/:tugas_akhir_id",
                name: "DetailBimbinganforDosen",
                component: DetailBimbinganforDosen,
                meta: {
                  breadcrumb: "Detail",
                },
                children: [
                  {
                    path: "input-nilai-bimbingan",
                    name: "InputNilaiBimbinganforDosen",
                    component: InputNilaiBimbinganforDosen,
                    meta: {
                      breadcrumb: "Input Nilai",
                    },
                  },
                ],
              },
            ],
          },
          {
            path: "ujian-ta",
            name: "UjianTAforDosen",
            component: UjianTAforDosen,
            meta: {
              breadcrumb: "Ujian",
            },
            children: [
              {
                path: "detail-ujian-ta/:tugas_akhir_id",
                name: "DetailUjianTAforDosen",
                component: detailUjianTAforDosen,
                meta: {
                  breadcrumb: "Detail",
                },
                children: [
                  {
                    path: "input-nilai-ujian-ta",
                    name: "InputNilaiUjianTAforDosen",
                    component: InputNilaiUjianTAforDosen,
                    meta: {
                      breadcrumb: "Input Nilai",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
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
    path: "/admin-ta/tugas-akhir",
    component: AdminLayoutTA,
    meta: {
      requiresAuth: true,
      userType: "admin",
      requiredRole: "admin_ta",
      breadcrumb: "Tugas Akhir",
    },
    children: [
      // {
      //   path: '',
      //   redirect: '/admin-ta/tugas-akhir/dashboard'
      // },
      {
        path: "",
        name: "DashboardAdminTa",
        component: DashboardTAAdmin,
        meta: {
          breadcrumb: "Dashboard",
        },
      },
      {
        path: "tugas-akhir",
        name: "TugasAkhirforAdminTa",
        component: TugasAkhirforAdminTa,
        meta: {
          breadcrumb: "Tugas Akhir",
        },
      },
      {
        path: "bimbingan",
        name: "BimbinganforAdmin",
        component: BimbinganforAdmin,
        meta: {
          breadcrumb: "Bimbingan",
        },
        children: [
          {
            path: "plot-pembimbing/:tugas_akhir_id",
            name: "PlotPembimbingForAdmin",
            component: PlotPembimbingForAdmin,
            meta: {
              breadcrumb: "Plot Pembimbing",
            },
          },
          {
            path: "detail-bimbingan/:tugas_akhir_id",
            name: "DetailBimbinganForAdmin",
            component: DetailBimbinganForAdmin,
            meta: {
              breadcrumb: "Detail",
            },
          },
        ],
      },
      {
        path: "proposal",
        name: "ProposalforAdmin",
        component: ProposalforAdmin,
        meta: {
          breadcrumb: "Proposal",
        },
        children: [
          {
            path: "detail-pengajuan/:proposal_id",
            name: "DetailPengajuanForAdmin",
            component: DetailPengajuanForAdmin,
            meta: {
              breadcrumb: "Validasi",
            },
          },
          {
            path: "detail-proposal/:proposal_id",
            name: "DetailProposalForAdmin",
            component: DetailProposalForAdmin,
            meta: {
              breadcrumb: "Detail",
            },
            children: [
              {
                path: "input-nilai",
                name: "InputNilaiProposalForAdmin",
                component: InputNilaiProposalForAdmin,
                meta: {
                  breadcrumb: "Input Nilai",
                  parentPath: (route) =>
                    `/admin-ta/tugas-akhir/proposal/detail-proposal/${route.params.proposal_id}`,
                },
              },
            ],
          },
        ],
      },
      {
        path: "ujian-ta",
        name: "UjianTAforAdmin",
        component: TugasAkhirforAdmin,
        meta: {
          breadcrumb: "Ujian",
        },
        children: [
          {
            path: "plotting-penguji/:tugas_akhir_id",
            name: "PlottingPengujiForAdmin",
            component: PlottingPengujiForAdmin,
            meta: {
              breadcrumb: "Plot Penguji",
            },
          },
          {
            path: "detail-pendaftar/:tugas_akhir_id",
            name: "DetailPendaftarForAdmin",
            component: DetailPendaftarForAdmin,
            meta: {
              breadcrumb: "Validasi",
            },
          },
          {
            path: "penjadwalan/:tugas_akhir_id",
            name: "PenjadwalanForAdmin",
            component: PenjadwalanForAdmin,
            meta: {
              breadcrumb: "Penjadwalan",
            },
          },
        ],
      },
      {
        path: "ruang-sesi",
        component: RuangSesiforAdmin,
        meta: {
          breadcrumb: "Ruang & Sesi",
        },
      },
      {
        path: "kategori",
        component: KategoriforAdmin,
        meta: {
          breadcrumb: "Kategori Tugas Akhir",
        },
      },
      {
        path: "mahasiswa-dosen-aktif",
        component: MahasiswaDosenForAdmin,
        meta: {
          breadcrumb: "Mahasiswa & Dosen Aktif",
        },
      },
      {
        path: "semester-tahun-ajaran",
        component: TahunAjaranForAdmin,
        meta: {
          breadcrumb: "Semester & Tahun Ajaran",
        },
      },
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
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
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

    if (to.matched.some((record) => record.meta.requiresAksesTA)) {
      if (
        userData.type === "mahasiswa" &&
        (!userData.akses_ta || userData.akses_ta === 0)
      ) {
        toast.error(
          "Anda tidak memiliki akses ke halaman Tugas Akhir. Silakan hubungi admin."
        );
        next({ name: "Landing" });
        return;
      }
    }

    if (to.meta.userType && userData.type !== to.meta.userType) {
      // Modify this switch case to handle admin roles more specifically
      switch (userData.type) {
        case "dosen":
          redirectTo(next, userData.jabatan);
          return;
        case "admin":
          // Check admin role and redirect accordingly
          switch (userData.role) {
            case "superadmin":
              next({ name: "DashboardSuperadmin" });
              return;
            case "admin_ta":
              next({ name: "DashboardAdminTa" });
              return;
            case "admin_pengelola":
              next({ name: "DashboardAdminPengelola" });
              return;
            default:
              next({ name: "DashboardAdmin" });
              return;
          }
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
