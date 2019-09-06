import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnnouncementPage } from './admin-announcement.page';

describe('AdminAnnouncementPage', () => {
  let component: AdminAnnouncementPage;
  let fixture: ComponentFixture<AdminAnnouncementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAnnouncementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAnnouncementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
