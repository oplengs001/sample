import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomodationsPage } from './accomodations.page';

describe('AccomodationsPage', () => {
  let component: AccomodationsPage;
  let fixture: ComponentFixture<AccomodationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccomodationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccomodationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
