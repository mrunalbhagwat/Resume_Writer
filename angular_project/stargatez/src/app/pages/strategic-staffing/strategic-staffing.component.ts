import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
declare var AOS: any;


@Component({
  selector: 'app-strategic-staffing',
  templateUrl: './strategic-staffing.component.html',
  styleUrls: ['./strategic-staffing.component.scss']
})
export class StrategicStaffingComponent implements OnInit {
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

  @ViewChildren('counterElement') counterElements!: QueryList<ElementRef>;
  

  hasAnimated = false;

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
      desc: 'Deploying global teams across worldwide locations (Stargatez or client locations).'
    }
  ];

  counters = [
    { current: 0, target: 2000000, display: '0', suffix: '+', label: 'Network of Talents', hasStarted: false },
    { current: 0, target: 100, display: '0', suffix: '+', label: 'Experienced Recruiters', hasStarted: false },
    { current: 0, target: 50, display: '0', suffix: '+', label: 'Global Clients', hasStarted: false },
    { current: 0, target: 40, display: '0', suffix: '%', label: 'Savings on Hiring Costs', hasStarted: false }
  ];



  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.setupIntersectionObserver();
    }
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.startCounting();
        }
      });
    }, options);

    this.counterElements.forEach(element => {
      observer.observe(element.nativeElement);
    });
  }

  startCounting() {
    this.counters.forEach((counter, index) => {
      if (counter.hasStarted) return;
      counter.hasStarted = true;

      const duration = 2500;
      const steps = 100;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easedProgress = this.easeOutCubic(progress);
        
        counter.current = Math.floor(counter.target * easedProgress);

        if (counter.target >= 1000000) {
          counter.display = (counter.current / 1000000).toFixed(1) + 'M';
        } else {
          counter.display = counter.current.toString();
        }

        if (currentStep >= steps) {
          clearInterval(interval);
          counter.current = counter.target;
          if (counter.target >= 1000000) {
            counter.display = (counter.target / 1000000).toFixed(1) + 'M';
          } else {
            counter.display = counter.target.toString();
          }
        }
      }, stepDuration);
    });
  }

  // Cubic easing for smoother animation
  easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }
}
