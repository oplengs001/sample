import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewingcontentPage } from './viewingcontent.page';

describe('ViewingcontentPage', () => {
  let component: ViewingcontentPage;
  let fixture: ComponentFixture<ViewingcontentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewingcontentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewingcontentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
