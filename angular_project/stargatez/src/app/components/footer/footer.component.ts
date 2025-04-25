import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  showMenu: any = true;

  constructor(private router: Router) { }

  scrollToTop(path: string) {
    if (this.router.url === path) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // Smooth scrolling
      });
    }
  }
}
