import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PgBoss } from 'pg-boss';
import { PublishService } from '@turbotech/social-nestjs-libraries/publish/publish.service';
import { SupabaseService } from '@turbotech/social-nestjs-libraries/supabase/supabase.service';

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SchedulerService.name);
  private boss: PgBoss;

  constructor(
    private readonly publishService: PublishService,
    private readonly supabase: SupabaseService
  ) {
    this.boss = new PgBoss({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async onApplicationBootstrap() {
    await this.start();
  }

  async start() {
    await this.boss.start();
    await this.boss.createQueue('social-posts');
    await this.boss.work<{ postId: string }>('social-posts', async (jobs) => {
      for (const job of jobs) {
        await this.processJob(job.data.postId);
      }
    });
    this.logger.log('SchedulerService started, worker registered for social-posts');
  }

  private async processJob(postId: string) {
    this.logger.log(`Processing post: ${postId}`);

    const post = await this.supabase.getScheduledPost(postId);
    if (!post) {
      this.logger.error(`Post ${postId} not found in Supabase`);
      return;
    }

    if (post.status === 'posted') {
      this.logger.warn(`Post ${postId} already posted, skipping`);
      return;
    }

    await this.supabase.updatePostStatus(postId, 'publishing');

    try {
      const results = await this.publishService.publish({
        postId: post.id,
        content: post.content,
        platforms: post.platforms,
        mediaUrls: post.media_urls,
        userId: post.user_id,
      });

      const allSuccess = results.every((r) => r.success);
      const anySuccess = results.some((r) => r.success);
      const failures = results.filter((r) => !r.success);

      if (allSuccess) {
        await this.supabase.updatePostStatus(postId, 'posted', {
          posted_at: new Date().toISOString(),
        });
        this.logger.log(`Post ${postId} published to all platforms`);
      } else if (anySuccess) {
        // Partial success — mark posted but note errors
        const errorMsg = failures
          .map((f) => `${f.platform}: ${f.error}`)
          .join('; ');
        await this.supabase.updatePostStatus(postId, 'posted', {
          posted_at: new Date().toISOString(),
          error: `Partial failure: ${errorMsg}`,
        });
        this.logger.warn(`Post ${postId} partially published: ${errorMsg}`);
      } else {
        const errorMsg = failures
          .map((f) => `${f.platform}: ${f.error}`)
          .join('; ');
        await this.supabase.updatePostStatus(postId, 'failed', {
          error: errorMsg,
        });
        this.logger.error(`Post ${postId} failed on all platforms: ${errorMsg}`);
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      this.logger.error(`Post ${postId} publish error: ${msg}`);
      await this.supabase.updatePostStatus(postId, 'failed', { error: msg });
    }
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
