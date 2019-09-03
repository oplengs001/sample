import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionPage } from './reception.page';

describe('ReceptionPage', () => {
  let component: ReceptionPage;
  let fixture: ComponentFixture<ReceptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
