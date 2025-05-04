import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SnackBarService } from '../../services/snack-bar.service';
declare var AOS: any;

@Component({
  selector: 'app-job-seeker',
  templateUrl: './job-seeker.component.html',
  styleUrl: './job-seeker.component.scss'
})
export class JobSeekerComponent implements OnInit {
  // videoLink: any = 'assets/videos/corporate_meetings.mp4';
  // videoLink: any = 'assets/videos/strategic_vid_2.mp4';
  videoLink: any = 'assets/videos/strategic_banner.mp4';
  // password: string = '';
  //   confirmPassword: string = '';
  //   showPassword: boolean = false;
    cvForm: FormGroup | any;
    parsedData: any = null;
    errorMessage: string = '';
    isLoading: boolean = false;
    currencies: any = [];
    countryCallCodes: any = [];
    cities: any = [];
    showCityDropdown: any = {};
    filteredCitiesMap: any = {};
    // Popup state is now managed by SnackBarService
    webDevSkills = [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'Angular',
      'Vue.js',
      'Tailwind CSS',
      'Node.js',
      'Express.js',
      'MongoDB',
      'MySQL',
      'GraphQL',
      'REST API',
      'Webpack',
      'TypeScript',
    ];

    validateNumberInput(event: KeyboardEvent) {
      const allowedKeys = [
        'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'
      ];
      if (allowedKeys.includes(event.key)) {
        return; // Allow special keys
      }
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
      }
    }

    validatePasteInput(event: ClipboardEvent) {
      const pastedData = event.clipboardData?.getData('text') || '';
      if (!/^\d+$/.test(pastedData)) {
        event.preventDefault();
      }
    }


    constructor(
      private fb: FormBuilder,
      public apiService: ApiService,
      private snackBarService: SnackBarService
    ) {}




    onSubmit() {
      if (this.cvForm?.invalid) {
        this.cvForm.markAllAsTouched();
        this.snackBarService.showError('Please fill in all required fields.');
        return;
      }

      this.apiService.showSpinner$.next(true);

      // Get form values
      const formData = this.cvForm.value;

      // Add the resume file if it exists
      if (this.fileInput?.nativeElement?.files?.length > 0) {
        formData.resumeFile = this.fileInput.nativeElement.files[0];
      }

      this.apiService.submitCvData(formData).subscribe({
        next: (response: any) => {
          console.log('CV submitted successfully:', response);
          this.apiService.showSpinner$.next(false);

          // Show success popup using SnackBarService directly
          this.snackBarService.showSuccess('Your CV has been submitted successfully!');

          // Reset form after successful submission
          this.cvForm.reset();
          this.fileName = '';
          this.fileSize = '';
          this.fileUrl = null;
          this.fileUploaded = false;
        },
        error: (error: any) => {
          console.error('Error submitting CV:', error);
          this.apiService.showSpinner$.next(false);

          // Show error popup using SnackBarService directly
          let errorMsg = 'There was an error submitting your CV. Please try again.';
          if (error.status === 400) {
            errorMsg = error.error.error || 'Bad request. Please check your input.';
          } else if (error.status === 401) {
            errorMsg = 'Unauthorized. Please login again.';
          } else if (error.status === 413) {
            errorMsg = 'File size too large. Please upload a smaller file.';
          }
          this.snackBarService.showError(errorMsg);
        }
      });
    }

    ngOnInit() { // web hook
      setTimeout(() => {
        if (typeof AOS !== 'undefined') {
          AOS.init({
            duration: 1000,
            once: true
          });
        }
      }, 0);
      this.cvForm = this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        currentLocation: ['', Validators.required],
        homeTown: ['', Validators.required],
        qualification: ['', Validators.required],
        designation: ['', Validators.required],
        resumeContent: [''],
        skills: [[], Validators.required],
        totalExpYear: ['', Validators.required],
        relevantExpYear: ['', Validators.required],
        currentCompany: ['', Validators.required],
        currentSalary: ['', Validators.required],
        expectedSalary: ['', Validators.required],
        noticePeriod: ['', Validators.required],
        resume: [''],
        comments: [''],
        skillsInput: [''],
      });
      this.fetchCountries();
      this.getAllCities();
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
    @ViewChild('fileInputJobSeeker') fileInput!: ElementRef<HTMLInputElement>;

    fileName: string = '';
    fileSize: string = '';
    fileUrl: string | null = null;
    uploadProgress: number = 0;
    isDragging: boolean = false;
    fileUploaded: boolean = false;
    isDownloading: boolean = false;

    onFileSelected(event: any) {
      event.preventDefault();
      const input = event.target as HTMLInputElement;

      if (input.files && input.files.length > 0) {
        const file = input.files[0];
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
            this.processFile(file);
          } catch (error: any) {
            this.errorMessage = `Error parsing resume: ${error.message}`;
          } finally {
            this.isLoading = false;
          }
        };

        reader.readAsDataURL(file);
      }
    }

    fetchCountries() {
      this.apiService.fetchAllCountries().subscribe((response: any) => {
        const currencySet = new Set();
        response.forEach((country: any) => {
          if (country.currencies) {
            Object.keys(country.currencies).forEach(code => {
              if (!currencySet.has(code)) {
                currencySet.add(code);
                this.currencies.push({
                  code,
                  countryName: country.name.common,
                  name: country.currencies[code].name,
                  dialCode: country.idd?.root + (country.idd?.suffixes ? country.idd.suffixes[0] : '')
                });
              }
            });
          }
        });


        console.log(this.currencies);
      });
    }

    onSkillsUpdate(e: any) {
        // Get current skills or initialize as empty array if undefined
        const currentSkills = this.cvForm.get('skills').value || [];
        const newSkill = e.target.value;
        
        // Only add if the skill doesn't already exist and is not empty
        if (newSkill && !currentSkills.includes(newSkill)) {
          this.cvForm
            .get('skills')
            ?.setValue([
              newSkill,
              ...currentSkills,
            ]);
        }
        this.cvForm.get('skillsInput').setValue('');
        return true; // Return true to allow chaining with preventDefault
      }

    parseResume(base64Content: string, file: File) {
      // const prompt = `Parse the following resume and return only a JSON object with these exact keys:
      // ['fullName', 'currentLocation', 'phoneNumber', 'email', 'currentCompany', 'designation',
      // 'noticePeriod', 'qualification', 'university', 'totalExpYear', 'totalExpMonths',
      //   'currentSalary', 'expectedSalary', 'skills', 'industry', 'preferredLocation'].
      // Do not include any explanations or additional text beyond the JSON object. Do not add country code in phoneNumber`;
      this.apiService.showSpinner$.next(true);
      // This prompt is for documentation purposes only - the actual parsing is done on the server
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

      // this.apiService.parseResume(requestBody).subscribe((response: any) => {
      this.apiService.parseResumeAllFiles(file).subscribe({
        next: (response: any) => {
          if(response.countryCode && !response.countryCode.includes('+')) {
            response.countryCode = '+' + response.countryCode.trim();
          }

          const parsedData = Object.fromEntries(
            Object.entries(response).filter(([_, v]) => v !== null)
          );

          if (response.designation) {
            this.cvForm.get('designation').setValue(response.designation);
          }
          this.apiService.showSpinner$.next(false);
          this.cvForm.patchValue(parsedData);
          this.errorMessage = '';
        },
        error: (error: any) => {
          this.apiService.showSpinner$.next(false);
          let errorMsg = '';
          this.cvForm.reset();
          if (error.status === 400) {
            errorMsg = error.error.error || 'Bad request. Please check your input.';
          } else if (error.status === 401) {
            errorMsg = 'Unauthorized. Please login again.';
          } else if (error.status === 413) {
            errorMsg = 'File size too large. Please upload a smaller file.';
          } else {
            errorMsg = 'An error occurred while parsing the resume. Please try again.';
          }
          this.errorMessage = errorMsg;
          console.error('Resume parsing error:', error);

          // Show error popup using SnackBarService directly
          this.snackBarService.showError(errorMsg);
        },
        complete: () => {
          // If needed, you could show a success message here
          // this.snackBarService.showSuccess('Resume parsed successfully!');
        }
      });
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

    deleteSkillChip(chip: any) {
      // Get current skills or initialize as empty array if undefined
      const skills = this.cvForm.get('skills').value || [];
      const index = skills.indexOf(chip);
      if (index !== -1) {
        skills.splice(index, 1);
        this.cvForm.get('skills').setValue(skills);
      }
    }

    // Popup functionality is now handled directly by the SnackBarService

    // City-related methods
    getAllCities() {
      this.apiService.fetchAllCities().subscribe({
        next: (response: any) => {
          this.cities = response.data;
        },
        error: (error: any) => {
          console.error('Error fetching cities:', error);
        }
      });
    }

    filterCities(event: any, fieldName: string) {
      const query = event.target.value.toLowerCase();
      if (!query) {
        this.filteredCitiesMap[fieldName] = [];
        return;
      }

      this.filteredCitiesMap[fieldName] = this.cities.filter((city: any) =>
        city.city.toLowerCase().includes(query)
      ).slice(0, 10); // Limit to 10 results for performance
    }

    selectCity(city: any, fieldName: string) {
      this.cvForm.get(fieldName).setValue(city.city);
      this.showCityDropdown[fieldName] = false;
    }

    hideCityDropdownDelayed(fieldName: string) {
      setTimeout(() => {
        this.showCityDropdown[fieldName] = false;
      }, 200);
    }
}
