import { TestBed, inject } from '@angular/core/testing';

import { LinkConnectService } from './link-connect.service';

describe('LinkConnectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LinkConnectService]
    });
  });

  it('should be created', inject([LinkConnectService], (service: LinkConnectService) => {
    expect(service).toBeTruthy();
  }));
});
