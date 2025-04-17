import { Component, OnInit} from '@angular/core';
import { ScrollService } from './services/scroll.service';

declare var AOS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'stargatez';

  constructor(public ScrollService: ScrollService) {}

  ngOnInit(): void {
    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 1000,
          once: true
        });
      }
    }, 0);
  }
}
