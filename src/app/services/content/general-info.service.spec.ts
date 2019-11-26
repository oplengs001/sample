import { TestBed } from '@angular/core/testing';

import { GeneralInfoService } from './general-info.service';

describe('GeneralInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneralInfoService = TestBed.get(GeneralInfoService);
    expect(service).toBeTruthy();
  });
});
