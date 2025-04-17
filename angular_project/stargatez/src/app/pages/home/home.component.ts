import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  typingSpeed: number = 50; // Speed in milliseconds
  typingTimeout: any; // Store timeout reference

  constructor(private route: ActivatedRoute) { }

  videoLink: any = 'assets/videos/hom_vid.mp4';

  cards: any = [
    {
      name: 'IT Staff Augmentation/Contract Placement',
      imagePath: '/assets/icons/contract_placement.png',
      fullText: "IT Professionals and consultants staffed on temporary contract assignments and billed on a time & material basis.",
      displayedText: "",
      typingTimeout: null
    },
    {
      name: 'Contract to Hire',
      imagePath: '/assets/icons/contract_hire.png',
      fullText: "Low-risk opportunity to evalute on-the-job skills on a contract basis before making a permanent hiring decision.",
      displayedText: "",
      typingTimeout: null
    },
    {
      name: 'Permanent Placements',
      imagePath: '/assets/icons/permanent_placements.png',
      fullText: "Candidate sourcing and screening for direct hire.",
      displayedText: "",
      typingTimeout: null
    },
    {
      name: 'Managed Project Services',
      imagePath: '/assets/icons/managed_project.png',
      fullText: "Project teams to manage specific phases of project lifecycle or entire IT initiative.",
      displayedText: "",
      typingTimeout: null
    },
    {
      name: 'Global Recruitment',
      imagePath: '/assets/icons/global_icon.png',
      fullText: "Deployment global teams across worldwide locations (CAREER FLUTE or client locations).",
      displayedText: "",
      typingTimeout: null
    }
  ];

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  typeWriterEffect(card: any, index: number) {
    if (index < card.fullText.length) {
      card.typingTimeout = setTimeout(() => {
        card.displayedText += card.fullText.charAt(index);
        this.typeWriterEffect(card, index + 1);
      }, this.typingSpeed);
    }
  }

  restartTyping(card: any) {
    clearTimeout(card.typingTimeout); // Stop any ongoing typing
    card.displayedText = ""; // Reset text
    this.typeWriterEffect(card, 0); // Restart typing effect
  }
}
