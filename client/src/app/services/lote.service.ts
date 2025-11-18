import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lote {
  id?: number;
  agricultor_id: number;
  nombre: string;
  cantidad: number;
  unidad: 'KG' | 'TON' | 'UNIDADES';
  calidad?: string;
  fecha_cosecha?: string;
  descripcion?: string;
  foto_url?: string;
  estado: 'DISPONIBLE' | 'RESERVADO' | 'EN_TRANSPORTE' | 'ENTREGADO';
}

export interface CrearLoteDto {
  nombre: string;
  cantidad: number;
  unidad: 'KG' | 'TON' | 'UNIDADES';
  descripcion?: string;
  calidad?: string;
  fecha_cosecha?: string;
  foto_url?: string;
}
export interface LoteDisponible extends Lote {
  vendedor_nombre?: string;
  precio_unitario?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LotesService {
  private baseUrl = 'http://localhost:3000/api/lotes';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getLotesByAgricultor(): Observable<{ lotes: Lote[] }> {
    return this.http.get<{ lotes: Lote[] }>(`${this.baseUrl}`, {
      headers: this.getHeaders()
    });
  }

  createLote(lote: CrearLoteDto): Observable<{ lote: Lote }> {
    return this.http.post<{ lote: Lote }>(`${this.baseUrl}`, lote, {
      headers: this.getHeaders()
    });
  }

  updateLote(id: number, lote: Partial<Lote>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, lote, {
      headers: this.getHeaders()
    });
  }

  deleteLote(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
  getLotesDisponibles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/disponibles`, {
      headers: this.getHeaders()
    });
  }
}