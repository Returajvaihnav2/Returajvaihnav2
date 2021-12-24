import { TestBed } from '@angular/core/testing';

import { XmlToJsonService } from './xml-to-json.service';

describe('XmlToJsonService', () => {
  let service: XmlToJsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XmlToJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
