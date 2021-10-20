import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobAdComponent } from './add-job-ad.component';

describe('AddJobAdComponent', () => {
  let component: AddJobAdComponent;
  let fixture: ComponentFixture<AddJobAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJobAdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJobAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
