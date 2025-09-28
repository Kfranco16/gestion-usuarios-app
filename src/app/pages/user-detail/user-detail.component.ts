// src/app/components/user-detail/user-detail.component.ts
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [RouterLink], // <-- 1. Importamos RouterLink para el botón de "Volver"
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent {
  // 2. Inyectamos las dependencias que necesitamos
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);

  // 3. El NÚCLEO REACTIVO: creamos un signal a partir de los parámetros de la ruta
  public user = toSignal(
    this.route.paramMap.pipe(
      // a. Obtenemos el parámetro 'id' de la URL
      map((params) => params.get('_id')),
      // b. Nos aseguramos de que el ID no sea nulo o undefined
      filter((id): id is string => !!id),
      // c. Usamos switchMap para llamar al servicio con el ID y obtener los datos del usuario
      switchMap((id) => this.userService.getUserById(id))
    )
  );
  async deleteUser(): Promise<void> {
    const user = this.user();
    if (!user) return; // Guarda de seguridad

    // Muestra la ventana de confirmación
    const result = await Swal.fire({
      title: `¿Estás seguro de que quieres eliminar a ${user.first_name}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar',
    });

    // Si el usuario confirma...
    if (result.isConfirmed) {
      this.userService.deleteUser(user._id).subscribe({
        next: () => {
          Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
          // Navegamos de vuelta a la lista
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error al eliminar el usuario:', err);
          Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
        },
      });
    }
  }
}
