import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestaddPage } from './guestadd.page';

describe('GuestaddPage', () => {
  let component: GuestaddPage;
  let fixture: ComponentFixture<GuestaddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestaddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestaddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
