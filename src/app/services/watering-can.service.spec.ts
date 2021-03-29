import { TestBed } from '@angular/core/testing';

import { WateringCanService } from './watering-can.service';

describe('WateringCanService', () => {
  let service: WateringCanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WateringCanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
