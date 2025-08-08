import { Component } from '@angular/core';
import { MaterialModule } from "../../../calyndra-shared/material.module";
import { ToolbarUser } from "./toolbar-user/toolbar-user";

@Component({
  selector: 'app-toolbar',
  imports: [MaterialModule, ToolbarUser],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})
export class Toolbar {

}
