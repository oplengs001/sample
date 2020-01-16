import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityPage } from './charity.page';

describe('CharityPage', () => {
  let component: CharityPage;
  let fixture: ComponentFixture<CharityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
