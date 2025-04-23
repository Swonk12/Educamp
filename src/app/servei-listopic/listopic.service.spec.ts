import { TestBed } from '@angular/core/testing';

import { ListopicService } from './listopic.service';

describe('ListopicService', () => {
  let service: ListopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
