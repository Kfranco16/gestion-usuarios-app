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
import { IUser } from '../../interfaces/iuser.interface'; // (o User si la llamaste así)

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
            console.error('Error al cargar el usuario para edición:', err);
            this.router.navigate(['/home']);
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
      return;
    }

    if (this.isEditMode()) {
      const { first_name, last_name, email, username, image } = this.userForm.value;
      const updatedData = { first_name, last_name, email, username, image };

      this.userService.updateUser(this._id!, updatedData as Partial<IUser>).subscribe({
        next: () => {
          alert('Usuario actualizado con éxito');
          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Error al actualizar el usuario:', err),
      });
    } else {
      // CORRECCIÓN: Se omite 'image' del payload de creación para que coincida con la API.
      const { first_name, last_name, email, username, password } = this.userForm.value;
      const newUserData = { first_name, last_name, email, username, password };

      // También, asegúrate de que tu servicio en el método createUser espera Omit<IUser, '_id'>
      this.userService.createUser(newUserData).subscribe({
        next: () => {
          alert('Usuario creado con éxito');
          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Error al crear el usuario:', err),
      });
    }
  }
}
