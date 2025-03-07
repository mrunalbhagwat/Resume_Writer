import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() phoneVideoPath: any;
  @Input() webVideoPath: any;
  showMenu: any = false;
}
