import { TestBed } from '@angular/core/testing';

import { TransitionsService } from './transitions.service';

describe('TransitionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransitionsService = TestBed.get(TransitionsService);
    expect(service).toBeTruthy();
  });
});
