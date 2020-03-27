import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomResolver } from './classroom.resolver';

describe('ClassroomResolver', () => {
  let resolver: ClassroomResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassroomResolver],
    }).compile();

    resolver = module.get<ClassroomResolver>(ClassroomResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
