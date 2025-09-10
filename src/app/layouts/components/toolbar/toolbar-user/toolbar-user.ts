import { Component, inject } from '@angular/core';
import { MaterialModule } from "../../../../calyndra-shared/material.module";
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from '../../../../calyndra-shared/services/auth/auth.service';

@Component({
  selector: 'app-toolbar-user',
  imports: [MaterialModule, MatMenuModule],
  templateUrl: './toolbar-user.html',
  styleUrl: './toolbar-user.css'
})
export class ToolbarUser {
  private router = inject(Router);
  private authService = inject(AuthService);

  // Get reactive values from auth service
  user = this.authService.user;
  isAuthenticated = this.authService.isAuthenticated;
  
  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
  
  logout() {
    this.authService.logout();
  }
}
