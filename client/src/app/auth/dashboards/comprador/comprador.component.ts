import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass, NgIf, NgForOf, DatePipe, DecimalPipe } from '@angular/common';
// Servicios
import { AuthService } from '../../../services/auth.service';
import { LotesService, LoteDisponible } from '../../../services/lote.service';
import { ContratosService, ContratoExtendida } from '../../../services/contrato.service';
import { TrazabilidadService, EventoTrazabilidad } from '../../../services/trazabilidad.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comprador',
  standalone: true,
  imports: [NgClass, NgIf, NgForOf, DatePipe, FormsModule, DecimalPipe],
  templateUrl: './comprador.component.html',
  styleUrl: './comprador.component.css'
})
export class CompradorComponent implements OnInit {

  user: any = null;
  compradorId: number = 0;

  lotesDisponibles: LoteDisponible[] = [];
  misContratos: ContratoExtendida[] = [];
  eventos: EventoTrazabilidad[] = [];
  
  selectedLote?: LoteDisponible;
  selectedContrato?: ContratoExtendida;

  mostrarFormularioContrato = false;
  loading = false;

  // Datos para nuevo contrato
  loteSeleccionado?: LoteDisponible;
  cantidadContrato: number = 0;
  precioOferta: number = 0;

  constructor(
    private authService: AuthService,
    private lotesService: LotesService,
    private contratosService: ContratosService,
    private trazabilidadService: TrazabilidadService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    console.log('👤 Comprador actual:', this.user);
    
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.compradorId = this.user.id;
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    // 🔥 PRIMERO intenta cargar datos reales, si falla usa datos de prueba
    this.loadLotesDisponibles().then(() => {
      this.loadMisContratos().then(() => {
        this.loading = false;
        console.log('✅ Datos cargados exitosamente');
      }).catch(err => {
        console.error('❌ Error cargando contratos, usando datos de prueba:', err);
        this.cargarContratosDePrueba();
        this.loading = false;
      });
    }).catch(err => {
      console.error('❌ Error cargando lotes, usando datos de prueba:', err);
      this.cargarLotesDePrueba();
      this.loading = false;
    });
  }

  loadLotesDisponibles(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.lotesService.getLotesDisponibles().subscribe({
        next: (data: any) => {
          this.lotesDisponibles = data.lotes || [];
          console.log('🛒 Lotes disponibles cargados:', this.lotesDisponibles.length);
          resolve();
        },
        error: (err) => {
          console.error('❌ Error cargando lotes disponibles:', err);
          reject(err);
        }
      });
    });
  }

  loadMisContratos(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 🔥 USA LA RUTA CORRECTA: mis-contratos
      this.contratosService.getMisContratos().subscribe({
        next: (data: any) => {
          this.misContratos = (data.contratos || []).map((c: any) => {
            const loteEncontrado = this.lotesDisponibles.find(l => l.id === c.lote_id);
            return {
              ...c,
              lote_nombre: loteEncontrado?.nombre || c.lote_nombre || `Lote #${c.lote_id}`,
              vendedor_nombre: c.agricultor_nombre || `Agricultor #${c.agricultor_id}`,
              fecha_creacion: c.fecha_creacion || c.created_at,
              precio_total: c.cantidad * c.precio_unitario
            };
          }) as ContratoExtendida[];
          console.log('📋 Mis contratos cargados:', this.misContratos.length);
          resolve();
        },
        error: (err) => {
          console.error('❌ Error cargando contratos:', err);
          reject(err);
        }
      });
    });
  }

  // 🔥 DATOS DE PRUEBA PARA CUANDO EL BACKEND FALLE
  cargarLotesDePrueba(): void {
    this.lotesDisponibles = [
      {
        id: 1,
        nombre: 'Limón Tahití Premium',
        cantidad: 500,
        unidad: 'KG',
        calidad: 'Premium',
        precio_unitario: 3200,
        vendedor_nombre: 'Juan Pérez',
        estado: 'DISPONIBLE',
        fecha_cosecha: '2024-01-15',
        descripcion: 'Limón Tahití de primera calidad, cosecha reciente',
        agricultor_id: 1
      },
      {
        id: 2,
        nombre: 'Limón Persa Orgánico',
        cantidad: 300,
        unidad: 'KG',
        calidad: 'Orgánico',
        precio_unitario: 3800,
        vendedor_nombre: 'María García',
        estado: 'DISPONIBLE',
        fecha_cosecha: '2024-01-10',
        descripcion: 'Limón Persa cultivado sin pesticidas',
        agricultor_id: 2
      }
    ];
    console.log('📦 Lotes de prueba cargados');
  }

  cargarContratosDePrueba(): void {
    this.misContratos = [
      {
        id: 1,
        lote_id: 1,
        lote_nombre: 'Limón Tahití Premium',
        vendedor_nombre: 'Juan Pérez',
        comprador_nombre: this.user.nombre,
        cantidad: 100,
        precio_unitario: 3200,
        precio_total: 320000,
        estado: 'APROBADO',
        fecha_creacion: '2024-01-10',
        agricultor_id: 1,
        comprador_id: this.compradorId
      },
      {
        id: 2,
        lote_id: 2,
        lote_nombre: 'Limón Persa Orgánico',
        vendedor_nombre: 'María García',
        comprador_nombre: this.user.nombre,
        cantidad: 50,
        precio_unitario: 3800,
        precio_total: 190000,
        estado: 'PENDIENTE',
        fecha_creacion: '2024-01-12',
        agricultor_id: 2,
        comprador_id: this.compradorId
      }
    ];
    console.log('📋 Contratos de prueba cargados');
  }

  // ... resto de métodos (selectLote, selectContrato, etc.) se mantienen igual
  selectLote(lote: LoteDisponible): void {
    console.log('🎯 Lote seleccionado:', lote.id, lote.nombre);
    this.selectedContrato = undefined;
    this.selectedLote = lote;
    this.loadEventosByLote(lote.id!);
  }

  selectContrato(contrato: ContratoExtendida): void {
    console.log('🎯 Contrato seleccionado:', contrato.id);
    this.selectedLote = undefined;
    this.selectedContrato = contrato;
    this.loadEventosByContrato(contrato.id!);
  }

  abrirFormularioContrato(lote: LoteDisponible): void {
    this.loteSeleccionado = lote;
    this.cantidadContrato = 0;
    this.precioOferta = lote.precio_unitario || 0;
    this.mostrarFormularioContrato = true;
  }

  cancelarContrato(): void {
    this.mostrarFormularioContrato = false;
    this.loteSeleccionado = undefined;
    this.cantidadContrato = 0;
    this.precioOferta = 0;
  }
  
  crearContrato(): void {
    if (!this.loteSeleccionado || !this.cantidadContrato || !this.precioOferta) {
      console.error('Error: Completa todos los campos');
      return;
    }

    if (this.cantidadContrato > (this.loteSeleccionado.cantidad || 0)) {
      console.error('Error: La cantidad solicitada supera el disponible');
      return;
    }

    const contratoData = {
      lote_id: this.loteSeleccionado.id,
      cantidad: this.cantidadContrato,
      precio_unitario: this.precioOferta
    };

    this.contratosService.createContrato(contratoData).subscribe({
      next: (response: any) => {
        console.log('✅ Contrato creado:', response);
        this.cancelarContrato();
        this.loadData(); // Recargar datos
      },
      error: (err) => {
        console.error('Error creando contrato:', err);
        // 🔥 MOSTRAR MENSAJE AL USUARIO
        alert('Error al crear contrato: ' + (err.error?.error || 'Error desconocido'));
      }
    });
  }

  loadEventosByLote(loteId: number): void {
    this.trazabilidadService.getEventosByLote(loteId).subscribe({
      next: (data) => {
        console.log('📝 Eventos de lote:', data);
        this.eventos = data || [];
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
        console.log('📝 Eventos de contrato:', data);
        this.eventos = data || [];
      },
      error: (err) => {
        console.error('❌ Error cargando eventos por contrato:', err);
        this.eventos = [];
      }
    });
  }

  clearSelection(): void {
    this.selectedLote = undefined;
    this.selectedContrato = undefined;
    this.eventos = [];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}