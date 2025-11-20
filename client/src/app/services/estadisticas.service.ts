import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {

  private API = 'https://limonchain-api.onrender.com/api/admin/estadisticas';

  constructor(private http: HttpClient) {}

  getContratosDetalle(): Observable<any> {
    return this.http.get(`${this.API}/contratos-detalle`);
  }

  getBlockchainDetalle(): Observable<any> {
    return this.http.get(`${this.API}/blockchain-detalle`);
  }

  getActividadDiaria(): Observable<any> {
    return this.http.get(`${this.API}/actividad`);
  }

  getLotesDetalle(): Observable<any> {
    return this.http.get(`${this.API}/lotes-detalle`);
  }

}
