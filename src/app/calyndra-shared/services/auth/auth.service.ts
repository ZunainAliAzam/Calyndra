import { Injectable, signal, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http/http.service';

export interface User {
  id: string;
  username: string;
  email: string;
  token: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private httpService = inject(HttpService);

  // Signals for reactive state management
  private _user = signal<User | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);

  // Public readonly signals
  public user = this._user.asReadonly();
  public isAuthenticated = this._isAuthenticated.asReadonly();
  public isLoading = this._isLoading.asReadonly();

  constructor() {
    // Check for existing session on service initialization
    this.checkExistingSession();

    // Watch for HTTP responses to handle login/signup
    effect(() => {
      const data = this.httpService.data();
      if (data) {
        this.handleAuthResponse(data);
      }
    });
  }

  // Check if user has an existing valid session
  private checkExistingSession(): void {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this._user.set(user);
        this._isAuthenticated.set(true);
      } catch (error) {
        this.clearSession();
      }
    } else {
      console.warn('AuthService: No existing session found');
    }
  }

  // Handle authentication response from HTTP service
  private handleAuthResponse(data: any): void {
    if (data && data.user && data.token) {
      // Store user data and token
      this._user.set(data.user);
      this._isAuthenticated.set(true);

      // Persist to localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      // Navigate to dashboard after a short delay to ensure state is updated
      setTimeout(() => {
        this.router.navigate(['/org/home']);
      }, 100);
    } else {
      this._isLoading.set(false);
    }
  }

  // Login user
  login(params: any): void {
    this._isLoading.set(true);
    this.httpService.HttpPost('/auth/login', params, {
      success: 'Login successful',
      fail: 'Login failed',
      isNotShow: false,
    });
  }

  // Signup user
  signup(params: any): void {
    this._isLoading.set(true);
    this.httpService.HttpPost('/auth/signup', params, {
      success: 'Signup successful',
      fail: 'Signup failed',
      isNotShow: false,
    });
  }

  // Logout user
  logout(): void {
    this.clearSession();
    this._isAuthenticated.set(false);
    this.router.navigate(['/home']);
  }

  // Clear all session data
  private clearSession(): void {
    this._user.set(null);
    this._isAuthenticated.set(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Get current auth token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
