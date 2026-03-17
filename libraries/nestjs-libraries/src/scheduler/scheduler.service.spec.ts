import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';

jest.mock('pg-boss', () => {
  const mockBoss = {
    start: jest.fn().mockResolvedValue(undefined),
    work: jest.fn().mockResolvedValue(undefined),
    send: jest.fn().mockResolvedValue('mock-job-id-123'),
  };
  return jest.fn(() => mockBoss);
});

import PgBoss from 'pg-boss';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let mockBossInstance: jest.Mocked<PgBoss>;

  beforeEach(async () => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulerService],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
    // Get the mock instance
    mockBossInstance = (PgBoss as jest.MockedClass<typeof PgBoss>).mock.results[0]?.value;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('schedulePost() should call boss.send with correct args', async () => {
    const postId = 'post-123';
    const publishAt = new Date('2026-04-01T10:00:00Z');

    const jobId = await service.schedulePost(postId, publishAt);

    expect(mockBossInstance.send).toHaveBeenCalledWith(
      'social-posts',
      { postId },
      { startAfter: publishAt }
    );
    expect(jobId).toBe('mock-job-id-123');
  });
});
