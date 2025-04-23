import { TestBed } from '@angular/core/testing';

import { ServeiEmailService } from './servei-email.service';

describe('ServeiEmailService', () => {
  let service: ServeiEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServeiEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
