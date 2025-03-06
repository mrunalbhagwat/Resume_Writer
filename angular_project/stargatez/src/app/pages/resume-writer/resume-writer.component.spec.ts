import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeWriterComponent } from './resume-writer.component';

describe('ResumeWriterComponent', () => {
  let component: ResumeWriterComponent;
  let fixture: ComponentFixture<ResumeWriterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumeWriterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResumeWriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
