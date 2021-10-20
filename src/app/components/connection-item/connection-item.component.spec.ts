import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionItemComponent } from './connection-item.component';

describe('ConnectionItemComponent', () => {
  let component: ConnectionItemComponent;
  let fixture: ComponentFixture<ConnectionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
