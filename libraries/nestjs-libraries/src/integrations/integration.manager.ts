import 'reflect-metadata';

import { Injectable } from '@nestjs/common';
import { XProvider } from '@turbotech/social-nestjs-libraries/integrations/social/x.provider';
import { SocialProvider } from '@turbotech/social-nestjs-libraries/integrations/social/social.integrations.interface';
import { LinkedinProvider } from '@turbotech/social-nestjs-libraries/integrations/social/linkedin.provider';
import { RedditProvider } from '@turbotech/social-nestjs-libraries/integrations/social/reddit.provider';
import { DevToProvider } from '@turbotech/social-nestjs-libraries/integrations/social/dev.to.provider';
import { HashnodeProvider } from '@turbotech/social-nestjs-libraries/integrations/social/hashnode.provider';
import { MediumProvider } from '@turbotech/social-nestjs-libraries/integrations/social/medium.provider';
import { FacebookProvider } from '@turbotech/social-nestjs-libraries/integrations/social/facebook.provider';
import { InstagramProvider } from '@turbotech/social-nestjs-libraries/integrations/social/instagram.provider';
import { YoutubeProvider } from '@turbotech/social-nestjs-libraries/integrations/social/youtube.provider';
import { TiktokProvider } from '@turbotech/social-nestjs-libraries/integrations/social/tiktok.provider';
import { PinterestProvider } from '@turbotech/social-nestjs-libraries/integrations/social/pinterest.provider';
import { DribbbleProvider } from '@turbotech/social-nestjs-libraries/integrations/social/dribbble.provider';
import { LinkedinPageProvider } from '@turbotech/social-nestjs-libraries/integrations/social/linkedin.page.provider';
import { ThreadsProvider } from '@turbotech/social-nestjs-libraries/integrations/social/threads.provider';
import { DiscordProvider } from '@turbotech/social-nestjs-libraries/integrations/social/discord.provider';
import { SlackProvider } from '@turbotech/social-nestjs-libraries/integrations/social/slack.provider';
import { MastodonProvider } from '@turbotech/social-nestjs-libraries/integrations/social/mastodon.provider';
import { BlueskyProvider } from '@turbotech/social-nestjs-libraries/integrations/social/bluesky.provider';
import { LemmyProvider } from '@turbotech/social-nestjs-libraries/integrations/social/lemmy.provider';
import { InstagramStandaloneProvider } from '@turbotech/social-nestjs-libraries/integrations/social/instagram.standalone.provider';
import { FarcasterProvider } from '@turbotech/social-nestjs-libraries/integrations/social/farcaster.provider';
import { TelegramProvider } from '@turbotech/social-nestjs-libraries/integrations/social/telegram.provider';
import { NostrProvider } from '@turbotech/social-nestjs-libraries/integrations/social/nostr.provider';
import { VkProvider } from '@turbotech/social-nestjs-libraries/integrations/social/vk.provider';
import { WordpressProvider } from '@turbotech/social-nestjs-libraries/integrations/social/wordpress.provider';
import { ListmonkProvider } from '@turbotech/social-nestjs-libraries/integrations/social/listmonk.provider';
import { GmbProvider } from '@turbotech/social-nestjs-libraries/integrations/social/gmb.provider';
import { KickProvider } from '@turbotech/social-nestjs-libraries/integrations/social/kick.provider';
import { TwitchProvider } from '@turbotech/social-nestjs-libraries/integrations/social/twitch.provider';
import { SocialAbstract } from '@turbotech/social-nestjs-libraries/integrations/social.abstract';
import { MoltbookProvider } from '@turbotech/social-nestjs-libraries/integrations/social/moltbook.provider';
import { SkoolProvider } from '@turbotech/social-nestjs-libraries/integrations/social/skool.provider';
import { WhopProvider } from '@turbotech/social-nestjs-libraries/integrations/social/whop.provider';
import { MeweProvider } from '@turbotech/social-nestjs-libraries/integrations/social/mewe.provider';

export const socialIntegrationList: Array<SocialAbstract & SocialProvider> = [
  new XProvider(),
  new LinkedinProvider(),
  new LinkedinPageProvider(),
  new RedditProvider(),
  new InstagramProvider(),
  new InstagramStandaloneProvider(),
  new FacebookProvider(),
  new ThreadsProvider(),
  new YoutubeProvider(),
  new GmbProvider(),
  new TiktokProvider(),
  new PinterestProvider(),
  new DribbbleProvider(),
  new DiscordProvider(),
  new SlackProvider(),
  new KickProvider(),
  new TwitchProvider(),
  new MastodonProvider(),
  new BlueskyProvider(),
  new LemmyProvider(),
  new FarcasterProvider(),
  new TelegramProvider(),
  new NostrProvider(),
  new VkProvider(),
  new MediumProvider(),
  new DevToProvider(),
  new HashnodeProvider(),
  new WordpressProvider(),
  new ListmonkProvider(),
  new MoltbookProvider(),
  new WhopProvider(),
  new SkoolProvider(),
  new MeweProvider(),
  // new MastodonCustomProvider(),
];

@Injectable()
export class IntegrationManager {
  async getAllIntegrations() {
    return {
      social: await Promise.all(
        socialIntegrationList.map(async (p) => ({
          name: p.name,
          identifier: p.identifier,
          toolTip: p.toolTip,
          editor: p.editor,
          isExternal: !!p.externalUrl,
          isWeb3: !!p.isWeb3,
          isChromeExtension: !!p.isChromeExtension,
          ...(p.extensionCookies ? { extensionCookies: p.extensionCookies } : {}),
          ...(p.customFields ? { customFields: await p.customFields() } : {}),
        }))
      ),
      article: [] as any[],
    };
  }

  getAllTools(): {
    [key: string]: {
      description: string;
      dataSchema: any;
      methodName: string;
    }[];
  } {
    return socialIntegrationList.reduce(
      (all, current) => ({
        ...all,
        [current.identifier]:
          Reflect.getMetadata('custom:tool', current.constructor.prototype) ||
          [],
      }),
      {}
    );
  }

  getAllRulesDescription(): {
    [key: string]: string;
  } {
    return socialIntegrationList.reduce(
      (all, current) => ({
        ...all,
        [current.identifier]:
          Reflect.getMetadata(
            'custom:rules:description',
            current.constructor
          ) || '',
      }),
      {}
    );
  }

  getAllPlugs() {
    return socialIntegrationList
      .map((p) => {
        return {
          name: p.name,
          identifier: p.identifier,
          plugs: (
            Reflect.getMetadata('custom:plug', p.constructor.prototype) || []
          )
            .filter((f: any) => !f.disabled)
            .map((p: any) => ({
              ...p,
              fields: p.fields.map((c: any) => ({
                ...c,
                validation: c?.validation?.toString(),
              })),
            })),
        };
      })
      .filter((f) => f.plugs.length);
  }

  getInternalPlugs(providerName: string) {
    const p = socialIntegrationList.find((p) => p.identifier === providerName)!;
    return {
      internalPlugs:
        (
          Reflect.getMetadata(
            'custom:internal_plug',
            p.constructor.prototype
          ) || []
        ).filter((f: any) => !f.disabled) || [],
    };
  }

  getAllowedSocialsIntegrations() {
    return socialIntegrationList.map((p) => p.identifier);
  }
  getSocialIntegration(integration: string): SocialProvider {
    return socialIntegrationList.find((i) => i.identifier === integration)!;
  }
}
