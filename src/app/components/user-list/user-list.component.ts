// src/app/components/user-list/user-list.component.ts
import { Component, inject, signal, WritableSignal } from '@angular/core';
// 1. IMPORTA toObservable
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { UserCardComponent } from '../user-card/user-card.component';
// Asegúrate de que esta importación exista
import { Iresponse } from '../../interfaces/iresponse.interface';

@Component({
  selector: 'app-user-list',
  standalone: true,
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

  // --- Métodos para cambiar de página (sin cambios) ---
  nextPage(): void {
    this.currentPage.update((page) => page + 1);
  }

  prevPage(): void {
    this.currentPage.update((page) => page - 1);
  }
}
