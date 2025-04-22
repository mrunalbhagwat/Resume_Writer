import { Component, OnInit } from '@angular/core';
declare var AOS: any;

@Component({
  selector: 'app-strategic-staffing',
  templateUrl: './strategic-staffing.component.html',
  styleUrl: './strategic-staffing.component.scss'
})
export class StrategicStaffingComponent implements OnInit{
  // videoLink: any = 'assets/videos/handshake.mp4';
  videoLink: any = 'assets/videos/corporate_meetings.mp4';
  // videoLink: any = 'assets/videos/strategic_banner.mp4';

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
  

  cards: any = [
    {
      name: 'IT Staff Augmentation/Contract Placement',
      imagePath: '/assets/icons/contract_placement.png',
      desc: 'IT Professionals and consultants staffed on temporary contract assignments and billed on a time & material basis.'
    }, {
      name: 'Contract to Hire',
      imagePath: '/assets/icons/contract_hire.png',
      desc: 'Low-risk opportunity to evalute on-the-job skills on a contract basis before making a permanent hiring decision.'
    }, {
      name: 'Permanent Placements',
      imagePath: '/assets/icons/permanent_placements.png',
      desc: 'Candidate sourcing and screening for direct hire.'
    }, {
      name: 'Managed Project Services',
      imagePath: '/assets/icons/managed_project.png',
      desc: 'Project teams to manage specific phases of project lifecycle or entire IT initiative.'
    }, {
      name: 'Global Recruitment',
      imagePath: '/assets/icons/global_icon.png',
      desc: 'Deployment global teams across worldwide locations (CAREER FLUTE or client locations).'
    }
  ]
}
