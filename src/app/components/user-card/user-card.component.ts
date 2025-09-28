import { Component, InputSignal, input } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-user-card',
  imports: [RouterLink],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {
  // Usamos la nueva función 'input.required' para crear una entrada de Signal.
  // Esto le dice a Angular: "Este componente DEBE recibir una propiedad 'user'".
  // Si el padre no se la pasa, Angular dará un error, lo cual es bueno para prevenir bugs.
  public user: InputSignal<IUser> = input.required<IUser>();
}
