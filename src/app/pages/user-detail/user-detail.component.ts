// src/app/components/user-detail/user-detail.component.ts
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser.interface';
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
}
