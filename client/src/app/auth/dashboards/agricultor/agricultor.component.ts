import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass, NgIf, NgForOf, DatePipe, SlicePipe } from '@angular/common';

// Asumiendo que estos servicios existen y están inyectados en el entorno de pruebas
import { AuthService } from '../../../services/auth.service';
import { LotesService, Lote } from '../../../services/lote.service';
import { ContratosService, Contrato } from '../../../services/contrato.service';
import { TrazabilidadService, EventoTrazabilidad } from '../../../services/trazabilidad.service';
import { FormsModule } from '@angular/forms';


interface CrearLoteRequest {
  nombre: string;
  cantidad: number;
  unidad: 'KG' | 'TON' | 'UNIDADES';
  descripcion?: string;
  calidad?: string;
  fecha_cosecha?: string;
  foto_url?: string;
}

interface ContratoExtendida extends Contrato {
  lote_nombre?: string;
  comprador_nombre?: string;
  fecha_creacion?: string;
}


@Component({
  selector: 'app-agricultor',
  standalone: true,
  imports: [NgClass, NgIf, NgForOf, DatePipe, FormsModule, SlicePipe],
  templateUrl: './agricultor.component.html',
  styleUrl: './agricultor.component.css'
})
export class AgricultorComponent implements OnInit {

  user: any = null;
  agricultorId: number = 0;

  lotes: Lote[] = [];
  contratos: ContratoExtendida[] = [];
  eventos: EventoTrazabilidad[] = [];
  selectedLote?: Lote;
  selectedContrato?: ContratoExtendida;

  mostrarFormularioLote = false;

  nuevoLote: CrearLoteRequest = {
    nombre: '',
    cantidad: 0,
    unidad: 'KG',
    descripcion: '',
    calidad: '',
    fecha_cosecha: '',
    foto_url: ''
  };

  constructor(
    private authService: AuthService,
    private lotesService: LotesService,
    private contratosService: ContratosService,
    private trazabilidadService: TrazabilidadService,
    private router: Router
  ) { }

  ngOnInit(): void {
  this.user = this.authService.getUser();
  console.log('Usuario actual:', this.user);
  console.log('ID del agricultor:', this.user?.id);
  if (!this.user) return;

  this.agricultorId = this.user.id;


  this.loadLotes().then(() => {
    return this.loadContratos(); 
  }).then(() => {
    console.log('TODOS LOS DATOS CARGADOS - EJECUTANDO DIAGNÓSTICO...');
    this.trazabilidadService.testBackendConnection();
    this.debugIds();
    this.autoSeleccionarElemento(); 
  }).catch(err => {
    console.error('Error cargando datos:', err);
  });
}

  // 🔥 CAMBIAR A PROMESA PARA ESPERAR A QUE TERMINE
  loadLotes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.lotesService.getLotesByAgricultor().subscribe({
        next: (data) => {
          this.lotes = data.lotes;
          console.log('🌱 Lotes cargados:', this.lotes.length);
          resolve();
        },
        error: (err) => {
          console.error('Error cargando lotes:', err);
          reject(err);
        }
      });
    });
  }

  selectLote(lote: Lote) {
    this.selectedContrato = undefined;
    this.selectedLote = lote;
    this.loadEventosByLote(lote.id!);
  }

  abrirFormularioLote() {
    this.mostrarFormularioLote = true;
  }

  cancelarLote() {
    this.mostrarFormularioLote = false;
    this.nuevoLote = {
      nombre: '',
      cantidad: 0,
      unidad: 'KG',
      descripcion: '',
      calidad: '',
      fecha_cosecha: '',
      foto_url: ''
    };
  }

  crearLote() {
    if (!this.nuevoLote.nombre || !this.nuevoLote.cantidad || !this.nuevoLote.unidad) {
      console.error('Error: Por favor completa todos los campos obligatorios para crear el lote.');
      return;
    }

    this.lotesService.createLote(this.nuevoLote).subscribe({
      next: (response) => {
        this.lotes.push(response.lote);
        this.cancelarLote();
        this.loadLotes().then(() => {
          this.loadContratos(); // Recargar contratos después de crear lote
        });
      },
      error: (err) => {
        console.error('Error creando lote:', err);
        console.error('Error al crear el lote: ' + (err.error?.error || 'Error desconocido'));
      }
    });
  }
 // 🔥 AGREGAR ESTE MÉTODO NUEVO
autoSeleccionarElemento(): void {
  console.log('🔄 AUTO-SELECCIÓN: Iniciando...');
  console.log('📊 Estado actual - Lotes:', this.lotes.length, 'Contratos:', this.contratos.length);
  const contrato12 = this.contratos.find(c => c.id === 12);
  if (contrato12) {
    console.log('🎯 AUTO-SELECCIÓN: Encontrado contrato 12, seleccionando...');
    this.selectContrato(contrato12);
    return;
  }
  const lote7 = this.lotes.find(l => l.id === 7);
  if (lote7) {
    console.log('AUTO-SELECCIÓN: Encontrado lote 7, seleccionando...');
    this.selectLote(lote7);
    return;
  }
  if (this.contratos.length > 0) {
    console.log(' AUTO-SELECCIÓN: Seleccionando primer contrato disponible:', this.contratos[0].id);
    this.selectContrato(this.contratos[0]);
    return;
  }
  
  if (this.lotes.length > 0) {
    console.log('AUTO-SELECCIÓN: Seleccionando primer lote disponible:', this.lotes[0].id);
    this.selectLote(this.lotes[0]);
    return;
  }
  
  console.log('AUTO-SELECCIÓN: No hay elementos para seleccionar');
}
  loadContratos(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.contratosService.getContratosByAgricultor(this.agricultorId).subscribe({
      next: (data) => {
        this.contratos = data.map(c => {
          const loteEncontrado = this.lotes.find(l => l.id === c.lote_id);

          return {
            ...c,
            lote_nombre: loteEncontrado?.nombre || `Lote #${c.lote_id}`,
            comprador_nombre: (c as any).comprador_nombre || `Comprador #${c.comprador_id}`,
            fecha_creacion: c.fecha_creacion,
            precio_total: c.cantidad * c.precio_unitario
          };
        }) as ContratoExtendida[];

        console.log('📋 Contratos procesados:', this.contratos);
        resolve(); // 👈 Resolver la promesa
      },
      error: (err) => {
        console.error(' Error cargando contratos:', err);
        console.error(' Detalles del error:', err.error);
        reject(err); // 👈 Rechazar la promesa en caso de error
      }
    });
  });
}
debugIds(): void {
  console.log('🔍 DEBUG IDs - Lotes:', this.lotes.map(l => ({id: l.id, nombre: l.nombre})));
  console.log('🔍 DEBUG IDs - Contratos:', this.contratos.map(c => ({id: c.id, lote_id: c.lote_id, lote_nombre: c.lote_nombre})));
}

  selectContrato(contrato: ContratoExtendida) {
    this.selectedLote = undefined;
    this.selectedContrato = contrato;
    this.loadEventosByContrato(contrato.id!);
  }

  clearSelection() {
    this.selectedLote = undefined;
    this.selectedContrato = undefined;
    this.eventos = [];
  }

  loadEventosByLote(loteId: number): void {
    this.trazabilidadService.getEventosByLote(loteId).subscribe({
      next: (data) => {
        console.log(' Eventos de lote:', data);
        this.eventos = data;
      },
      error: (err) => {
        console.error('❌ Error cargando eventos por lote:', err);
        this.eventos = [];
      }
    });
  }

  loadEventosByContrato(contratoId: number): void {
    this.trazabilidadService.getEventosByContrato(contratoId).subscribe({
      next: (data) => {
        console.log(' Eventos de contrato:', data);
        this.eventos = data;
      },
      error: (err) => {
        console.error('❌ Error cargando eventos por contrato:', err);
        this.eventos = [];
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}