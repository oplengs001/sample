import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementsPage } from './announcements.page';

describe('AnnouncementsPage', () => {
  let component: AnnouncementsPage;
  let fixture: ComponentFixture<AnnouncementsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncementsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
