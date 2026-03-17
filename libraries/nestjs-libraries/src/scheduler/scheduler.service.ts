import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import PgBoss from 'pg-boss';

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SchedulerService.name);
  private boss: PgBoss;

  constructor() {
    this.boss = new PgBoss({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async onApplicationBootstrap() {
    await this.start();
  }

  async start() {
    await this.boss.start();
    await this.boss.work<{ postId: string }>('social-posts', async (job) => {
      this.logger.log(`Processing post: ${job.data.postId}`);
    });
    this.logger.log('SchedulerService started, worker registered for social-posts');
  }

  async schedulePost(postId: string, publishAt: Date): Promise<string | null> {
    const jobId = await this.boss.send(
      'social-posts',
      { postId },
      { startAfter: publishAt }
    );
    this.logger.log(`Scheduled post ${postId} for ${publishAt.toISOString()}, job: ${jobId}`);
    return jobId;
  }
}
