import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminService } from './../../../../services/admin.service';
import { DashboardService, Contrato, Transporte } from './../../../../services/dashboard.service';
import { EstadisticasService } from '../../../../services/estadisticas.service';

import { NgApexchartsModule } from "ng-apexcharts";

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels
} from "ng-apexcharts";

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  // === APEX CHART ===
  chartContratos!: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
  };

  // === DETALLES ===
  bloques: any[] = [];
  actividad: any[] = [];
  contratosDetallados: any[] = [];
  lotesDetallados: any[] = [];

  // === USUARIOS ===
  totalUsuarios = 0;
  totalAgricultores = 0;
  totalCompradores = 0;
  totalAnalistas = 0;

  // === CONTRATOS ===
  totalContratos = 0;
  contratosAprobados = 0;
  contratosRevision = 0;
  contratosRechazados = 0;
  contratosBlockchain = 0;

  // === LOTES ===
  totalLotes = 0;
  lotesDisponibles = 0;

  // === TRANSPORTE ===
  totalTransportes = 0;
  transportesActivos = 0;
  transportesPendientes = 0;

  // === BLOCKCHAIN ===
  totalBloques = 0;
  ultimoHash = '—';

  constructor(
    private adminService: AdminService,
    private dashService: DashboardService,
    private estService: EstadisticasService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarContratos();
    this.cargarLotes();
    this.cargarTransportes();
    this.cargarBlockchain();

    // Estadísticas nuevas
    this.cargarContratosDetalle();
    this.cargarBlockchainDetalle();
    this.cargarActividad();
    this.cargarLotesDetalle();

    // Inicializar gráfica
    setTimeout(() => this.generarChartContratos(), 300);
  }

  // =====================================
  // 📊 GRÁFICO APEXCHARTS
  // =====================================
  generarChartContratos() {
    this.chartContratos = {
      series: [
        {
          name: "Contratos",
          data: [
            this.contratosAprobados,
            this.contratosRevision,
            this.contratosRechazados,
            this.contratosBlockchain
          ]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      title: {
        text: "Estado de los Contratos"
      },
      xaxis: {
        categories: ["Aprobados", "Revisión", "Rechazados", "Blockchain"]
      },
      dataLabels: {
        enabled: true
      }
    };
  }

  // =====================================
  // 👤 USUARIOS
  // =====================================
  cargarUsuarios() {
    this.adminService.listarUsuarios().subscribe(res => {
      const usuarios = res.users || [];
      this.totalUsuarios = usuarios.length;
      this.totalAgricultores = usuarios.filter(u => u.rol === 'AGRICULTOR').length;
      this.totalCompradores = usuarios.filter(u => u.rol === 'COMPRADOR').length;
      this.totalAnalistas = usuarios.filter(u => u.rol === 'ANALISTA').length;
    });
  }

  // =====================================
  // 📄 CONTRATOS
  // =====================================
  cargarContratos() {
    this.dashService.listarContratos().subscribe(res => {
      const contratos = res.contratos || [];
      this.totalContratos = contratos.length;

      this.contratosAprobados = contratos.filter((c: Contrato) => c.estado === 'APROBADO_ANALISTA').length;
      this.contratosRevision = contratos.filter((c: Contrato) => c.estado === 'PENDIENTE_ANALISIS').length;
      this.contratosRechazados = contratos.filter((c: Contrato) => c.estado === 'RECHAZADO').length;
      this.contratosBlockchain = contratos.filter((c: Contrato) => c.estado === 'EN_BLOCKCHAIN').length;
    });
  }

  // =====================================
  // 📦 LOTES
  // =====================================
  cargarLotes() {
    this.dashService.lotesDisponibles().subscribe(res => {
      const lotes = res.lotes || [];
      this.lotesDisponibles = lotes.length;
      this.totalLotes = lotes.length;
    });
  }

  // =====================================
  // 🚛 TRANSPORTE
  // =====================================
  cargarTransportes() {
    this.dashService.obtenerTransportes().subscribe(res => {
      const transportes = res.transportes || [];
      this.totalTransportes = transportes.length;

      this.transportesActivos = transportes.filter((t: Transporte) => t.estado === 'ACTIVO').length;
      this.transportesPendientes = transportes.filter((t: Transporte) => t.estado === 'PENDIENTE').length;
    });
  }

  // =====================================
  // ⛓ BLOCKCHAIN
  // =====================================
  cargarBlockchain() {
    this.dashService.getBlocks().subscribe(res => {
      const blocks = res.blocks || [];
      this.totalBloques = blocks.length;
  
      if (blocks.length > 0) {
        const ultimoBloque = blocks[blocks.length - 1];
        this.ultimoHash = ultimoBloque?.hash || '—';
      } else {
        this.ultimoHash = '—';
      }
    });
  }
  

  // =====================================
  // 📌 DETALLES EXTRA
  // =====================================
  cargarContratosDetalle() {
    this.estService.getContratosDetalle().subscribe(res => {
      this.contratosDetallados = res.contratos;
    });
  }

  cargarBlockchainDetalle() {
    this.estService.getBlockchainDetalle().subscribe(res => {
      this.bloques = res.blocks;
    });
  }

  cargarActividad() {
    this.estService.getActividadDiaria().subscribe(res => {
      this.actividad = res.actividad;
    });
  }

  cargarLotesDetalle() {
    this.estService.getLotesDetalle().subscribe(res => {
      this.lotesDetallados = res.lotes;
    });
  }
}
