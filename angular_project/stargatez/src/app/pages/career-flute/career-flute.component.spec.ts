import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerFluteComponent } from './career-flute.component';

describe('CareerFluteComponent', () => {
  let component: CareerFluteComponent;
  let fixture: ComponentFixture<CareerFluteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CareerFluteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CareerFluteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
