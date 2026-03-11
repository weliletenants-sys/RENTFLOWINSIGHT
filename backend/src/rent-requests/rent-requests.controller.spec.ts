import { Test, TestingModule } from '@nestjs/testing';
import { RentRequestsController } from './rent-requests.controller';

describe('RentRequestsController', () => {
  let controller: RentRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentRequestsController],
    }).compile();

    controller = module.get<RentRequestsController>(RentRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
