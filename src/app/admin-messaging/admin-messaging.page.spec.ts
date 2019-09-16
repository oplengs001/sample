import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMessagingPage } from './admin-messaging.page';

describe('AdminMessagingPage', () => {
  let component: AdminMessagingPage;
  let fixture: ComponentFixture<AdminMessagingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMessagingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMessagingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
