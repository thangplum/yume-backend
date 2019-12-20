import { Test, TestingModule } from '@nestjs/testing';
import { FlagResolver } from './flag.resolver';

describe('FlagResolver', () => {
  let resolver: FlagResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlagResolver],
    }).compile();

    resolver = module.get<FlagResolver>(FlagResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
