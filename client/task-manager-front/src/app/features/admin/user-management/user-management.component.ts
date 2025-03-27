import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  newUser = {
    email: '',
    nombre: '',
    password: '',
    rol: 'USER'
  };
  isLoading = false;
  message = '';
  error = '';

  constructor(private userService: UserService) {}

  createUser() {
    this.isLoading = true;
    this.error = '';
    this.message = '';

    this.userService.createUser(this.newUser).subscribe({
      next: (response: any) => {
        this.message = `Usuario ${response.email} creado exitosamente`;
        this.resetForm();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al crear usuario';
        console.error('Error creando usuario:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private resetForm() {
    this.newUser = {
      email: '',
      nombre: '',
      password: '',
      rol: 'USER'
    };
  }
}
