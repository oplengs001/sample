import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperImagePage } from './swiper-image.page';

describe('SwiperImagePage', () => {
  let component: SwiperImagePage;
  let fixture: ComponentFixture<SwiperImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwiperImagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
