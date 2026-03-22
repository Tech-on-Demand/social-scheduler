import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PublishModule } from '@turbotech/social-nestjs-libraries/publish/publish.module';
import { SupabaseModule } from '@turbotech/social-nestjs-libraries/supabase/supabase.module';

@Module({
  imports: [PublishModule, SupabaseModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
