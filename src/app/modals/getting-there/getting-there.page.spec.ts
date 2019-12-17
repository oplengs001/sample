import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingTherePage } from './getting-there.page';

describe('GettingTherePage', () => {
  let component: GettingTherePage;
  let fixture: ComponentFixture<GettingTherePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GettingTherePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingTherePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
