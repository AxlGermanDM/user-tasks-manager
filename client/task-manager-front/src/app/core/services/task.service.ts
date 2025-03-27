import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Task, TaskCreateRequest } from '../models/task.model';
import { forkJoin, Observable, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = '/api/tareas';
  private usersCache: Map<number, string> = new Map();

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private user: UserService
  ) {}

  createTask(taskData: TaskCreateRequest) {
    return this.http.post<Task>(this.apiUrl, taskData, {
      headers: this.getAuthHeaders()
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(tasks => {
        tasks.forEach(task => {
          if (!this.usersCache.has(task.id)) {
            this.usersCache.set(task.id, `Usuario ${task.id}`);
          }
        });
      })
    );
  }


  updateTaskStatus(id: number, nuevoEstado: string): Observable<Task> {
    const url = `${this.apiUrl}/${id}/estado`;
    const body = { nuevoEstado };     
    return this.http.patch<Task>(url, body, {
      headers: this.getAuthHeaders()
    });
  }

  getTasksWithUsers(): Observable<{tasks: Task[], users: Map<number, string>}> {
    return forkJoin({
      tasks: this.getTasks(),
      users: this.user.getUsersMap()
    });
  }

  getUserTasks(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders() {
    const credentials = btoa(`${this.auth.getCurrentUser()?.email}:${this.auth.getCurrentUser()?.password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
  }
}
