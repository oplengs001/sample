import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingcontentPage } from './slidingcontent.page';

describe('SlidingcontentPage', () => {
  let component: SlidingcontentPage;
  let fixture: ComponentFixture<SlidingcontentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidingcontentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidingcontentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
