import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from "../components/sidenav/sidenav";
import { Toolbar } from "../components/toolbar/toolbar";
import { SidebarService } from '../../core/services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, MatSidenavModule, Sidenav, RouterOutlet, Toolbar],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  public sidebarService = inject(SidebarService);
  
  // Expose signals for template binding
  isOpen = this.sidebarService.isOpen;
  sidebarMode = this.sidebarService.sidebarMode;
  sidebarWidth = this.sidebarService.sidebarWidth;
  isCollapsed = this.sidebarService.isCollapsed;
  
  onSidebarMouseEnter(): void {
    this.sidebarService.setHovered(true);
  }
  
  onSidebarMouseLeave(): void {
    this.sidebarService.setHovered(false);
  }
  
  onMainContentClick(): void {
    // Close sidebar on mobile when clicking main content
    if (window.innerWidth < 768 && this.isOpen()) {
      this.sidebarService.close();
    }
  }
}
