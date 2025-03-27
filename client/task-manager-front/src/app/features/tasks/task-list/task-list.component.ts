import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit{
  tasks: Task[] = [];
  userNames = new Map<number, string>();
  isLoading = true;
  error = '';
  isAdmin = false;
 
  errorState = {
    message: '',
    taskId: null as number | null,
    show: false
  };

  statusOptions: TaskStatus[] = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'];

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user.role === 'ADMIN';
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();
    
    if (this.authService.isAdmin()) {
      this.taskService.getTasksWithUsers().subscribe({
        next: ({tasks, users}) => {
          this.tasks = tasks;
          this.userNames = users;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading data:', err);
          this.isLoading = false;
        }
      });
    } else {
      const user = this.authService.getCurrentUser();
      this.taskService.getUserTasks(user.id).subscribe({
        next: (tasks) => {
          this.tasks = tasks; 
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar tareas:', err);
          this.tasks = []; 
        }
      });
    }

  }

  onStatusChange(task: Task, newStatus: string): void {
    const previousStatus = task.estado;
    this.resetError();
    if (previousStatus === 'PENDIENTE' && newStatus === 'COMPLETADA') {
        this.showError('Primero cambie a EN_PROGRESO antes de COMPLETADA', task.id);
        setTimeout(() => task.estado = previousStatus, 0);
        return;
    }
    this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
      next: (updatedTask: Task) => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.resetError(); 
      },
      error: (err: Error) => {
        this.showError('Primero cambie a EN_PROGRESO antes de COMPLETADA', task.id);
        setTimeout(() => task.estado = previousStatus, 0); 
      }
    });
  }

  private showError(message: string, taskId: number) {
    this.errorState = {
      message,
      taskId,
      show: true
    };
    setTimeout(() => this.resetError(), 3000);
  }

  resetError() {
    this.errorState = {
      message: '',
      taskId: null,
      show: false
    };
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'PENDIENTE': return '#ff9800';
      case 'EN_PROGRESO': return '#2196f3';
      case 'COMPLETADA': return '#4caf50'; 
      default: return '#9e9e9e'; 
    }
  }

  getAssignedUserName(id: number): string {
    return this.userNames.get(id) || 'Desconocido';
  }

}
