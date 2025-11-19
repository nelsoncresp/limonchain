import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AgricultorComponent } from './auth/dashboards/agricultor/agricultor.component';
import { AdminComponent } from './auth/dashboards/admin/admin.component';
import { CompradorComponent } from './auth/dashboards/comprador/comprador.component';
import { TransportistaComponent } from './auth/dashboards/transportista/transportista.component';
import { AnalistaComponent } from './auth/dashboards/analista/analista.component';
import { AuthGuard } from './auth/guard/auth.guard';
import { UsuariosComponent } from './auth/dashboards/admin/users/usuarios.component';
import { EstadisticasComponent } from './auth/dashboards/admin/estadisticas/estadisticas.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
   {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: UsuariosComponent },
      { path: 'estadisticas', component: EstadisticasComponent },
      //{ path: 'configuracion', component: ConfiguracionComponent },
    ],
  },
  { path: 'agricultor', component: AgricultorComponent },
  { path: 'comprador', component: CompradorComponent },
  { path: 'analista', component: AnalistaComponent },
  { path: 'transportista', component: TransportistaComponent },
  { path: '**', redirectTo: 'login' }
];
