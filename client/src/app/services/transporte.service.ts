import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TransporteService {

    private http = inject(HttpClient);

    // Cambia esto según tu API
    private apiUrl = 'http://localhost:3000/api/transporte';

    constructor() { }

    // Transportista: obtener transportes asignados
     getMyTransportes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my`);
  }

  // Actualizar estado del transporte
  updateEstado(id: number, data: { estado: string; evidenciaUrl?: string }) {
    // ⚡ Usar /status según tu backend
    return this.http.put(`${this.apiUrl}/${id}/status`, data);
  }

}
