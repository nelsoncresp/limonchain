import { Component, OnInit, inject } from '@angular/core';
import { TransporteService } from '../../../services/transporte.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
 selector: 'app-transportista',
 standalone: true,
 imports: [CommonModule, FormsModule],
 templateUrl: './transportista.component.html'
})
export class TransportistaComponent implements OnInit {

 private transporteService = inject(TransporteService);
  private authService = inject(AuthService);
  private router = inject(Router);

  transportes: any[] = [];
  loading = true;
  nuevoEstado: Record<number, string> = {};

  ngOnInit() {
    this.cargarTransportes();
  }

  cargarTransportes() {
    this.transporteService.getMyTransportes().subscribe({
      next: (resp) => {
        // Normalizar respuesta
        if (Array.isArray(resp.transportes)) {
          this.transportes = resp.transportes;
        } else if (Array.isArray(resp)) {
          this.transportes = resp;
        } else {
          this.transportes = [];
        }

        // Inicializar selects
        this.transportes.forEach(t => {
          if (t.id && t.estado) {
            this.nuevoEstado[t.id] = t.estado;
          }
        });

        this.loading = false;
      },
      error: (e) => {
        console.error('Error cargando transportes', e);
        this.transportes = [];
        this.loading = false;
      }
    });
  }

  actualizarEstado(id: number) {
    const estado = this.nuevoEstado[id];
    if (!estado) return;

    this.transporteService.updateEstado(id, { estado }).subscribe({
      next: () => {
        const item = this.transportes.find(t => t.id === id);
        if (item) item.estado = estado;
        console.log(`Estado del transporte #${id} actualizado a ${estado}`);
      },
      error: (e) => console.error('Error actualizando estado', e)
    });
  }

  verReporte(): void {
    console.log('[Transportista] Botón Ver Reporte presionado');
    // this.router.navigate(['/reporte']); // Si quieres navegar
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}