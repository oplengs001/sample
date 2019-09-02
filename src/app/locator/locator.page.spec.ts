import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocatorPage } from './locator.page';

describe('LocatorPage', () => {
  let component: LocatorPage;
  let fixture: ComponentFixture<LocatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocatorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
