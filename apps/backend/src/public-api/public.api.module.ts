import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from '@turbotech/social-backend/services/auth/auth.service';
import { StripeService } from '@turbotech/social-nestjs-libraries/services/stripe.service';
import { PoliciesGuard } from '@turbotech/social-backend/services/auth/permissions/permissions.guard';
import { PermissionsService } from '@turbotech/social-backend/services/auth/permissions/permissions.service';
import { IntegrationManager } from '@turbotech/social-nestjs-libraries/integrations/integration.manager';
import { UploadModule } from '@turbotech/social-nestjs-libraries/upload/upload.module';
import { OpenaiService } from '@turbotech/social-nestjs-libraries/openai/openai.service';
import { ExtractContentService } from '@turbotech/social-nestjs-libraries/openai/extract.content.service';
import { CodesService } from '@turbotech/social-nestjs-libraries/services/codes.service';
import { PublicIntegrationsController } from '@turbotech/social-backend/public-api/routes/v1/public.integrations.controller';
import { PublicAuthMiddleware } from '@turbotech/social-backend/services/auth/public.auth.middleware';

const authenticatedController = [PublicIntegrationsController];
@Module({
  imports: [UploadModule],
  controllers: [...authenticatedController],
  providers: [
    AuthService,
    StripeService,
    OpenaiService,
    ExtractContentService,
    PoliciesGuard,
    PermissionsService,
    CodesService,
    IntegrationManager,
  ],
  get exports() {
    return [...this.imports, ...this.providers];
  },
})
export class PublicApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PublicAuthMiddleware).forRoutes(...authenticatedController);
  }
}

