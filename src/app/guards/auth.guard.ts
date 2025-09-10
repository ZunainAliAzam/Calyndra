import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../calyndra-shared/services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated using the signal
  if (authService.isAuthenticated()) {
    return true;
  }

  // If not authenticated, redirect to login
  router.navigate(['/login']);
  return false;
};

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user is already authenticated, redirect to dashboard
  if (authService.isAuthenticated()) {
    router.navigate(['/org/home']);
    return false;
  }

  return true;
};
