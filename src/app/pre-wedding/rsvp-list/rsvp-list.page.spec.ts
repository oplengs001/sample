import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RsvpListPage } from './rsvp-list.page';

describe('RsvpListPage', () => {
  let component: RsvpListPage;
  let fixture: ComponentFixture<RsvpListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RsvpListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RsvpListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
