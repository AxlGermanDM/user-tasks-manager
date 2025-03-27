import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map, Observable, shareReplay } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = '/api/usuarios';
  private usersCache$?: Observable<Map<number, string>>;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const credentials = btoa(`${this.auth.getCurrentUser()?.email}:${this.auth.getCurrentUser()?.password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
  }

  createUser(userData: any) {   
    return this.http.post(this.apiUrl, userData, {     
      headers: this.getAuthHeaders()
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  getUsersMap(): Observable<Map<number, string>> {
    if (!this.usersCache$) {
      this.usersCache$ = this.http.get<any[]>(this.apiUrl, {
        headers: this.getAuthHeaders()
      }).pipe(
        map(users => {
          const map = new Map<number, string>();
          users.forEach(user => map.set(user.id, user.nombre));
          return map;
        }),
        shareReplay(1)
      );
    }
    return this.usersCache$;
  }
}
