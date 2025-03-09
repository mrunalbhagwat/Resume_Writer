import { AfterViewInit, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  @Input() phoneVideoPath: any;
  @Input() webVideoPath: any;
  showMenu: any = false;
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {

    if (isPlatformBrowser(this.platformId)) {  
      // ✅ Ensures it's running in the browser

      setTimeout(() => {
        const webVideo = document.getElementById('webVideoPath') as HTMLVideoElement | null;
        const phoneVideo = document.getElementById('phoneVideoPath') as HTMLVideoElement | null;
  
        if (webVideo) {
          webVideo.addEventListener('canplaythrough', () => {
            webVideo.muted = true;
            webVideo.play().catch(error => {
              // Autoplay was prevented.
              console.log('Trying Again', error);
              webVideo.muted = true;
              webVideo.play();
            });
          });
        }
        
        if (phoneVideo) {
          phoneVideo.addEventListener('canplaythrough', () => {
            phoneVideo.muted = true;
            phoneVideo.play().catch(error => {
              // Autoplay was prevented.
              console.log('Trying Again', error);
              phoneVideo.muted = true;
              phoneVideo.play();
            });
          });
        }
      }, 2000);
     
    }
  }
  
}
