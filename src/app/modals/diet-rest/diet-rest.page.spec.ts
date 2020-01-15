import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DietRestPage } from './diet-rest.page';

describe('DietRestPage', () => {
  let component: DietRestPage;
  let fixture: ComponentFixture<DietRestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DietRestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DietRestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
