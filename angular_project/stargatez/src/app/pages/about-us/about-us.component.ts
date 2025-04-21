import { Component, OnInit } from '@angular/core';
declare var AOS: any;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {
  videoLink: any = 'assets/videos/dubai_city.mp4';

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
