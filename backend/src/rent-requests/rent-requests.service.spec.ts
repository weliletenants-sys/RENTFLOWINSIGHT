import { Test, TestingModule } from '@nestjs/testing';
import { RentRequestsService } from './rent-requests.service';

describe('RentRequestsService', () => {
  let service: RentRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentRequestsService],
    }).compile();

    service = module.get<RentRequestsService>(RentRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
