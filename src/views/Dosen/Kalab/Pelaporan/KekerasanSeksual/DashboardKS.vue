<template>
    <div class="dashboard-pelaporan-kejadian">
      <h1 class="page-title">Dashboard Pelaporan Kekerasan Seksual</h1>
      
      <div class="statistics-cards">
        <div class="stats-card">
          <div class="stats-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="stats-content">
            <h3>Total Kejadian</h3>
            <p class="stats-number">24</p>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stats-content">
            <h3>Selesai Ditangani</h3>
            <p class="stats-number">18</p>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stats-content">
            <h3>Dalam Proses</h3>
            <p class="stats-number">6</p>
          </div>
        </div>
      </div>
      
      <div class="recent-reports">
        <h2 class="section-title">Laporan Kejadian Terbaru</h2>
        <table class="reports-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Laboratorium</th>
              <th>Deskripsi Kejadian</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(report, index) in recentReports" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ report.date }}</td>
              <td>{{ report.lab }}</td>
              <td>{{ report.description }}</td>
              <td>
                <span :class="'status-badge ' + report.statusClass">
                  {{ report.status }}
                </span>
              </td>
              <td>
                <button class="btn-detail">Detail</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DashboardPelaporanKejadian',
    data() {
      return {
        recentReports: [
          {
            date: '12 Nov 2023',
            lab: 'Lab Jaringan',
            description: 'Perangkat switch rusak setelah pemadaman listrik',
            status: 'Selesai',
            statusClass: 'status-complete'
          },
          {
            date: '10 Nov 2023',
            lab: 'Lab Database',
            description: 'Server database tidak dapat diakses',
            status: 'Dalam Proses',
            statusClass: 'status-process'
          },
          {
            date: '5 Nov 2023',
            lab: 'Lab Multimedia',
            description: 'Proyektor tidak berfungsi',
            status: 'Selesai',
            statusClass: 'status-complete'
          },
          {
            date: '1 Nov 2023',
            lab: 'Lab Pemrograman',
            description: 'AC mati mendadak dan mengeluarkan bau terbakar',
            status: 'Dalam Proses',
            statusClass: 'status-process'
          },
          {
            date: '28 Okt 2023',
            lab: 'Lab IoT',
            description: 'Kebocoran air dari plafon',
            status: 'Selesai',
            statusClass: 'status-complete'
          }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard-pelaporan-kejadian {
    padding: 20px;
  }
  
  .page-title {
    font-size: 24px;
    margin-bottom: 24px;
    color: #333;
  }
  
  .statistics-cards {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stats-card {
    flex: 1;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
  }
  
  .stats-icon {
    font-size: 24px;
    margin-right: 15px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f4f8;
    color: #4a6baf;
  }
  
  .stats-content h3 {
    font-size: 16px;
    margin: 0 0 8px 0;
    color: #666;
  }
  
  .stats-number {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: #333;
  }
  
  .section-title {
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
  }
  
  .reports-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .reports-table th, 
  .reports-table td {
    padding: 12px 15px;
    text-align: left;
  }
  
  .reports-table th {
    background-color: #f0f4f8;
    color: #333;
    font-weight: 600;
  }
  
  .reports-table tr:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
  
  .reports-table tbody tr:hover {
    background-color: #f9fafb;
  }
  
  .status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .status-complete {
    background-color: #e6f7ee;
    color: #0d9a5d;
  }
  
  .status-process {
    background-color: #fff4e5;
    color: #ff8800;
  }
  
  .btn-detail {
    background-color: #4a6baf;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }
  
  .btn-detail:hover {
    background-color: #3a5999;
  }
  </style>