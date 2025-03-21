import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-career-flute',
  templateUrl: './career-flute.component.html',
  styleUrl: './career-flute.component.scss'
})
export class CareerFluteComponent {
  videoLink: any = 'assets/videos/career_flute.mp4';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;


  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // File Upload Logic (Appended)
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileName: string = '';
  isDragging: boolean = false;

  // Handle file selection from input
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
      input.value = ''; // Reset input so the same file can be reselected
    }
  }

  // Drag events
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.fileName = file.name;

      // Manually trigger file input change event to ensure consistency
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      this.fileInput.nativeElement.files = dataTransfer.files;
    }
  }
}
