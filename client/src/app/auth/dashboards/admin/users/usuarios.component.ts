// usuarios.component.ts
import { Component, OnInit } from '@angular/core';
import { NgIf, NgForOf, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { AdminService, Usuario } from '../../../../services/admin.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [NgIf, NgForOf, CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  modalVisible = false;
  editUsuario: Usuario | null = null;
  userForm: FormGroup;
  mensaje = '';
  error = '';

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      rol: ['', Validators.required],
      password: [''],
      confirmPassword: ['']
    }, { validators: this.passwordsMatch });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  // Cargar usuarios
  cargarUsuarios() {
    this.adminService.listarUsuarios().subscribe(res => {
      this.usuarios = res.users;
    });
  }

  // Validación de passwords iguales
  passwordsMatch(group: FormGroup): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (pass || confirm) {
      return pass === confirm ? null : { notMatching: true };
    }
    return null;
  }

  // Abrir modal
  abrirModal(usuario?: Usuario) {
    this.error = '';
    this.editUsuario = usuario ?? null;
    this.modalVisible = true;

    if (usuario) {
      // EDITAR
      this.userForm.setValue({
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
        password: '',
        confirmPassword: ''
      });
    } else {
      // CREAR
      this.userForm.reset({
        nombre: '',
        email: '',
        telefono: '',
        rol: 'AGRICULTOR',
        password: '',
        confirmPassword: ''
      });
    }
  }

  // Cerrar modal
  cerrarModal() {
    this.modalVisible = false;
    this.error = '';
  }

  // Guardar usuario
  guardarUsuario() {
    this.error = '';
  
    // Password obligatorio solo al crear
    if (!this.editUsuario) {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      this.userForm.get('password')?.clearValidators();
    }
    this.userForm.get('password')?.updateValueAndValidity();
  
    // Validación del formulario
    if (this.userForm.invalid) {
      this.error = this.userForm.errors?.['notMatching']
        ? 'Las contraseñas no coinciden.'
        : 'Por favor completa correctamente los campos.';
      return;
    }
  
    // 👉 1 sola declaración de data (fix)
    let data: any = { ...this.userForm.value };
  
    // remover confirmPassword SIEMPRE
    delete data.confirmPassword;
  
    // si está editando y password viene vacía → no enviarla
    if (this.editUsuario && !data.password) {
      delete data.password;
    }
  
    if (this.editUsuario) {
      // ----- EDITAR USUARIO -----
      this.adminService.actualizarUsuario(this.editUsuario.id, data).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarModal();
          this.mostrarMensaje('Usuario actualizado correctamente');
        },
        error: err => {
          console.log(err);
          this.error = err.error?.message || 'Error al actualizar usuario.';
        }
      });
  
    } else {
      // ----- CREAR USUARIO -----
      this.adminService.crearUsuario(data).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarModal();
          this.mostrarMensaje('Usuario creado correctamente');
        },
        error: err => {
          console.log(err);
          this.error = err.error?.message || 'Error al crear usuario.';
        }
      });
    }
  }
  

  // Eliminar usuario
  eliminarUsuario(id: number) {
    this.adminService.eliminarUsuario(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        this.mostrarMensaje('Usuario eliminado');
      },
      error: err => {
        if (err.error?.error?.includes('registros asociados')) {
          this.mostrarMensaje('No se puede eliminar el usuario, está asociado a registros.');
        } else {
          this.mostrarMensaje('Error al eliminar');
        }
      }
    });
  }

  // Mostrar mensaje temporal
  mostrarMensaje(texto: string) {
    this.mensaje = texto;
    setTimeout(() => this.mensaje = '', 3000);
  }

  // TrackBy para ngFor
  trackByUserId(index: number, usuario: Usuario): number {
    return usuario.id;
  }
}
