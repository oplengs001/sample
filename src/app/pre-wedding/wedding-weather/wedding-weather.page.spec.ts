import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingWeatherPage } from './wedding-weather.page';

describe('WeddingWeatherPage', () => {
  let component: WeddingWeatherPage;
  let fixture: ComponentFixture<WeddingWeatherPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeddingWeatherPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeddingWeatherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
