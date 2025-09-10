import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../calyndra-shared/services/auth/auth.service';
import { RoutingService } from '../../calyndra-shared/services/routing/routing.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private authService = inject(AuthService);
  private router = inject(RoutingService);
  isLoginMode = true;

  // Reactive forms
  loginForm!: FormGroup;
  signupForm!: FormGroup;

  // Password visibility toggles
  showLoginPassword: boolean = false;
  showSignupPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Get reactive values from auth service
  isLoading: boolean = true;
  isAuthenticated = this.authService.isAuthenticated;

  ngOnInit() {
    this.isLoading = false;
    this.initializeForms();
  }

  private initializeForms(): void {
    // Login form
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    // Signup form
    this.signupForm = new FormGroup(
      {
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordMatchValidator.bind(this) }
    );
  }

  // Custom validator for password confirmation
  private passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (control instanceof FormGroup) {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      if (
        password &&
        confirmPassword &&
        password.value !== confirmPassword.value
      ) {
        return { passwordMismatch: true };
      }
    }
    return null;
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    // Reset forms when switching modes
    this.loginForm.reset();
    this.signupForm.reset();
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
    this.isLoading = true;
    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleSignup();
    }
  }

  private handleLogin(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      console.log('Login submitted:', loginData);

      this.authService.login(loginData);
    } else {
      this.markFormGroupTouched(this.loginForm);
      console.error('Login form is invalid');
    }
  }

  private handleSignup(): void {
    if (this.signupForm.valid) {
      const signupData = this.signupForm.value;
      console.log('Signup submitted:', signupData);
      const { confirmPassword, ...finalData } = signupData;
      console.log('Final signup data:', finalData);

      this.authService.signup(finalData);
    } else {
      this.markFormGroupTouched(this.signupForm);
      console.error('Signup form is invalid');
    }
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getter methods for easy template access
  get loginFormControls() {
    return this.loginForm.controls;
  }

  get signupFormControls() {
    return this.signupForm.controls;
  }

  // Check if form field has error
  hasError(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.invalid && control.touched);
  }

  // Get error message for form field
  getErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (!control || !control.errors) return '';

    if (control.errors['required'])
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    if (control.errors['email']) return 'Please enter a valid email address';

    return '';
  }
}
