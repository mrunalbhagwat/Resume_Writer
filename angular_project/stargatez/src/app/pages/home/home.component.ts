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
      name: 'Contract Placement',
      imagePath: '/assets/icons/contract_placement.png',
      fullText: "We provide skilled contract professionals.",
      displayedText: "",
      typingTimeout: null
    },
    {
      name: 'Contract Hire',
      imagePath: '/assets/icons/contract_hire.png',
      fullText: "Hire talent on a contract-to-hire basis.",
      displayedText: "",
      typingTimeout: null
    },
    {
      name: 'Permanent Placements',
      imagePath: '/assets/icons/permanent_placements.png',
      fullText: "Find the best full-time employees.",
      displayedText: "",
      typingTimeout: null
    },
    {
      name: 'Managed Project Services',
      imagePath: '/assets/icons/managed_project.png',
      fullText: "Let us handle your projects end-to-end.",
      displayedText: "",
      typingTimeout: null
    },
    {
      name: 'Global Recruitment',
      imagePath: '/assets/icons/global_icon.png',
      fullText: "Recruit talent from around the world.",
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
