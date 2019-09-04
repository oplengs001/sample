import { TestBed } from '@angular/core/testing';

import { GuestAddService } from './guest-add.service';

describe('GuestAddService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuestAddService = TestBed.get(GuestAddService);
    expect(service).toBeTruthy();
  });
});
