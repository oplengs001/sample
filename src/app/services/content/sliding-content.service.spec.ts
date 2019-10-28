import { TestBed } from '@angular/core/testing';

import { SlidingContentService } from './sliding-content.service';

describe('SlidingContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlidingContentService = TestBed.get(SlidingContentService);
    expect(service).toBeTruthy();
  });
});
