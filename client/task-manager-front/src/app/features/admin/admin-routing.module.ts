import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  { 
    path: '', 
    children: [
      { path: 'users', component: UserManagementComponent },
      { path: 'user-list', component: UserListComponent }, 
      { path: '', redirectTo: 'users', pathMatch: 'full' } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
