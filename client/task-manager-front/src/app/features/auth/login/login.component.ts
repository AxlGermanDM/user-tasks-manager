import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (user) => {
        this.loading = false;
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Credenciales incorrectas';
        console.error('Error de autenticación:', err);
      }
    });
  }
}
