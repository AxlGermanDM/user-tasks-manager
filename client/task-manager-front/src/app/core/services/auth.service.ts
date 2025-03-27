import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/auth/login';
  public currentUser: any = null;

  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    
    this.currentUserSubject = new BehaviorSubject<any>(parsedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string) {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(user => {
        this.currentUser = { ...user, password };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getRole() {
    return this.currentUser?.rol;
  }
  
  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  getPassword(): string | null {
    return this.currentUser?.password || null;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
