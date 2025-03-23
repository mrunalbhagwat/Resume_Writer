import { Component } from '@angular/core';

@Component({
  selector: 'app-strategic-staffing',
  templateUrl: './strategic-staffing.component.html',
  styleUrl: './strategic-staffing.component.scss'
})
export class StrategicStaffingComponent {
  // videoLink: any = 'assets/videos/handshake.mp4';
  videoLink: any = 'assets/videos/corporate_meetings.mp4';
  // videoLink: any = 'assets/videos/strategic_banner.mp4';


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
}
