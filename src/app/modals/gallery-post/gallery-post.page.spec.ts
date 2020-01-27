import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryPostPage } from './gallery-post.page';

describe('GalleryPostPage', () => {
  let component: GalleryPostPage;
  let fixture: ComponentFixture<GalleryPostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryPostPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
