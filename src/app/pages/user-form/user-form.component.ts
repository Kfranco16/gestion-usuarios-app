// src/app/components/user-form/user-form.component.ts

import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  // --- 1. Inyección de Dependencias ---
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  // --- 2. Entradas y Estado con Signals ---
  @Input() _id?: string;
  public isEditMode = computed(() => !!this._id);
  private userToUpdate = signal<IUser | null>(null);

  // --- 3. Definición del Formulario Reactivo ---
  public userForm: FormGroup;

  constructor() {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      image: ['', []],
      password: [''],
    });
  }

  // --- 4. Lógica del Ciclo de Vida (ngOnInit) ---
  ngOnInit(): void {
    if (this.isEditMode()) {
      // En modo edición, solo requerimos la contraseña si se proporciona
      this.userForm.get('password')?.setValidators([]);
      this.userForm.get('confirmPassword')?.setValidators([]);

      if (this._id) {
        this.userService.getUserById(this._id).subscribe({
          next: (user) => {
            this.userToUpdate.set(user);
            this.userForm.patchValue(user);
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al Cargar Usuario',
              text: 'No se pudo cargar la información del usuario',
              confirmButtonColor: '#dc3545',
            }).then(() => {
              this.router.navigate(['/home']);
            });
          },
        });
      }
    } else {
      // En modo creación, mantenemos todas las validaciones
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(4)]);
    }
    this.userForm.updateValueAndValidity();
  }

  // --- 5. Lógica de Envío del Formulario ---
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: 'Por favor, revisa todos los campos del formulario',
        confirmButtonColor: '#dc3545',
      });
      return;
    }

    // Mostrar loading mientras se procesa
    Swal.fire({
      title: 'Procesando...',
      html: this.isEditMode() ? 'Actualizando usuario' : 'Creando nuevo usuario',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    if (this.isEditMode()) {
      const { first_name, last_name, email, username, image } = this.userForm.value;
      const updatedData = { first_name, last_name, email, username, image };

      this.userService.updateUser(this._id!, updatedData as Partial<IUser>).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Usuario actualizado correctamente',
            confirmButtonColor: '#198754',
          }).then(() => {
            this.router.navigate(['/home']);
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al Actualizar',
            text: err.error?.message || 'Ocurrió un error al actualizar el usuario',
            confirmButtonColor: '#dc3545',
          });
        },
      });
    } else {
      const { first_name, last_name, email, username, password } = this.userForm.value;
      const newUserData = { first_name, last_name, email, username, password };

      this.userService.createUser(newUserData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Usuario creado correctamente',
            confirmButtonColor: '#198754',
          }).then(() => {
            this.router.navigate(['/home']);
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al Crear',
            text: err.error?.message || 'Ocurrió un error al crear el usuario',
            confirmButtonColor: '#dc3545',
          });
        },
      });
    }
  }
}
