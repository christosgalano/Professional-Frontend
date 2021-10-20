import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMessageItemComponent } from './send-message-item.component';

describe('SendMessageItemComponent', () => {
  let component: SendMessageItemComponent;
  let fixture: ComponentFixture<SendMessageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendMessageItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMessageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
