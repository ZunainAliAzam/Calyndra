import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SidebarService } from '../../../core/services/sidebar.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css'
})
export class Sidenav {
  private sidebarService = inject(SidebarService);
  
  constructor(private router: Router) {}
  // Expose signals for template binding
  sidebarMode = this.sidebarService.sidebarMode;
  isOpen = this.sidebarService.isOpen;
  isCollapsed = this.sidebarService.isCollapsed;
  
  toggleSidebar(): void {
    this.sidebarService.toggle();
  }
  
  onNavigationClick(link: string): void {
    this.router.navigate(['/org', link]);
  }
}
