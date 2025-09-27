import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirige la ruta vacía a /home
  { path: 'home', component: UserListComponent, title: 'Lista de Usuarios' },
];
