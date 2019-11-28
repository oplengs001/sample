import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RsvpPage } from './rsvp.page';

describe('RsvpPage', () => {
  let component: RsvpPage;
  let fixture: ComponentFixture<RsvpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RsvpPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RsvpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
