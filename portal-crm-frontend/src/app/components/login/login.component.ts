import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: '',
    rememberMe: false
  };

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    // Simular delay de red
    setTimeout(() => {
      const success = this.authService.login(
        this.credentials.username, 
        this.credentials.password
      );

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
      
      this.isLoading = false;
    }, 1000);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}