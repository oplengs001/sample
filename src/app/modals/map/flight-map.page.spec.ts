import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightMapPage } from './flight-map.page';

describe('FlightMapPage', () => {
  let component: FlightMapPage;
  let fixture: ComponentFixture<FlightMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
