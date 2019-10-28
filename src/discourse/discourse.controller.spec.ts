import { Test, TestingModule } from '@nestjs/testing';
import { DiscourseController } from './discourse.controller';

describe('Discourse Controller', () => {
  let controller: DiscourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscourseController],
    }).compile();

    controller = module.get<DiscourseController>(DiscourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
