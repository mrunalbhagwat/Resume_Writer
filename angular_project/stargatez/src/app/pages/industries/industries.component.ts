import { Component, OnInit } from '@angular/core';
declare var AOS: any;

@Component({
  selector: 'app-industries',
  templateUrl: './industries.component.html',
  styleUrl: './industries.component.scss'
})
export class IndustriesComponent implements OnInit{
  videoLink: any = 'assets/videos/startups.mp4';

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
