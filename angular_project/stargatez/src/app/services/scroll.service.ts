import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if ( isPlatformBrowser(this.platformId) && typeof window !== 'undefined'
        ) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth', // Smooth scrolling
          });
        }
      }
    });
  }
}
