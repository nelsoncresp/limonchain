// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  rol: string;
  estado?: boolean;
  fecha_creacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'https://limonchain-api.onrender.com/api/admin/usuarios';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  listarUsuarios(): Observable<{ users: Usuario[] }> {
    return this.http.get<{ users: Usuario[] }>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // ✔ creación → password obligatoria
  crearUsuario(data: Partial<Usuario> & { password?: string }) {
  if (!data.password) {
    throw new Error('Password requerida al crear usuario');
  }

  return this.http.post(this.baseUrl, data, {
    headers: this.getAuthHeaders()
  });
}

  // ✔ edición → password opcional
  actualizarUsuario(id: number, data: Partial<Usuario> & { password?: string }) {
    return this.http.put(`${this.baseUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarUsuario(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  estadisticasUsuarios() {
    return this.http.get(`${this.baseUrl}/estadisticas`, {
      headers: this.getAuthHeaders()
    });
  }
}
