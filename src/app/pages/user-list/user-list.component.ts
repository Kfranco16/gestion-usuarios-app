import { Component, inject, signal, WritableSignal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { Iresponse } from '../../interfaces/iresponse.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  imports: [UserCardComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  private userService = inject(UserService);
  public currentPage: WritableSignal<number> = signal(1);

  // El NÚCLEO REACTIVO CORREGIDO
  public usersResponse = toSignal(
    // 2. CONVERTIMOS EL SIGNAL EN UN OBSERVABLE
    toObservable(this.currentPage).pipe(
      switchMap((page: number) => this.userService.getUsers(page)) // 3. AÑADIMOS EL TIPO A 'page'
    ),
    {
      initialValue: {
        page: 0,
        per_page: 0,
        total: 0,
        total_pages: 0,
        results: [],
      } as Iresponse,
    }
  );
  async handleUserDeletion(_id: string): Promise<void> {
    const userToDelete = this.usersResponse().results.find((u) => u._id === _id);
    const userName = userToDelete ? userToDelete.first_name : 'este usuario';

    const result = await Swal.fire({
      title: `¿Estás seguro de que quieres eliminar a ${userName}?`,
      text: 'La API simulará la eliminación.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      this.userService.deleteUser(_id).subscribe({
        next: (response) => {
          console.log('Usuario eliminado :', response);
          Swal.fire('¡Eliminado!', `El usuario ${userName} ha sido eliminado.`, 'success');
          // NO actualizamos la UI. La lista se quedará como está.
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          Swal.fire('Error', 'No se pudo simular la eliminación del usuario.', 'error');
        },
      });
    }
  }
  // --- Métodos para cambiar de página (sin cambios) ---
  nextPage(): void {
    this.currentPage.update((page) => page + 1);
  }

  prevPage(): void {
    this.currentPage.update((page) => page - 1);
  }
}
