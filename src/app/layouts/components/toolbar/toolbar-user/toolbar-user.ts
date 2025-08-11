import { Component } from '@angular/core';
import { MaterialModule } from "../../../../calyndra-shared/material.module";
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-user',
  imports: [MaterialModule, MatMenuModule],
  templateUrl: './toolbar-user.html',
  styleUrl: './toolbar-user.css'
})
export class ToolbarUser {
  constructor(private router: Router) {}  
  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
  logout() {}
}
