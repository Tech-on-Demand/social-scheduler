import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '@turbotech/social-nestjs-libraries/database/prisma/database.module';
import { ApiModule } from '@turbotech/social-backend/api/api.module';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from '@turbotech/social-backend/services/auth/permissions/permissions.guard';
import { PublicApiModule } from '@turbotech/social-backend/public-api/public.api.module';
import { ThrottlerBehindProxyGuard } from '@turbotech/social-nestjs-libraries/throttler/throttler.provider';
import { ThrottlerModule } from '@nestjs/throttler';
import { AgentModule } from '@turbotech/social-nestjs-libraries/agent/agent.module';
import { ThirdPartyModule } from '@turbotech/social-nestjs-libraries/3rdparties/thirdparty.module';
import { VideoModule } from '@turbotech/social-nestjs-libraries/videos/video.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { FILTER } from '@turbotech/social-nestjs-libraries/sentry/sentry.exception';
import { ChatModule } from '@turbotech/social-nestjs-libraries/chat/chat.module';
import { TemporalStubModule } from '@turbotech/social-nestjs-libraries/temporal/temporal.stub.module';
import { BootstrapModule } from '@turbotech/social-nestjs-libraries/bootstrap/bootstrap.module';
import { HealthModule } from '@turbotech/social-backend/api/health/health.module';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ioRedis } from '@turbotech/social-nestjs-libraries/redis/redis.service';
import { SupabaseModule } from '@turbotech/social-nestjs-libraries/supabase/supabase.module';
import { PublishModule } from '@turbotech/social-nestjs-libraries/publish/publish.module';
import { PublishController } from '@turbotech/social-nestjs-libraries/publish/publish.controller';

@Global()
@Module({
  imports: [
    SentryModule.forRoot(),
    DatabaseModule,
    ApiModule,
    PublicApiModule,
    AgentModule,
    ThirdPartyModule,
    VideoModule,
    ChatModule,
    TemporalStubModule,
    BootstrapModule,
    HealthModule,
    SupabaseModule,
    PublishModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 3600000,
          limit: process.env.API_LIMIT ? Number(process.env.API_LIMIT) : 30,
        },
      ],
      storage: new ThrottlerStorageRedisService(ioRedis),
    }),
  ],
  controllers: [PublishController],
  providers: [
    FILTER,
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
  exports: [
    DatabaseModule,
    ApiModule,
    PublicApiModule,
    AgentModule,
    ThrottlerModule,
    ChatModule,
  ],
})
export class AppModule {}
