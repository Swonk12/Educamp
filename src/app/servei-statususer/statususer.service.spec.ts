import { TestBed } from '@angular/core/testing';

import { StatususerService } from './statususer.service';

describe('StatususerService', () => {
  let service: StatususerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatususerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
