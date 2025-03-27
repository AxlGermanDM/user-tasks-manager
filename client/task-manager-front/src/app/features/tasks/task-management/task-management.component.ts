import { Component } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';
import { Task, TaskCreateRequest } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss'
})
export class TaskManagementComponent {

  newTask: TaskCreateRequest = {
    titulo: '',
    descripcion: '',
    estado: 'PENDIENTE',
    usuarioAsignadoId: null
  };
  
  users: any[] = [];
  isLoading = false;
  message = '';
  error = '';

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.taskService.createTask(this.newTask).subscribe({
      next: (response: Task) => {
        this.message = `Tarea "${response.titulo}" creada exitosamente`;
        this.resetForm();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al crear tarea';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  resetForm() {
    this.newTask = {
      titulo: '',
      descripcion: '',
      estado: 'PENDIENTE',
      usuarioAsignadoId: null
    };
  }

}
