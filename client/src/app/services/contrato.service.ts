import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

export interface Contrato {
  id: number;
  lote_id: number;
  agricultor_id: number;
  comprador_id: number;
  analista_id?: number;
  precio_unitario: number;
  cantidad: number;
  fecha_entrega?: string;
  estado: string;
  comentario_analista?: string;
  fecha_creacion?: string; 
  fecha_actualizacion?: string;
   lote_nombre?: string;
  comprador_nombre?: string;
  agricultor_nombre?: string;
  analista_nombre?: string;
}
export interface ContratoExtendida extends Contrato {
  lote_nombre?: string;
  vendedor_nombre?: string;
  comprador_nombre?: string;
  fecha_creacion?: string;
  precio_total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private baseUrl = 'https://limonchain-api.onrender.com/api/contratos';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

 getContratosByAgricultor(agricultorId: number): Observable<Contrato[]> {
    console.log(`🔍 Solicitando contratos para agricultor: ${agricultorId}`);
    
    return this.http.get<Contrato[]>(`${this.baseUrl}/agricultor/${agricultorId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(contratos => {
        console.log(`Contratos recibidos:`, contratos);
      }),
      catchError(error => {
        console.error(`Error obteniendo contratos:`, error);
        console.warn(`Retornando array vacío`);
        return of([]);
      })
    );
  }

  // Obtener detalles de un contrato específico
  getContratoById(contratoId: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.baseUrl}/${contratoId}`, {
      headers: this.getHeaders()
    });
  }
  getContratosByComprador(compradorId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/comprador/${compradorId}`,{
      headers: this.getHeaders()
    });
  }

// Crear contrato
createContrato(contratoData: any): Observable<any> {
  return this.http.post(this.baseUrl, contratoData);
}
getMisContratos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/mis-contratos`, {
      headers: this.getHeaders()
    });
  }
}