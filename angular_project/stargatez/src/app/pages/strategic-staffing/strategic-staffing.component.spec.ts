import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicStaffingComponent } from './strategic-staffing.component';

describe('StrategicStaffingComponent', () => {
  let component: StrategicStaffingComponent;
  let fixture: ComponentFixture<StrategicStaffingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StrategicStaffingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StrategicStaffingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
