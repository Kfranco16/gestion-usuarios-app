import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);

  public user = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('_id')),

      filter((id): id is string => !!id),

      switchMap((id) => this.userService.getUserById(id))
    )
  );
  async deleteUser(): Promise<void> {
    const user = this.user();
    if (!user) return;

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

    if (result.isConfirmed) {
      this.userService.deleteUser(user._id).subscribe({
        next: () => {
          Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');

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
