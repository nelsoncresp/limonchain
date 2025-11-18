import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface EventoTrazabilidad {
  id: number;
  contrato_id?: number;
  lote_id?: number;
  evento: string;
  descripcion?: string;
  hash_blockchain?: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrazabilidadService {
  private baseUrl = 'http://localhost:3000/api/trazabilidad';

  constructor(private http: HttpClient) {}
  testBackendConnection(): void {
    console.log('🔍 TEST: Probando conexión con backend...');
    this.http.get('http://localhost:3000/api/trazabilidad/lote/7').subscribe({
      next: (data: any) => {
        console.log('✅ Diagnóstico backend lote 7:', data);
      },
      error: (err) => {
        console.error('❌ Error diagnóstico backend lote 7:', err);
      }
    });

    this.http.get('http://localhost:3000/api/trazabilidad/contrato/12').subscribe({
      next: (data: any) => {
        console.log('✅ Diagnóstico backend contrato 12:', data);
      },
      error: (err) => {
        console.error('❌ Error diagnóstico backend contrato 12:', err);
      }
    });
  }

  // Obtener eventos de trazabilidad por lote
  getEventosByLote(loteId: number): Observable<EventoTrazabilidad[]> {
    console.log('🔍 SERVICE: Solicitando eventos para lote:', loteId);
    return this.http.get<EventoTrazabilidad[]>(`${this.baseUrl}/lote/${loteId}`)
      .pipe(
        tap(data => console.log('✅ SERVICE: Eventos recibidos para lote', loteId, ':', data))
      );
  }

  // Obtener eventos de trazabilidad por contrato
  getEventosByContrato(contratoId: number): Observable<EventoTrazabilidad[]> {
    console.log('🔍 SERVICE: Solicitando eventos para contrato:', contratoId);
    return this.http.get<EventoTrazabilidad[]>(`${this.baseUrl}/contrato/${contratoId}`)
      .pipe(
        tap(data => console.log('✅ SERVICE: Eventos recibidos para contrato', contratoId, ':', data))
      );
  }
}
