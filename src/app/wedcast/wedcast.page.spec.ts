import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WedcastPage } from './wedcast.page';

describe('WedcastPage', () => {
  let component: WedcastPage;
  let fixture: ComponentFixture<WedcastPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WedcastPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WedcastPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
