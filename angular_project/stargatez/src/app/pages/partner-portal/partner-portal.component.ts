import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
declare var AOS: any;

@Component({
  selector: 'app-partner-portal',
  templateUrl: './partner-portal.component.html',
  styleUrl: './partner-portal.component.scss',
})
export class PartnerPortalComponent implements OnInit {
  // videoLink: any = 'assets/videos/team_gathering.mp4';
  videoLink: any = 'assets/videos/handshake.mp4';
  cities: any = [];
  newPartner = true;
  errorPopupMessage: string = '';
  showErrorPopup: boolean = false;
  cvForm: FormGroup | any;
  parsedData: any = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  currencies: any = [];
  countryCallCodes: any = [];
  yearsList = [...Array(30).keys(), '30+']; // [0,1,...,30,'30+']
  monthsList = [...Array(12).keys()]; // [0,1,...,11]
  lacsList = [...Array(100).keys()]; // [0,1,...,10]
  thousandsList = [...Array(100).keys()]; // [0,1,...,9]
  noticePeriodList = [...Array(91).keys()]; // [0,1,...,90]
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
  filteredCities: Observable<any[]> | undefined;
  filteredCitiesMap: { [key: string]: any[] } = {};
  filteredPartners: Observable<any[]> | undefined;
  filteredPartnersMap: { [key: string]: any[] } = {};
  showCityDropdown: { [key: string]: boolean } = {};
  showPartnerDropdown: { [key: string]: boolean } = {};
  private dropdownTimeouts: { [key: string]: any } = {};
  commentCharCount: number = 0;

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

  constructor(
    private fb: FormBuilder,
    public apiService: ApiService,
    private snackBarService: SnackBarService
  ) { }

  getAllCities() {
    this.apiService
      .fetchAllCities({ search: '' })
      .subscribe((response: any) => {
        this.cities = response.data;
        console.log(this.cities);
      });
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

  closeErrorPopup() {
    this.showErrorPopup = false;
  }

  onSubmit() {
    if (this.cvForm?.invalid) {
      this.cvForm.markAllAsTouched();
      // Show error popup instead of snackbar
      this.errorPopupMessage = 'Please fill in all required fields.';
      this.showErrorPopup = true;
      // this.snackBarService.showError('Please fill in all required fields.');
      return;
    }

    this.apiService.showSpinner$.next(true);

    // Get form values
    const formData = this.cvForm.value;

    // Add the resume file if it exists
    if (this.fileInput?.nativeElement?.files?.length > 0) {
      formData.resumeFile = this.fileInput.nativeElement.files[0];
    }

    if (this.newPartner) {
      // If it's a new partner, send name, email and phone
      formData.partner_name = formData.partnerName;
      formData.partner_email = formData.partnerEmail;
      formData.partner_phone = formData.partnerPhoneNumber;
    } else {
      // If it's an existing partner, send partner_id
      const currentPartnerName = formData.partnerName;
      const foundPartner = this.filteredPartnersMap['partnerName']?.find(
        (p) => p.name === currentPartnerName
      );
      if (foundPartner) {
        formData.partner_id = foundPartner.id;
      }
    }

    this.apiService.submitCvData(formData).subscribe({
      next: (response: any) => {
        console.log('CV submitted successfully:', response);
        this.apiService.showSpinner$.next(false);

        // Show success popup using SnackBarService
        this.snackBarService.showSuccess(
          'Your CV has been submitted successfully!'
        );

        this.resetCvForm();
        
        this.fileName = '';
        this.fileSize = '';
        this.fileUrl = null;
        this.fileUploaded = false;
      },
      // Replace the error handling in onSubmit
      error: (error: any) => {
        console.error('Error submitting CV:', error);
        this.apiService.showSpinner$.next(false);

        // Set error message for popup
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

        // Show error popup instead of snackbar
        this.errorPopupMessage = errorMsg;
        this.showErrorPopup = true;
      },
    });
  }

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

  ngOnInit() {
    this.getAllCities();
    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 1000,
          once: true,
        });
      }
    }, 0);
    // web hook
    this.cvForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required]],
      partnerEmail: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      partnerPhoneNumber: ['', [Validators.required]],
      currentLocation: ['', Validators.required],
      homeTown: ['', Validators.required],
      qualification: ['', Validators.required],
      designation: ['', Validators.required],
      resumeContent: [''],
      submitted_from: ['partner', Validators.required],
      skills: [[], Validators.required],
      totalExpYear: ['0', [Validators.required]],
      totalExpMonth: ['0', [Validators.required]],
      relevantExpYear: ['0', [Validators.required]],
      relevantExpMonth: ['0', [Validators.required]],
      noticePeriod: [
        '0',
        [Validators.required, Validators.min(0), Validators.max(90)],
      ],
      currentCompany: ['', Validators.required],
      currentSalaryLacs: ['0', Validators.required],
      currentSalaryThousands: ['0', Validators.required],
      expectedSalaryLacs: ['0', Validators.required],
      expectedSalaryThousands: ['0', Validators.required],
      resume: [''],
      comments: [''],
      skillsInput: [''],
      partnerName: ['', Validators.required],
    });
    this.fetchCountries();
    // Setup city autocomplete
    // this.filteredCities = this.cvForm.get('currentLocation')!.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterCities(value as string || ''))
    // );
    // Initialize the character count if there's an initial value
    const initialComments = this.cvForm.get('comments')?.value || '';
    this.commentCharCount = initialComments.length;

    // Watch for changes in email and phone to reset partner name
    this.cvForm.get('partnerEmail')?.valueChanges.subscribe(() => {
      const currentPartnerName = this.cvForm.get('partnerName')?.value;
      const foundPartner = this.filteredPartnersMap['partnerName']?.find(
        (p) => p.name === currentPartnerName
      );
      this.newPartner = false;
      if (
        foundPartner.email !== null &&
        foundPartner &&
        foundPartner.email !== this.cvForm.get('partnerEmail')?.value
      ) {
        this.cvForm.get('partnerName')?.setValue('');
        this.newPartner = true;
      }
    });

    this.cvForm.get('partnerPhoneNumber')?.valueChanges.subscribe(() => {
      const currentPartnerName = this.cvForm.get('partnerName')?.value;
      const foundPartner = this.filteredPartnersMap['partnerName']?.find(
        (p) => p.name === currentPartnerName
      );
      this.newPartner = false;
      if (
        foundPartner.phone_number !== null &&
        foundPartner &&
        foundPartner.phone_number !=
        this.cvForm.get('partnerPhoneNumber')?.value
      ) {
        this.cvForm.get('partnerName')?.setValue('');
        this.newPartner = true;
      }
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
      } catch (error: any) {
        this.errorMessage = this.errorPopupMessage = `Error parsing resume: ${error.message}`;
        this.showErrorPopup = true;
      } finally {
        this.isLoading = false;
      }
    };

    reader.readAsDataURL(file);
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

    // Keeping this commented out as it's not currently used but might be needed later
    // const requestBody = {
    //   contents: [
    //     {
    //       role: 'user',
    //       parts: [
    //         { text: prompt },
    //         {
    //           inline_data: {
    //             mime_type: this.getMimeType(file.type),
    //             data: base64Content,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    //   generationConfig: {
    //     responseMimeType: 'application/json',
    //     temperature: 0.2,
    //     top_p: 0.8,
    //     top_k: 40,
    //     max_output_tokens: 2048,
    //   },
    // };

    // this.apiService.parseResume(requestBody).subscribe((response: any) => {
    this.apiService.parseResumeAllFiles(file).subscribe({
      next: (response: any) => {
        if (response.countryCode && !response.countryCode.includes('+')) {
          response.countryCode = '+' + response.countryCode.trim();
        }

        if (response.designation) {
          this.cvForm.get('designation').setValue(response.designation);
        }

        const parsedData = Object.fromEntries(
          Object.entries(response).filter(([_, v]) => v !== null)
        );

        this.apiService.showSpinner$.next(false);
        this.cvForm.patchValue(parsedData);
        this.errorMessage = '';
      },
      error: (error: any) => {
        this.apiService.showSpinner$.next(false);
        let errorMsg = '';
        this.resetCvForm();
        this.cvForm.get('submitted_from').setValue('partner');
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
        else {
          errorMsg =
            'An error occurred while parsing the resume. Please try again.';
        }

        this.errorMessage = this.errorPopupMessage = errorMsg;
        this.showErrorPopup = true;
        console.error('Resume parsing error:', error);

        // Show error popup using SnackBarService

      },
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
    // Ensure skills is always an array
    const skills = this.cvForm.get('skills').value || [];
    const skillsArray = Array.isArray(skills) ? skills : [];

    const index = skillsArray.indexOf(chip);
    if (index !== -1) {
      skillsArray.splice(index, 1);
      this.cvForm.get('skills').setValue(skillsArray);
    }
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

  filterPartnerNames(event: any, controlName: string) {
    const value = event.target.value.toLowerCase();
    if (value.length > 0) {
      // Call API with city name as query parameter
      this.apiService.fetchAllPartners({ search: value }).subscribe({
        next: (response: any) => {
          this.filteredPartnersMap[controlName] = response.partners.slice(
            0,
            10
          ); // Limit to 10 results for performance
          this.showPartnerDropdown[controlName] = true;
        },
        error: (error: any) => {
          console.error('Error searching cities:', error);
          this.filteredPartnersMap[controlName] = [];
          this.showPartnerDropdown[controlName] = false;
        },
      });
    } else {
      this.filteredPartnersMap[controlName] = [];
      this.showPartnerDropdown[controlName] = false;
    }
  }

  selectCity(city: any, formControlName: string) {
    this.cvForm.get(formControlName)?.setValue(city.name);
    this.showCityDropdown[formControlName] = false;
  }

  selectPartnerName(partner: any, formControlName: string) {
    this.cvForm.get(formControlName)?.setValue(partner.name);
    // Fetch and patch partner email and phone number

    partner.email
      ? this.cvForm.get('partnerEmail')?.setValue(partner.email)
      : this.cvForm.get('partnerEmail')?.setValue('');

    partner.phone_number
      ? this.cvForm.get('partnerPhoneNumber')?.setValue(partner.phone_number)
      : this.cvForm.get('partnerPhoneNumber')?.setValue('');

    this.showPartnerDropdown[formControlName] = false;
    this.newPartner = false;
  }

  hideDropdownDelayed(controlName: string) {
    // Use timeout to allow click to register before hiding
    this.dropdownTimeouts[controlName] = setTimeout(() => {
      this.showCityDropdown[controlName] = false;
    }, 200);
  }

  ngOnDestroy() {
    // Clear all timeouts
    Object.values(this.dropdownTimeouts).forEach((timeout) => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });
  }

  updateCharCount(event: any) {
    this.commentCharCount = event.target.value.length;
  }

  resetPartnerFields() {
    // Reset email and phone if partner name is changed manually
    setTimeout(() => {
      const partnerName = this.cvForm.get('partnerName')?.value;
      const foundPartner = this.filteredPartnersMap['partnerName']?.find(
        (p) => p.name === partnerName
      );
      this.newPartner = false;
      if (!foundPartner) {
        this.newPartner = true;
        this.cvForm.get('partnerEmail')?.setValue('');
        this.cvForm.get('partnerPhoneNumber')?.setValue('');
      }
    }, 300);
  }
}
