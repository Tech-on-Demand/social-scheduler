import { Module } from '@nestjs/common';
import { PublishService } from './publish.service';
import { SupabaseModule } from '@turbotech/social-nestjs-libraries/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [PublishService],
  exports: [PublishService],
})
export class PublishModule {}
