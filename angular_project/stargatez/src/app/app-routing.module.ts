import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { JobSeekerComponent } from './pages/job-seeker/job-seeker.component';
import { IndustriesComponent } from './pages/industries/industries.component';
import { PartnerPortalComponent } from './pages/partner-portal/partner-portal.component';
import { ResumeWriterComponent } from './pages/resume-writer/resume-writer.component';
import { StrategicStaffingComponent } from './pages/strategic-staffing/strategic-staffing.component';
import { CareerFluteComponent } from './pages/career-flute/career-flute.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path:  'home', component: HomeComponent},
  { path:  'about-us', component: AboutUsComponent},
  { path:  'contact-us', component: ContactUsComponent},
  { path:  'job-seeker', component: JobSeekerComponent},
  { path:  'industries', component: IndustriesComponent},
  { path:  'partner-portal', component: PartnerPortalComponent},
  { path:  'strategic-staffing', component: StrategicStaffingComponent},
  { path:  'resume-writer', component: ResumeWriterComponent},
  { path:  'career-flute', component: CareerFluteComponent},
];

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64]
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
