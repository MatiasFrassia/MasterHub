import { TestBed } from '@angular/core/testing';

import { ConjurosService } from './conjuros.service';

describe('ConjurosService', () => {
  let service: ConjurosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConjurosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
