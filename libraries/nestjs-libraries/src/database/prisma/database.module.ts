import { Global, Module } from '@nestjs/common';
import { PrismaRepository, PrismaService, PrismaTransaction } from './prisma.service';
import { OrganizationRepository } from '@turbotech/social-nestjs-libraries/database/prisma/organizations/organization.repository';
import { OrganizationService } from '@turbotech/social-nestjs-libraries/database/prisma/organizations/organization.service';
import { UsersService } from '@turbotech/social-nestjs-libraries/database/prisma/users/users.service';
import { UsersRepository } from '@turbotech/social-nestjs-libraries/database/prisma/users/users.repository';
import { SubscriptionService } from '@turbotech/social-nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { SubscriptionRepository } from '@turbotech/social-nestjs-libraries/database/prisma/subscriptions/subscription.repository';
import { NotificationService } from '@turbotech/social-nestjs-libraries/database/prisma/notifications/notification.service';
import { IntegrationService } from '@turbotech/social-nestjs-libraries/database/prisma/integrations/integration.service';
import { IntegrationRepository } from '@turbotech/social-nestjs-libraries/database/prisma/integrations/integration.repository';
import { PostsService } from '@turbotech/social-nestjs-libraries/database/prisma/posts/posts.service';
import { PostsRepository } from '@turbotech/social-nestjs-libraries/database/prisma/posts/posts.repository';
import { IntegrationManager } from '@turbotech/social-nestjs-libraries/integrations/integration.manager';
import { MediaService } from '@turbotech/social-nestjs-libraries/database/prisma/media/media.service';
import { MediaRepository } from '@turbotech/social-nestjs-libraries/database/prisma/media/media.repository';
import { NotificationsRepository } from '@turbotech/social-nestjs-libraries/database/prisma/notifications/notifications.repository';
import { EmailService } from '@turbotech/social-nestjs-libraries/services/email.service';
import { StripeService } from '@turbotech/social-nestjs-libraries/services/stripe.service';
import { ExtractContentService } from '@turbotech/social-nestjs-libraries/openai/extract.content.service';
import { OpenaiService } from '@turbotech/social-nestjs-libraries/openai/openai.service';
import { AgenciesService } from '@turbotech/social-nestjs-libraries/database/prisma/agencies/agencies.service';
import { AgenciesRepository } from '@turbotech/social-nestjs-libraries/database/prisma/agencies/agencies.repository';
import { TrackService } from '@turbotech/social-nestjs-libraries/track/track.service';
import { ShortLinkService } from '@turbotech/social-nestjs-libraries/short-linking/short.link.service';
import { WebhooksRepository } from '@turbotech/social-nestjs-libraries/database/prisma/webhooks/webhooks.repository';
import { WebhooksService } from '@turbotech/social-nestjs-libraries/database/prisma/webhooks/webhooks.service';
import { SignatureRepository } from '@turbotech/social-nestjs-libraries/database/prisma/signatures/signature.repository';
import { SignatureService } from '@turbotech/social-nestjs-libraries/database/prisma/signatures/signature.service';
import { AutopostRepository } from '@turbotech/social-nestjs-libraries/database/prisma/autopost/autopost.repository';
import { AutopostService } from '@turbotech/social-nestjs-libraries/database/prisma/autopost/autopost.service';
import { SetsService } from '@turbotech/social-nestjs-libraries/database/prisma/sets/sets.service';
import { SetsRepository } from '@turbotech/social-nestjs-libraries/database/prisma/sets/sets.repository';
import { ThirdPartyRepository } from '@turbotech/social-nestjs-libraries/database/prisma/third-party/third-party.repository';
import { ThirdPartyService } from '@turbotech/social-nestjs-libraries/database/prisma/third-party/third-party.service';
import { VideoManager } from '@turbotech/social-nestjs-libraries/videos/video.manager';
import { FalService } from '@turbotech/social-nestjs-libraries/openai/fal.service';
import { RefreshIntegrationService } from '@turbotech/social-nestjs-libraries/integrations/refresh.integration.service';
import { OAuthRepository } from '@turbotech/social-nestjs-libraries/database/prisma/oauth/oauth.repository';
import { OAuthService } from '@turbotech/social-nestjs-libraries/database/prisma/oauth/oauth.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    PrismaRepository,
    PrismaTransaction,
    UsersService,
    UsersRepository,
    OrganizationService,
    OrganizationRepository,
    SubscriptionService,
    SubscriptionRepository,
    NotificationService,
    NotificationsRepository,
    WebhooksRepository,
    WebhooksService,
    IntegrationService,
    IntegrationRepository,
    PostsService,
    PostsRepository,
    StripeService,
    SignatureRepository,
    AutopostRepository,
    AutopostService,
    SignatureService,
    MediaService,
    MediaRepository,
    AgenciesService,
    AgenciesRepository,
    IntegrationManager,
    RefreshIntegrationService,
    ExtractContentService,
    OpenaiService,
    FalService,
    EmailService,
    TrackService,
    ShortLinkService,
    SetsService,
    SetsRepository,
    ThirdPartyRepository,
    ThirdPartyService,
    OAuthRepository,
    OAuthService,
    VideoManager,
  ],
  get exports() {
    return this.providers;
  },
})
export class DatabaseModule {}
