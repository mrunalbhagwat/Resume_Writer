import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SnackBarService } from '../../services/snack-bar.service';

declare var AOS: any;

@Component({
  selector: 'app-resume-writer',
  templateUrl: './resume-writer.component.html',
  styleUrl: './resume-writer.component.scss',
})
export class ResumeWriterComponent implements OnInit {
  videoLink: any = 'assets/videos/resume_writer.mp4';
  errorPopupMessage: string = '';
  showErrorPopup: boolean = false;
  yearsList = [...Array(30).keys(), '30+'];  // [0,1,...,30,'30+']
  monthsList = [...Array(12).keys()];  // [0,1,...,11]
  lacsList = [...Array(100).keys()];  // [0,1,...,10]
  thousandsList = [...Array(100).keys()];  // [0,1,...,9]
  noticePeriodList = [...Array(91).keys()];  // [0,1,...,90]
  cvForm: FormGroup | any;
  parsedData: any = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  currencies: any = [];
  countryCallCodes: any = [];
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

  constructor(
    private fb: FormBuilder,
    public apiService: ApiService,
    private snackBarService: SnackBarService
  ) {}


  resetCvForm() {
    // Reset form after successful submission
    this.cvForm.reset();
        
    // Set default values again
    this.cvForm.patchValue({
      submitted_from: 'partner',
      totalExpYear: '0',
      totalExpMonth: '0',
      relevantExpYear: '0',
      relevantExpMonth: '0',
      currentSalaryLacs: '0',
      currentSalaryThousands: '0',
      expectedSalaryLacs: '0',
      expectedSalaryThousands: '0',
      noticePeriod: '0',
      skills: []
    });
  }


  onSubmit() {
    if (this.cvForm?.invalid) {
      this.cvForm.markAllAsTouched();
      this.errorPopupMessage = 'Please fill in all required fields.';
      this.showErrorPopup = true;
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

        // Show success popup using SnackBarService
        this.snackBarService.showSuccess(
          'Your CV has been submitted successfully!'
        );

        // Reset form after successful submission
        this.resetCvForm();
        this.fileName = '';
        this.fileSize = '';
        this.fileUrl = null;
        this.fileUploaded = false;
      },
      error: (error: any) => {
        console.error('Error submitting CV:', error);
        this.apiService.showSpinner$.next(false);
        this.resetCvForm();
        // Show error popup using SnackBarService
        let errorMsg =
          'There was an error submitting your CV. Please try again.';
        if (error.status === 400) {
          errorMsg =
            error.error.error || 'Bad request. Please check your input.';
        } else if (error.status === 401) {
          errorMsg = 'Unauthorized. Please login again.';
        } else if (error.status === 413) {
          errorMsg = 'File size too large. Please upload a smaller file.';
        } else if (error.status === 429) {
          errorMsg = 'Too many requests. Please try again later.';
        }
        this.errorPopupMessage = errorMsg;
        this.showErrorPopup = true;
      },
    });
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
  }

  validateNumberInput(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
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

  ngOnInit() {
    // web hook
    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 1000,
          once: true,
        });
      }
    }, 0);
    this.cvForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      currentLocation: ['', Validators.required],
      homeTown: ['', Validators.required],
      submitted_from: ['resume_writing', Validators.required],
      qualification: ['', Validators.required],
      designation: ['', Validators.required],
      resumeContent: [''],
      skills: [[], Validators.required],
      totalExpYear: [
        '0',
        [Validators.required],
      ], 
      totalExpMonth: [
        '0',
        [Validators.required],
      ],
      relevantExpYear: [
        '0',
        [Validators.required],
      ], 
      relevantExpMonth: [
        '0',
        [Validators.required],
      ],
      currentCompany: ['', Validators.required],
      currentSalaryLacs: ['0', Validators.required],
      currentSalaryThousands: ['0', Validators.required],
      expectedSalaryLacs: ['0', Validators.required],
      expectedSalaryThousands: ['0', Validators.required],
      noticePeriod: [
        '0',
        [Validators.required, Validators.min(0), Validators.max(90)],
      ],
      resume: [''],
      comments: [''],
      skillsInput: [''],
    });
    this.fetchCountries();
    this.getAllCities();
    // Initialize the character count if there's an initial value
    const initialComments = this.cvForm.get('comments')?.value || '';
    this.commentCharCount = initialComments.length;
  }

  // Password toggle methods removed as they're not needed

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
      } catch (error: any) {
        this.errorMessage = `Error parsing resume: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    };

    reader.readAsDataURL(file);
  }

  validateExperienceInput(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
    ];
    if (allowedKeys.includes(event.key)) {
      return; // Allow special keys
    }

    // Only allow digits
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Get current value and new value after key press
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const newValue = currentValue + event.key;

    // Prevent input if it would result in a value greater than 99
    if (parseInt(newValue) > 99) {
      event.preventDefault();
    }
  }

  validateExperiencePaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData?.getData('text') || '';

    // Check if pasted data contains only digits
    if (!/^\d+$/.test(pastedData)) {
      event.preventDefault();
      return;
    }

    // Get current value and new value after paste
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    const newValue =
      currentValue.substring(0, selectionStart) +
      pastedData +
      currentValue.substring(selectionEnd);

    // Prevent paste if it would result in a value greater than 99
    if (parseInt(newValue) > 99) {
      event.preventDefault();
    }
  }

  fetchCountries() {
    this.apiService.fetchAllCountries().subscribe((response: any) => {
      const currencySet = new Set();
      response.forEach((country: any) => {
        if (country.currencies) {
          Object.keys(country.currencies).forEach((code) => {
            if (!currencySet.has(code)) {
              currencySet.add(code);
              this.currencies.push({
                code,
                countryName: country.name.common,
                name: country.currencies[code].name,
                dialCode:
                  country.idd?.root +
                  (country.idd?.suffixes ? country.idd.suffixes[0] : ''),
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
    const inputValue = e.target.value.trim();

    if (!inputValue) {
      this.cvForm.get('skillsInput').setValue('');
      return true;
    }

    // Split by comma and trim each skill
    const newSkillsInput = inputValue
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill);

    // Create a case-insensitive set of existing skills for duplicate checking
    const existingSkillsLowerCase = currentSkills.map((skill) =>
      skill.toLowerCase()
    );

    // Filter out duplicates (case-insensitive)
    const uniqueNewSkills = newSkillsInput.filter(
      (skill) => !existingSkillsLowerCase.includes(skill.toLowerCase())
    );

    // Add unique new skills to the beginning of the array
    if (uniqueNewSkills.length > 0) {
      const updatedSkills = [...uniqueNewSkills, ...currentSkills];
      this.cvForm.get('skills')?.setValue(updatedSkills);
    }

    this.cvForm.get('skillsInput').setValue('');
    return true; // Return true to allow chaining with preventDefault
  }

  parseResume(_: string, file: File) {
    // Show spinner while parsing
    this.apiService.showSpinner$.next(true);

    // this.apiService.parseResume(requestBody).subscribe((response: any) => {
    this.apiService.parseResumeAllFiles(file).subscribe((response: any) => {
      if (response.countryCode && !response.countryCode.includes('+')) {
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
    }, (error: any) => {
      this.apiService.showSpinner$.next(false);
      let errorMsg = '';
      this.resetCvForm();
      if (error.status === 400) {
        errorMsg =
          error.error.error || 'Bad request. Please check your input.';
      } else if (error.status === 401) {
        errorMsg = 'Unauthorized. Please login again.';
      } else if (error.status === 413) {
        errorMsg = 'File size too large. Please upload a smaller file.';
      } else if (error.status === 429) {
        errorMsg = 'Too many requests. Please try again later.';
      } else {
        errorMsg =
          'An error occurred while parsing the resume. Please try again.';
      } 
      this.errorMessage = errorMsg;
      console.error('Resume parsing error:', error);

      // Show error popup using SnackBarService directly
      this.errorPopupMessage = errorMsg;
      this.showErrorPopup = true;
    },
  );
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

  cities: any = [];
  showCityDropdown: any = {};
  filteredCitiesMap: any = {};
  dropdownTimeouts: any = {};

  getAllCities() {
    this.apiService.fetchAllCities({ search: '' }).subscribe({
      next: (response: any) => {
        this.cities = response.data;
      },
      error: (error: any) => {
        console.error('Error fetching cities:', error);
      },
    });
  }

  filterCities(event: any, controlName: string) {
    const value = event.target.value.toLowerCase();
    if (value.length > 0) {
      // Call API with city name as query parameter
      this.apiService.fetchAllCities({ search: value }).subscribe({
        next: (response: any) => {
          this.filteredCitiesMap[controlName] = response.cities.slice(0, 10); // Limit to 10 results for performance
          this.showCityDropdown[controlName] = true;
        },
        error: (error: any) => {
          console.error('Error searching cities:', error);
          this.filteredCitiesMap[controlName] = [];
          this.showCityDropdown[controlName] = false;
        },
      });
    } else {
      this.filteredCitiesMap[controlName] = [];
      this.showCityDropdown[controlName] = false;
    }
  }

  selectCity(city: any, fieldName: string) {
    this.cvForm.get(fieldName).setValue(city.name);
    this.showCityDropdown[fieldName] = false;
  }

  hideCityDropdownDelayed(fieldName: string) {
    this.dropdownTimeouts[fieldName] = setTimeout(() => {
      this.showCityDropdown[fieldName] = false;
    }, 200);
  }

  ngOnDestroy() {
    // Clear all timeouts
    Object.values(this.dropdownTimeouts).forEach((timeout: any) => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });
  }

  // Add this property to the class
  commentCharCount: number = 0;

  // Add this method to the class
  updateCharCount(event: any) {
    this.commentCharCount = event.target.value.length;
  }

  validateSalaryInput(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
    ];
    if (allowedKeys.includes(event.key)) {
      return; // Allow special keys
    }

    // Only allow digits
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Get current value and new value after key press
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const newValue = currentValue + event.key;

    // Prevent input if it would result in less than 4 or more than 7 digits
    if (newValue.length > 7) {
      event.preventDefault();
    }
  }

  validateNoticePeriodInput(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
    ];
    if (allowedKeys.includes(event.key)) {
      return; // Allow special keys
    }

    // Only allow digits
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Get current value and new value after key press
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const newValue = currentValue + event.key;

    // Prevent input if it would result in a value greater than 90
    if (parseInt(newValue) > 90) {
      event.preventDefault();
    }
  }

  validateNoticePeriodPaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData?.getData('text') || '';

    // Check if pasted data contains only digits
    if (!/^\d+$/.test(pastedData)) {
      event.preventDefault();
      return;
    }

    // Get current value and new value after paste
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    const newValue =
      currentValue.substring(0, selectionStart) +
      pastedData +
      currentValue.substring(selectionEnd);

    // Prevent paste if it would result in a value greater than 90
    if (parseInt(newValue) > 90) {
      event.preventDefault();
    }
  }

  validateSalaryPaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData?.getData('text') || '';

    // Check if pasted data contains only digits
    if (!/^\d+$/.test(pastedData)) {
      event.preventDefault();
      return;
    }

    // Get current value and new value after paste
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    const newValue =
      currentValue.substring(0, selectionStart) +
      pastedData +
      currentValue.substring(selectionEnd);

    // Prevent paste if it would result in less than 4 or more than 7 digits
    if (newValue.length > 7) {
      event.preventDefault();
    }
  }
}
