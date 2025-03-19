import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  
  videoLink: any = 'assets/videos/hom_vid.mp4';

  cards: any = [
    {
      name: 'Contract Placement',
      imagePath: '/assets/icons/contract_placement.png'
    }, {
      name: 'Contract Hire',
      imagePath: '/assets/icons/contract_hire.png'
    }, {
      name: 'Permanent Placements',
      imagePath: '/assets/icons/permanent_placements.png'
    }, {
      name: 'Managed Project Services',
      imagePath: '/assets/icons/managed_project.png'
    }, {
      name: 'Global Recruitment',
      imagePath: '/assets/icons/global_icon.png'
    }
  ]
  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

}
