import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisasPage } from './visas.page';

describe('VisasPage', () => {
  let component: VisasPage;
  let fixture: ComponentFixture<VisasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
