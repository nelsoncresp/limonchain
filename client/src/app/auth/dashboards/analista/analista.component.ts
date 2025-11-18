import { Component, OnInit } from '@angular/core';
import { AnalisisService } from '../../../services/analisis.service';
import { Contrato } from '../../../interfaces/Contrato';
import { NgIf, NgForOf, CurrencyPipe, NgClass, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-analista',
  standalone: true,
  imports: [NgForOf, NgIf,
    CurrencyPipe, FormsModule, NgClass, DecimalPipe],
  templateUrl: './analista.component.html',
  styleUrl: './analista.component.css'
})
export class AnalistaComponent implements OnInit {
  contratos: Contrato[] = [];
  filtroEstado: string = 'TODOS';
  searchTerm: string = '';

  cargando: boolean = false;
  error: string = '';
  currentUser: any = null;

  constructor(private analisisService: AnalisisService,
    public auth: AuthService,
    public router: Router) { }

  ngOnInit(): void {
    this.cargarContratos();
    this.currentUser = this.auth.getUser();
  }

  cargarContratos() {
    this.cargando = true;
    this.error = '';

    this.analisisService.obtenerTodos().subscribe({
      next: data => {
        this.contratos = data;
        this.cargando = false;
      },
      error: err => {
        this.error = 'Error al cargar los contratos';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  valorTotal(c: Contrato): number {
    return Number(c.cantidad) * Number(c.precio_unitario);
  }

  margen(c: Contrato): number {
    if (!c.costo_estimado) return 0;
    return (Number(c.precio_unitario) - Number(c.costo_estimado)) * Number(c.cantidad);
  }

  conveniencia(c: Contrato): string {
    const m = this.margen(c);
    if (m > 30000) return 'Alta';
    if (m > 10000) return 'Media';
    return 'Baja';
  }


  aprobar(c: Contrato) {
    this.analisisService.aprobarContrato(c.id).subscribe({
      next: () => c.estado = 'APROBADO_ANALISTA',
      error: err => console.error(err)
    });
  }

  rechazar(c: Contrato) {
    this.analisisService.rechazarContrato(c.id).subscribe({
      next: () => c.estado = 'RECHAZADO_ANALISTA',
      error: err => console.error(err)
    });
  }

  filteredContratos(): Contrato[] {
    return this.contratos.filter(c =>
      (!this.filtroEstado || this.filtroEstado === 'TODOS' || c.estado === this.filtroEstado) &&
      (
        c.agricultor_nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.comprador_nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.lote_nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }


  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  exportarCSV() {
    const contratos = this.filteredContratos();
    if (!contratos || contratos.length === 0) return;

    const headers = [
      'ID', 'Agricultor', 'Comprador', 'Cantidad',
      'Precio Unitario (COP)', 'Valor Total (COP)',
      'Margen Estimado (COP)', 'Conveniencia', 'Estado'
    ];

    const rows = contratos.map(c => [
      c.id,
      c.agricultor_nombre,
      c.comprador_nombre,
      c.cantidad,
      Number(c.precio_unitario),
      this.valorTotal(c),
      this.margen(c),
      this.conveniencia(c),
      c.estado
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'contratos_filtrados.csv');
    a.click();
    window.URL.revokeObjectURL(url);
  }
  exportarPDF() {
    const contratos = this.filteredContratos();
    if (!contratos || contratos.length === 0) return;
  
    const doc = new jsPDF();
  
    const columns = [
      'ID', 'Agricultor', 'Comprador', 'Cantidad',
      'Precio Unitario (COP)', 'Valor Total (COP)',
      'Margen Estimado (COP)', 'Conveniencia', 'Estado'
    ];
  
    const rows = contratos.map(c => [
      c.id,
      c.agricultor_nombre,
      c.comprador_nombre,
      c.cantidad,
      Number(c.precio_unitario),
      this.valorTotal(c),
      this.margen(c),
      this.conveniencia(c),
      c.estado
    ]);
  
    autoTable(doc, {
      head: [columns],
      body: rows
    });
  
    doc.save('contratos_filtrados.pdf');
  }
  
}