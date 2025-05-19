import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConstants } from '../../assets/constants/app.constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseURL: string = appConstants.baseURLAdminAPIs;
  contactBaseURL: string = appConstants.contactAPIs;
  showSpinner$ = new BehaviorSubject<boolean>(false);
  jsonFilePath = 'assets/json/blogs.json'; // Path to the JSON file
  GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${appConstants.GEMINI_API_KEY}`; // Update with actual Gemini API endpoint
  baseUrl: any = "https://app.careerflute.com/api/parse-resume";
  submitCvUrl: any = "https://app.careerflute.com/api/save-resume";

  constructor(private http: HttpClient) {}

  parseResume(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.GEMINI_API_URL}`, data, { headers });
  }

  parseResumeAllFiles(file: any) {
    const formData = new FormData();
    formData.append('resume_file', file);

    return this.http.post(`${this.baseUrl}`, formData, {
      headers: new HttpHeaders({ 'enctype': 'multipart/form-data' })
    });
  }

  getDynamicDay(day) {
    let dayString = 'Day';
    if (+day > 1 || +day === 0) {
      dayString = 'Days';
    }
    return dayString;
  }

  getDynamicYear(year) {
    let yearString = 'Year';
    if (+year > 1 || +year === 0 || year === '30+') {
      yearString = 'Years';
    }
    return yearString;
  }

  getDynamicMonth(month) {
    let monthString = 'Month';
    if (+month > 1 || +month === 0) {
      monthString = 'Months';
    }
    return monthString;
  }

  getDynamicLac(lac) {
    let lacString = 'Lac';
    if (+lac > 1 || +lac === 0) {
      lacString = 'Lacs';
    }
    return lacString;
  }

  getDynamicThousand(thousand) {
    let thousandString = 'Thousand';
    if (+thousand > 1 || +thousand === 0) {
      thousandString = 'Thousands';
    }
    return thousandString;
  }

  submitCvData(formData: any) {
    const data = new FormData();

    // Append resume file if available
    if (formData.resumeFile) {
      data.append('resume_file', formData.resumeFile);
    }
    // Append resume file if available
    if (formData.partnerName) {
      data.append('partner_name', formData.partnerName);
    }

    // Map form fields to API expected fields
    data.append('candidate_name', formData.fullName);
    data.append('phone_number', formData.phoneNumber);
    data.append('email', formData.email);
    data.append('skills', formData.skills.join(','));
    data.append('total_experience_years', formData.totalExpYear);
    data.append('total_experience_months', formData.totalExpMonth);
    data.append('relevant_experience_years', formData.relevantExpYear);
    data.append('relevant_experience_months', formData.relevantExpMonth);
    data.append('current_company', formData.currentCompany || '');
    data.append('current_location', formData.currentLocation || '');
    data.append('preferred_location', formData.preferredLocation || '');
    data.append('current_salary_lacs', formData.currentSalaryLacs || '');
    data.append('current_salary_thousands', formData.currentSalaryThousands || '');
    data.append('expected_salary_lacs', formData.expectedSalaryLacs || '');
    data.append('expected_salary_thousands', formData.expectedSalaryThousands || '');
    data.append('notice_period', formData.noticePeriod || '');
    data.append('country_code', formData.countryCode || '');
    data.append('designation', formData.designation || '');
    data.append('qualification', formData.qualification || '');
    data.append('university', formData.university || '');
    data.append('industry', formData.industry || '');
    data.append('home_town', formData.homeTown || '');
    data.append('comments', formData.comments || '');
    data.append('resume_content', formData.resumeContent || '');
    data.append('submitted_from', formData.submitted_from || '');

    return this.http.post(`${this.submitCvUrl}`, data, {
      headers: new HttpHeaders({ 'enctype': 'multipart/form-data' })
    });
  }

  fetchAllCountries() {
    return this.http.get('https://restcountries.com/v3.1/all');
  }

  // fetchAllCities() {
  //   return this.http.get('https://countriesnow.space/api/v0.1/countries/population/cities');
  // }

  fetchAllCities(params: { search: string }) {
    return this.http.post(`https://app.careerflute.com/api/cities?search=${params.search}`, params);
  }  

  fetchAllPartners(params: { search: string }) {
    return this.http.post(`https://app.careerflute.com/api/partners?search=${params.search}`, params);
  }  
}
