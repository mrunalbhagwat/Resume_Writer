import { AfterViewInit, Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  @Input() phoneVideoPath: any;
  @Input() webVideoPath: any;
  @Input() videoHeight: any = 'full';
  showMenu: any = false;
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}
  @ViewChild('phoneVideo', { static: false }) phoneVideoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('webVideo', { static: false }) webVideoElement!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {  
      const phoneVideo = this.phoneVideoElement.nativeElement;
      const webVideo = this.webVideoElement.nativeElement;
      phoneVideo.muted = true;
      webVideo.muted = true;

      // Listen for mousemove event
      window.addEventListener('mousemove', () => this.explicitPlayVideo(phoneVideo));
      window.addEventListener('mousemove', () => this.explicitPlayVideo(webVideo));

    }

    this.playVideo();
  }

  explicitPlayVideo(video: HTMLVideoElement) {
    if (video.paused) {
      video.play().catch(err => console.log('Autoplay prevented:', err));
    }
  }

  playVideo() {

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
