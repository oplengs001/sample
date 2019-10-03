import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalsPage } from './rentals.page';

describe('RentalsPage', () => {
  let component: RentalsPage;
  let fixture: ComponentFixture<RentalsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
