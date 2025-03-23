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
  baseUrl: any = "https://candidates-management.xcodie.com/api/parse-resume";
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

  fetchAllCountries() {
    return this.http.get('https://restcountries.com/v3.1/all');
  }
}
