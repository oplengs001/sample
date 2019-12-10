import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RsvpAdminPage } from './rsvp-admin.page';

describe('RsvpAdminPage', () => {
  let component: RsvpAdminPage;
  let fixture: ComponentFixture<RsvpAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RsvpAdminPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RsvpAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
