import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Contrato } from '../interfaces/Contrato';

@Injectable({
  providedIn: 'root'
})
export class AnalisisService {
  private baseUrl = 'http://localhost:3000/api/analisis';

  constructor(private http: HttpClient) { }
  obtenerTodos(): Observable<Contrato[]> {
    return this.http.get<{ contratos: Contrato[] }>(`${this.baseUrl}/todos`)
      .pipe(map(res => res.contratos));
  }
  
  obtenerPendientes(): Observable<Contrato[]> {
    return this.http.get<{ contratos: Contrato[] }>(`${this.baseUrl}/pendientes`)
      .pipe(map(res => res.contratos));
  }

  aprobarContrato(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/aprobar`, {});
  }

  rechazarContrato(id: number, comentario: string = ''): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/rechazar`, { comentario });
  }

  obtenerDetalle(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.baseUrl}/detalle/${id}`);
  }
}
