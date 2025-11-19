import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class AuthService{
    private baseUrl='http://localhost:3000/api/auth';

    constructor(private http: HttpClient){}
    login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        map(res => {
         localStorage.setItem('token', res.token);
         localStorage.setItem('rol', res.user.rol);
         localStorage.setItem('user', JSON.stringify(res.user));
         console.log(res)
         return res;         
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('user');
  }

  getRole(): string | null {
    return localStorage.getItem('rol');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  register(nombre: string, email: string, password: string, telefono: string = '', rol: string): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/register`, { nombre, email, password, telefono, rol });
}

}