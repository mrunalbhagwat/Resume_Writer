import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerPortalComponent } from './partner-portal.component';

describe('PartnerPortalComponent', () => {
  let component: PartnerPortalComponent;
  let fixture: ComponentFixture<PartnerPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartnerPortalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartnerPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
