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
  public user: InputSignal<IUser> = input.required<IUser>();

  @Output() onDelete = new EventEmitter<string>();

  onDeleteClick(): void {
    this.onDelete.emit(this.user()._id);
  }
}
