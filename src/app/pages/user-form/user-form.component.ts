import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  @Input() _id?: string;
  public isEditMode = computed(() => !!this._id);
  private userToUpdate = signal<IUser | null>(null);

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

  ngOnInit(): void {
    if (this.isEditMode()) {
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
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(4)]);
    }
    this.userForm.updateValueAndValidity();
  }

  onSubmit(): void {
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
