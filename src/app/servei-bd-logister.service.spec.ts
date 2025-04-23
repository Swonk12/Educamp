import { TestBed } from '@angular/core/testing';

import { ServeiBdLogisterService } from './servei-bd-logister.service';

describe('ServeiBdLogisterService', () => {
  let service: ServeiBdLogisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServeiBdLogisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
