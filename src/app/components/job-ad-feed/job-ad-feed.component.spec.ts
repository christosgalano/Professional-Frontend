import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAdFeedComponent } from './job-ad-feed.component';

describe('JobAdFeedComponent', () => {
  let component: JobAdFeedComponent;
  let fixture: ComponentFixture<JobAdFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobAdFeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
