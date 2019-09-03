import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IteneraryPage } from './itenerary.page';

describe('IteneraryPage', () => {
  let component: IteneraryPage;
  let fixture: ComponentFixture<IteneraryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IteneraryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IteneraryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
