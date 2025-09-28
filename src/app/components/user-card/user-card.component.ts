import { Component, InputSignal, input, Output, EventEmitter } from '@angular/core';
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

  @Output() onDelete = new EventEmitter<string>();

  onDeleteClick(): void {
    // Emite el evento con el _id del usuario de esta tarjeta
    this.onDelete.emit(this.user()._id);
  }
}
