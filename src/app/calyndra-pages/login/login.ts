import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isLoginMode = true;

  // Password visibility toggles
  showLoginPassword: boolean = false;
  showSignupPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router) {}
  // Login form data
  loginData = {
    username: '',
    password: '',
  };

  // Signup form data
  signupData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    // Scroll to top when switching modes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  togglePasswordVisibility(field: 'login' | 'signup' | 'confirm') {
    switch (field) {
      case 'login':
        this.showLoginPassword = !this.showLoginPassword;
        break;
      case 'signup':
        this.showSignupPassword = !this.showSignupPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  onSubmit() {
    if (this.isLoginMode) {
      console.log('Login submitted:', this.loginData);
      this.router.navigate(['/org/home']);
      // Handle login logic here
    } else {
      console.log('Signup submitted:', this.signupData);
      // Handle signup logic here
    }
  }
}
