import { Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: UserListComponent },
  { path: 'user/:_id', component: UserDetailComponent },
  { path: 'newuser', component: UserFormComponent },
  { path: 'updateuser/:_id', component: UserFormComponent },
  { path: '**', redirectTo: 'home' },
];
