import { Component } from '@angular/core';

@Component({
  selector: 'app-career-flute',
  templateUrl: './career-flute.component.html',
  styleUrl: './career-flute.component.scss'
})
export class CareerFluteComponent {
  videoLink: any = 'assets/videos/dubai_city.mp4';
  password: string = '';
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
