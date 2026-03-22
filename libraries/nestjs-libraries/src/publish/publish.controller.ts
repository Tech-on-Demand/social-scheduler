import { Body, Controller, Post, Logger } from '@nestjs/common';
import { PublishService, PublishRequest, PlatformResult } from './publish.service';

@Controller('/posts')
export class PublishController {
  private readonly logger = new Logger(PublishController.name);

  constructor(private readonly publishService: PublishService) {}

  @Post('/publish')
  async publish(
    @Body() body: PublishRequest
  ): Promise<{ results: PlatformResult[] }> {
    this.logger.log(
      `Publish request: postId=${body.postId} platforms=${body.platforms?.join(',')}`
    );

    if (!body.postId || !body.content || !body.platforms?.length || !body.userId) {
      throw new Error('Missing required fields: postId, content, platforms, userId');
    }

    const results = await this.publishService.publish(body);
    return { results };
  }
}
