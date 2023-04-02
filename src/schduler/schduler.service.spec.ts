import { Test, TestingModule } from '@nestjs/testing';
import { SchdulerService } from './schduler.service';

describe('SchdulerService', () => {
  let service: SchdulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchdulerService],
    }).compile();

    service = module.get<SchdulerService>(SchdulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
