// src/app/admin/admin.component.ts

import { Component, OnInit } from '@angular/core'; // <<< Importar OnInit
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NgIf, NgForOf, CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgIf, NgForOf, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit { // <<< Implementar OnInit
  
  currentUser: any = null; 
  mostrarMenu = false;
  
  constructor(
    public auth: AuthService,
    public router: Router
  ) {}
  
  ngOnInit(): void { 
    this.currentUser = this.auth.getUser();
  }
    
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  
  accionRapida() {
    if (!this.currentUser) return;

    switch (this.currentUser.rol) {
      case 'ADMIN':
        this.router.navigate(['/admin/usuarios/crear']);
        break;

      case 'AGRICULTOR':
        this.router.navigate(['/agricultor/lotes/crear']);
        break;

      case 'COMPRADOR':
        this.router.navigate(['/comprador/contratos/crear']);
        break;

      case 'ANALISTA':
        this.router.navigate(['/analista/pendientes']);
        break;

      case 'TRANSPORTISTA':
        this.router.navigate(['/transportista/rutas']);
        break;

      default:
        console.warn("Rol no reconocido");
    }
  }

  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }
}