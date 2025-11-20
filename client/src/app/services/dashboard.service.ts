import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bloque {
  id: number;
  hash: string;
  contrato_id?: number;
  timestamp?: string;
  data?: any;
}

export interface Contrato {
  id: number;
  estado: string;
  lote_id?: number;
  comprador_id?: number;
  analista_id?: number;
  fecha_creacion?: string;
  [k: string]: any;
}

export interface Lote {
  id: number;
  nombre?: string;
  estado?: string;
  [k: string]: any;
}

export interface Transporte {
  id: number;
  placa?: string;
  estado?: string;
  [k: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private base = 'https://limonchain-api.onrender.com/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  // Blockchain
  getBlocks(): Observable<{ blocks: Bloque[] }> {
    return this.http.get<{ blocks: Bloque[] }>(
      `${this.base}/blockchain`,
      { headers: this.getAuthHeaders() }
    );
  }

  repararBlockchain(): Observable<any> {
    return this.http.post(
      `${this.base}/blockchain/reparar`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Contratos
  listarContratos(): Observable<{ contratos: Contrato[] }> {
    return this.http.get<{ contratos: Contrato[] }>(
      `${this.base}/contratos`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Lotes
  lotesDisponibles(): Observable<{ lotes: Lote[] }> {
    return this.http.get<{ lotes: Lote[] }>(
      `${this.base}/lotes/disponibles`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Transporte
  obtenerTransportes(): Observable<{ transportes: Transporte[] }> {
    return this.http.get<{ transportes: Transporte[] }>(
      `${this.base}/transporte`,
      { headers: this.getAuthHeaders() }
    );
  }
}
