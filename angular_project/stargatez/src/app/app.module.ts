import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ResumeWriterComponent } from './pages/resume-writer/resume-writer.component';
import { IndustriesComponent } from './pages/industries/industries.component';
import { JobSeekerComponent } from './pages/job-seeker/job-seeker.component';
import { PartnerPortalComponent } from './pages/partner-portal/partner-portal.component';
import { StrategicStaffingComponent } from './pages/strategic-staffing/strategic-staffing.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CareerFluteComponent } from './pages/career-flute/career-flute.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { ErrorPopupComponent } from './components/error-popup/error-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutUsComponent,
    ContactUsComponent,
    ResumeWriterComponent,
    IndustriesComponent,
    JobSeekerComponent,
    PartnerPortalComponent,
    StrategicStaffingComponent,
    HeaderComponent,
    FooterComponent,
    CareerFluteComponent,
    SpinnerComponent,
    SnackBarComponent,
    ErrorPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
