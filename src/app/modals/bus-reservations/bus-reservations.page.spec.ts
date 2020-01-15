import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusReservationsPage } from './bus-reservations.page';

describe('BusReservationsPage', () => {
  let component: BusReservationsPage;
  let fixture: ComponentFixture<BusReservationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusReservationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusReservationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
