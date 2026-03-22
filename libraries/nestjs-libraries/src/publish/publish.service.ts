import { Injectable, Logger } from '@nestjs/common';
import {
  SupabaseService,
  SocialAccount,
} from '@turbotech/social-nestjs-libraries/supabase/supabase.service';
import { socialIntegrationList } from '@turbotech/social-nestjs-libraries/integrations/integration.manager';
import {
  PostDetails,
  PostResponse,
  MediaContent,
} from '@turbotech/social-nestjs-libraries/integrations/social/social.integrations.interface';
import { Integration } from '@prisma/client';

export interface PublishRequest {
  postId: string;
  content: string;
  platforms: string[];
  mediaUrls?: string[];
  userId: string;
}

export interface PlatformResult {
  platform: string;
  success: boolean;
  postId?: string;
  releaseURL?: string;
  error?: string;
}

@Injectable()
export class PublishService {
  private readonly logger = new Logger(PublishService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async publish(request: PublishRequest): Promise<PlatformResult[]> {
    const { postId, content, platforms, mediaUrls, userId } = request;
    const results: PlatformResult[] = [];

    for (const platform of platforms) {
      try {
        const account = await this.supabase.getSocialAccount(userId, platform);
        if (!account) {
          results.push({
            platform,
            success: false,
            error: `No ${platform} account linked for this user`,
          });
          continue;
        }

        const provider = socialIntegrationList.find(
          (p) => p.identifier === platform
        );
        if (!provider) {
          results.push({
            platform,
            success: false,
            error: `Provider not found: ${platform}`,
          });
          continue;
        }

        const postDetails = this.buildPostDetails(
          postId,
          content,
          mediaUrls
        );
        const fakeIntegration = this.buildFakeIntegration(account);

        const responses: PostResponse[] = await provider.post(
          account.platform_id,
          account.access_token,
          postDetails,
          fakeIntegration
        );

        const first = responses[0];
        results.push({
          platform,
          success: true,
          postId: first?.postId,
          releaseURL: first?.releaseURL,
        });

        this.logger.log(
          `Published to ${platform}: postId=${first?.postId} url=${first?.releaseURL}`
        );
      } catch (err: any) {
        const msg = err?.message || String(err);
        this.logger.error(`Failed to publish to ${platform}: ${msg}`);
        results.push({
          platform,
          success: false,
          error: msg,
        });
      }
    }

    return results;
  }

  private buildPostDetails(
    postId: string,
    content: string,
    mediaUrls?: string[]
  ): PostDetails[] {
    const media: MediaContent[] = (mediaUrls || []).map((url) => ({
      type: url.match(/\.(mp4|mov|avi|webm)$/i) ? 'video' : 'image',
      path: url,
    }));

    return [
      {
        id: postId,
        message: content,
        settings: {},
        ...(media.length > 0 ? { media } : {}),
      },
    ];
  }

  /**
   * Build a minimal Integration object from Supabase social_account data.
   * The providers use Integration for metadata but the actual token comes
   * from the accessToken parameter — so most fields can be stubs.
   */
  private buildFakeIntegration(account: SocialAccount): Integration {
    return {
      id: account.id,
      internalId: account.platform_id,
      organizationId: '',
      name: account.account_name || account.platform,
      providerIdentifier: account.platform,
      token: account.access_token,
      refreshToken: account.refresh_token || '',
      expiresIn: account.token_expires_at
        ? Math.floor(
            (new Date(account.token_expires_at).getTime() - Date.now()) / 1000
          )
        : 999999,
      type: 'social',
      profile: '',
      picture: '',
      disabled: false,
      tokenExpiration: account.token_expires_at
        ? new Date(account.token_expires_at)
        : new Date(Date.now() + 86400000),
      refreshNeeded: false,
      deletedAt: null,
      inBetweenSteps: false,
      isBetweenSteps: false,
      refreshWait: false,
      additionalSettings: null,
      customInstanceDetails: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Integration;
  }
}
