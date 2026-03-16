import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from '@turbotech/social-backend/api/routes/auth.controller';
import { AuthService } from '@turbotech/social-backend/services/auth/auth.service';
import { UsersController } from '@turbotech/social-backend/api/routes/users.controller';
import { AuthMiddleware } from '@turbotech/social-backend/services/auth/auth.middleware';
import { StripeController } from '@turbotech/social-backend/api/routes/stripe.controller';
import { StripeService } from '@turbotech/social-nestjs-libraries/services/stripe.service';
import { AnalyticsController } from '@turbotech/social-backend/api/routes/analytics.controller';
import { PoliciesGuard } from '@turbotech/social-backend/services/auth/permissions/permissions.guard';
import { PermissionsService } from '@turbotech/social-backend/services/auth/permissions/permissions.service';
import { IntegrationsController } from '@turbotech/social-backend/api/routes/integrations.controller';
import { IntegrationManager } from '@turbotech/social-nestjs-libraries/integrations/integration.manager';
import { SettingsController } from '@turbotech/social-backend/api/routes/settings.controller';
import { PostsController } from '@turbotech/social-backend/api/routes/posts.controller';
import { MediaController } from '@turbotech/social-backend/api/routes/media.controller';
import { UploadModule } from '@turbotech/social-nestjs-libraries/upload/upload.module';
import { BillingController } from '@turbotech/social-backend/api/routes/billing.controller';
import { NotificationsController } from '@turbotech/social-backend/api/routes/notifications.controller';
import { OpenaiService } from '@turbotech/social-nestjs-libraries/openai/openai.service';
import { ExtractContentService } from '@turbotech/social-nestjs-libraries/openai/extract.content.service';
import { CodesService } from '@turbotech/social-nestjs-libraries/services/codes.service';
import { CopilotController } from '@turbotech/social-backend/api/routes/copilot.controller';
import { PublicController } from '@turbotech/social-backend/api/routes/public.controller';
import { RootController } from '@turbotech/social-backend/api/routes/root.controller';
import { TrackService } from '@turbotech/social-nestjs-libraries/track/track.service';
import { ShortLinkService } from '@turbotech/social-nestjs-libraries/short-linking/short.link.service';
import { Nowpayments } from '@turbotech/social-nestjs-libraries/crypto/nowpayments';
import { WebhookController } from '@turbotech/social-backend/api/routes/webhooks.controller';
import { SignatureController } from '@turbotech/social-backend/api/routes/signature.controller';
import { AutopostController } from '@turbotech/social-backend/api/routes/autopost.controller';
import { SetsController } from '@turbotech/social-backend/api/routes/sets.controller';
import { ThirdPartyController } from '@turbotech/social-backend/api/routes/third-party.controller';
import { MonitorController } from '@turbotech/social-backend/api/routes/monitor.controller';
import { NoAuthIntegrationsController } from '@turbotech/social-backend/api/routes/no.auth.integrations.controller';
import { EnterpriseController } from '@turbotech/social-backend/api/routes/enterprise.controller';
import { OAuthAppController } from '@turbotech/social-backend/api/routes/oauth-app.controller';
import { ApprovedAppsController } from '@turbotech/social-backend/api/routes/approved-apps.controller';
import { OAuthController, OAuthAuthorizedController } from '@turbotech/social-backend/api/routes/oauth.controller';
import { AuthProviderManager } from '@turbotech/social-backend/services/auth/providers/providers.manager';
import { GithubProvider } from '@turbotech/social-backend/services/auth/providers/github.provider';
import { GoogleProvider } from '@turbotech/social-backend/services/auth/providers/google.provider';
import { FarcasterProvider } from '@turbotech/social-backend/services/auth/providers/farcaster.provider';
import { WalletProvider } from '@turbotech/social-backend/services/auth/providers/wallet.provider';
import { OauthProvider } from '@turbotech/social-backend/services/auth/providers/oauth.provider';

const authenticatedController = [
  UsersController,
  AnalyticsController,
  IntegrationsController,
  SettingsController,
  PostsController,
  MediaController,
  BillingController,
  NotificationsController,
  CopilotController,
  WebhookController,
  SignatureController,
  AutopostController,
  SetsController,
  ThirdPartyController,
  OAuthAppController,
  ApprovedAppsController,
  OAuthAuthorizedController,
];
@Module({
  imports: [UploadModule],
  controllers: [
    RootController,
    StripeController,
    AuthController,
    PublicController,
    MonitorController,
    EnterpriseController,
    NoAuthIntegrationsController,
    OAuthController,
    ...authenticatedController,
  ],
  providers: [
    AuthService,
    StripeService,
    OpenaiService,
    ExtractContentService,
    AuthMiddleware,
    PoliciesGuard,
    PermissionsService,
    CodesService,
    IntegrationManager,
    TrackService,
    ShortLinkService,
    Nowpayments,
    AuthProviderManager,
    GithubProvider,
    GoogleProvider,
    FarcasterProvider,
    WalletProvider,
    OauthProvider,
  ],
  get exports() {
    return [...this.imports, ...this.providers];
  },
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(...authenticatedController);
  }
}
