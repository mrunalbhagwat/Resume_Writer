import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-career-flute',
  templateUrl: './career-flute.component.html',
  styleUrl: './career-flute.component.scss',
})
export class CareerFluteComponent implements OnInit {
  videoLink: any = 'assets/videos/career_flute.mp4';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  cvForm: FormGroup | any;
  parsedData: any = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  webDevSkills = ["HTML", "CSS", "JavaScript", "React", "Angular", "Vue.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "MySQL", "GraphQL", "REST API", "Webpack", "TypeScript"];

  constructor(private fb: FormBuilder, public apiService: ApiService) { }

  onSubmit() {
    if (this.cvForm?.valid) {
      console.log(this.cvForm.value);
    }
  }

  ngOnInit() {
    this.cvForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      expectedSalary: ['', Validators.required],
      expectedSalaryCurrency: ['₹(INR)', Validators.required],
      expectedSalaryFrequency: ['Yearly', Validators.required],
      skills: ['', Validators.required],
      industry: ['', Validators.required],
      preferredLocation: ['', Validators.required],
      noticePeriod: ['', Validators.required],
      highestQualification: ['', Validators.required],
      university: ['', Validators.required],
      totalExpYear: ['', Validators.required],
      totalExpMonths: ['', Validators.required],
      currentSalary: ['', Validators.required],
      currentSalaryCurrency: ['₹(INR)', Validators.required],
      currentSalaryFrequency: ['Yearly', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      resume: ['', Validators.required],
      currentLocation: ['', Validators.required],
      currentCompany: ['', Validators.required],
      designation: ['', Validators.required],
      qualification: ['', Validators.required],
      showPassword: [false], // Store visibility state in FormControl
      showConfirmPassword: [false], // Store visibility state in FormControl
    });
  }

  togglePassword() {
    const currentState = this.cvForm.get('showPassword')?.value;
    this.cvForm.get('showPassword')?.setValue(!currentState);
  }

  toggleConfirmPassword() {
    const currentState = this.cvForm.get('showConfirmPassword')?.value;
    this.cvForm.get('showConfirmPassword')?.setValue(!currentState);
  }

  // File Upload Logic (Fixed & Optimized)
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileName: string = '';
  fileSize: string = '';
  fileUrl: string | null = null;
  uploadProgress: number = 0;
  isDragging: boolean = false;
  fileUploaded: boolean = false;
  isDownloading: boolean = false;

  onFileSelected(event: any) {
    event.preventDefault(); // Prevent unintended form submissions
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
    const file = event.target.files[0];
    this.processFile(event.target.files[0]);

    if (!file) {
      alert('Please upload a resume first!');
      return;
    }

    this.isLoading = true;

    const reader = new FileReader();

    reader.onload = async (e: any) => {
      try {
        const fileContent = e.target.result;
        const base64Content = fileContent.split(',')[1];
        this.parseResume(base64Content, file);
        // const parsedResume = this.parseResume(base64Content, file);
        // this.parsedData = parsedResume;
        // this.errorMessage = '';
      } catch (error: any) {
        this.errorMessage = `Error parsing resume: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    };

    reader.readAsDataURL(file);
  }

  onSkillsUpdate(e: any) {
    this.cvForm.get('skills')?.setValue([...e.target.value.split(','), this.cvForm.get('skills').value]);
    debugger;
  }

  parseResume(base64Content: string, file: File) {
    // const prompt = `Parse the following resume and return only a JSON object with these exact keys:
    // ['fullName', 'currentLocation', 'phoneNumber', 'email', 'currentCompany', 'designation',
    // 'noticePeriod', 'qualification', 'university', 'totalExpYear', 'totalExpMonths',
    //   'currentSalary', 'expectedSalary', 'skills', 'industry', 'preferredLocation'].
    // Do not include any explanations or additional text beyond the JSON object. Do not add country code in phoneNumber`;
    this.apiService.showSpinner$.next(true);
    const prompt = `
    Parse the following resume and return a well-structured JSON object with the exact keys:  
    ['fullName', 'currentLocation', 'phoneNumber', 'countryCode', 'email', 'currentCompany', 'designation',  
    'noticePeriod', 'qualification', 'university', 'totalExpYear', 'totalExpMonths',  
    'currentSalary', 'expectedSalary', 'skills', 'industry', 'preferredLocation'].  

    **Guidelines:**  
    - Extract accurate information for each key.  
    - Return only the JSON object with no additional text or explanations.  
    - Ensure "phoneNumber" does not include a country code.  
    - Provide "country code" in "countryCode".  
    - Maintain consistency in data formatting.`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: this.getMimeType(file.type),
                data: base64Content,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        top_p: 0.8,
        top_k: 40,
        max_output_tokens: 2048,
      },
    };

    this.apiService.parseResume(requestBody).subscribe((response: any) => {
      const parsedData = JSON.parse(
        response?.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
      );
      console.log(parsedData);
      this.apiService.showSpinner$.next(false);
      this.cvForm.patchValue(parsedData);
      this.errorMessage = '';
    });

    // try {
    //   const response = await this.http.post<any>(this.GEMINI_API_URL, requestBody).toPromise();
    //   return JSON.parse(response?.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
    // } catch (error) {
    //   throw new Error('API request failed');
    // }
  }

  getMimeType(fileType: string): string {
    switch (fileType) {
      case 'application/pdf':
        return 'application/pdf';
      case 'application/msword':
        return 'application/msword';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return fileType;
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
      this.processFile(file);
    }
  }

  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.processFile(input.files[0]);
  //     input.value = ''; // Reset input to allow re-selection of the same file
  //   }
  // }

  processFile(file: File) {
    this.fileName = file.name;
    this.fileSize = (file.size / 1024).toFixed(2) + ' KB';
    this.fileUrl = URL.createObjectURL(file);
    this.uploadFile();
  }

  uploadFile() {
    this.uploadProgress = 0;
    this.fileUploaded = false;

    const interval = setInterval(() => {
      this.uploadProgress += 20;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        this.fileUploaded = true;
      }
    }, 500);
  }

  downloadFile(event: MouseEvent) {
  event.stopPropagation(); // Stops parent elements from triggering unwanted downloads
  if (this.fileUrl && !this.isDownloading) {
    this.isDownloading = true;
    const link = document.createElement('a');
    link.href = this.fileUrl;
    link.download = this.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => (this.isDownloading = false), 500); // Prevent multiple downloads
  }
}
}
