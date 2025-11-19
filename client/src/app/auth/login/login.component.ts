import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, HttpClientModule, RouterLink, RouterModule,
    CommonModule] ,
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  error: string = '';

  constructor(private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router) {}

  ngOnInit() {
  // Si ya hay token
  const rol = this.auth.getRole();
  if (rol) {
    this.router.navigate([`/${rol.toLowerCase()}`]);
  }
}
  submit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.auth.login(email!, password!).subscribe({
      next: (res) => {
        const rol = res.user.rol;

        // Redirigir según rol
        switch (rol) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;
          case 'AGRICULTOR':
            this.router.navigate(['/agricultor']);
            break;
          case 'COMPRADOR':
            this.router.navigate(['/comprador']);
            break;
          case 'ANALISTA':
            this.router.navigate(['/analista']);
            break;
          case 'TRANSPORTISTA':
            this.router.navigate(['/transportista']);
            break;
          default:
            this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al iniciar sesión';
      }
    });
  }

}
