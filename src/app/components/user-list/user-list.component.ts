import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserCardComponent } from '../user-card/user-card.component';
@Component({
  selector: 'app-user-list',
  imports: [UserCardComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  // 1. Inyectamos nuestro servicio
  private userService = inject(UserService);

  // 2. Convertimos el Observable de usuarios en un Signal de solo lectura
  public users = toSignal(this.userService.getUsers(), { initialValue: [] as IUser[] });
}
