import { TestBed } from '@angular/core/testing';

import { DataConverterConfigService } from './data-converter-config.service';

describe('DataConverterConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataConverterConfigService = TestBed.get(DataConverterConfigService);
    expect(service).toBeTruthy();
  });
});
