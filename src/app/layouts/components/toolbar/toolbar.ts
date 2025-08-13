import { Component, inject } from '@angular/core';
import { MaterialModule } from "../../../calyndra-shared/material.module";
import { ToolbarUser } from "./toolbar-user/toolbar-user";
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-toolbar',
  imports: [MaterialModule, ToolbarUser],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})
export class Toolbar {
  private sidebarService = inject(SidebarService);
  
  isOpen = this.sidebarService.isOpen;
  
  toggleSidebar(): void {
    this.sidebarService.toggle();
  }
}
