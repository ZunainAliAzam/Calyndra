import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from "../components/sidenav/sidenav";
import { Toolbar } from "../components/toolbar/toolbar";

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [MatSidenavModule, Sidenav, RouterOutlet, Toolbar],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
