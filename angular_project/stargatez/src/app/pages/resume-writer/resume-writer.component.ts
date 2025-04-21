import { Component, OnInit } from '@angular/core';
declare var AOS: any;

@Component({
  selector: 'app-resume-writer',
  templateUrl: './resume-writer.component.html',
  styleUrl: './resume-writer.component.scss'
})
export class ResumeWriterComponent implements OnInit {
  videoLink: any = 'assets/videos/resume_writer.mp4';

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

}
