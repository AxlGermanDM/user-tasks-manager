import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskManagementComponent } from './task-management/task-management.component';
import { MaterialModule } from '../../shared/material.module';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { FormsModule } from '@angular/forms';
import { TaskListComponent } from './task-list/task-list.component';


@NgModule({
  declarations: [
    TaskManagementComponent,
    TaskListComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    MaterialModule,
    AuthRoutingModule,
    FormsModule
  ]
})
export class TasksModule { }
