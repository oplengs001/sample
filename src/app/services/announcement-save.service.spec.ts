import { TestBed } from '@angular/core/testing';

import { AnnouncementSaveService } from './announcement-save.service';

describe('AnnouncementSaveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnnouncementSaveService = TestBed.get(AnnouncementSaveService);
    expect(service).toBeTruthy();
  });
});
