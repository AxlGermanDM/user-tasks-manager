import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskManagementComponent } from './task-management/task-management.component';
import { TaskListComponent } from './task-list/task-list.component';

const routes: Routes = [
  { path: '', 
    children: [
      { path: 'tasks', component: TaskManagementComponent },
      { path: 'list', component: TaskListComponent },
      { path: '', redirectTo: 'tasks', pathMatch: 'full' }
    ]
     }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
